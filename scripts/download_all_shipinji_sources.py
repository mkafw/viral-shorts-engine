#!/usr/bin/env python3
"""
Systematically download and extract all sources (Guide + Fulltext) from NotebookLM '视频姬'
Notebook ID: 116b3583-2f70-4aac-a039-561114a88682
"""

import asyncio
import json
import os
import re
import sys
import time
from pathlib import Path
from notebooklm.client import NotebookLMClient

NOTEBOOK_ID = "116b3583-2f70-4aac-a039-561114a88682"
OUTPUT_DIR = Path("docs/shipinji_transcripts_raw")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def sanitize_filename(name: str) -> str:
    # remove .mp4 suffix if present
    if name.lower().endswith(".mp4"):
        name = name[:-4]
    # replace invalid characters
    name = re.sub(r'[\\/*?:"<>|#]', '_', name)
    name = re.sub(r'\s+', '_', name).strip('._ ')
    return name

async def fetch_with_retry(fn, *args, max_retries=4, delay=2.0, **kwargs):
    for attempt in range(max_retries):
        try:
            return await fn(*args, **kwargs)
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            wait_time = delay * (2 ** attempt)
            print(f"    [Retry {attempt+1}/{max_retries}] Error: {e}. Retrying in {wait_time:.1f}s...")
            await asyncio.sleep(wait_time)

async def main():
    print(f"Connecting to NotebookLM storage profile...")
    async with NotebookLMClient.from_storage() as client:
        print(f"Listing sources for notebook {NOTEBOOK_ID} ('视频姬')...")
        sources = await client.sources.list(NOTEBOOK_ID)
        total = len(sources)
        print(f"Total sources found: {total}")

        manifest = []

        for idx, src in enumerate(sources, 1):
            safe_title = sanitize_filename(src.title)
            filename = f"{idx:02d}_{safe_title}.md"
            filepath = OUTPUT_DIR / filename

            print(f"[{idx:02d}/{total}] Processing: {src.title} (ID: {src.id[:8]})...")

            # Check if file exists and is valid
            if filepath.exists() and filepath.stat().st_size > 100:
                print(f"    Already exists ({filepath.stat().st_size} bytes), reading cached metadata...")
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        content = f.read()
                    manifest.append({
                        "index": idx,
                        "id": src.id,
                        "title": src.title,
                        "filename": filename,
                        "chars": len(content),
                        "status": "cached"
                    })
                    continue
                except Exception:
                    pass

            # Fetch guide (summary & keywords)
            guide = None
            try:
                guide = await fetch_with_retry(client.sources.get_guide, NOTEBOOK_ID, src.id)
            except Exception as e:
                print(f"    [Warning] Failed to fetch guide for {src.title}: {e}")

            # Fetch fulltext
            fulltext = None
            try:
                fulltext = await fetch_with_retry(client.sources.get_fulltext, NOTEBOOK_ID, src.id)
            except Exception as e:
                print(f"    [Warning] Failed to fetch fulltext for {src.title}: {e}")

            summary = guide.summary if guide and hasattr(guide, "summary") else ""
            keywords = list(guide.keywords) if guide and hasattr(guide, "keywords") else []
            body = fulltext.content if fulltext and hasattr(fulltext, "content") else ""

            # Build markdown document
            md_lines = [
                f"# {src.title}",
                "",
                f"- **Source ID**: `{src.id}`",
                f"- **Index**: {idx:02d}/{total}",
                f"- **Keywords**: {', '.join(keywords) if keywords else 'None'}",
                f"- **Word/Char Count**: {len(body)} 字符",
                "",
                "## 核心提炼与导读 (AI Summary)",
                "",
                summary if summary else "_无导读摘要_",
                "",
                "## 完整逐字原声演讲记录 (Verbatim Transcript)",
                "",
                body if body else "_无语音转文字内容_",
                ""
            ]

            doc_text = "\n".join(md_lines)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(doc_text)

            print(f"    Saved to {filename} ({len(body)} chars, summary: {len(summary)} chars)")

            manifest.append({
                "index": idx,
                "id": src.id,
                "title": src.title,
                "filename": filename,
                "keywords": keywords,
                "summary": summary,
                "char_count": len(body),
                "status": "success"
            })

            # Gentle pacing to avoid triggering Google rate limit
            await asyncio.sleep(0.6)

        # Save manifest
        manifest_path = OUTPUT_DIR / "00_MANIFEST.json"
        with open(manifest_path, "w", encoding="utf-8") as f:
            json.dump({
                "notebook_id": NOTEBOOK_ID,
                "notebook_title": "视频姬",
                "total_sources": total,
                "sources": manifest
            }, f, ensure_ascii=False, indent=2)

        print(f"\nAll {total} sources successfully processed and saved to {OUTPUT_DIR}/")
        print(f"Manifest written to {manifest_path}")

if __name__ == "__main__":
    asyncio.run(main())
