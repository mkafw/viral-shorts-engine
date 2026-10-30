#!/usr/bin/env python3
import os
import sys
import time
from pathlib import Path

src_dir = Path("docs/shipinji_transcripts_raw")
dst_dir = Path("/home/qiyu/gdrive_active/影视蓝图/00-视频姬-88集官方逐字精炼原声库")
dst_dir.mkdir(parents=True, exist_ok=True)

files = sorted(list(src_dir.glob("*.md")) + list(src_dir.glob("*.json")))
total = len(files)
print(f"Total files to sync: {total}")

for idx, f in enumerate(files, 1):
    dst_f = dst_dir / f.name
    if dst_f.exists() and dst_f.stat().st_size == f.stat().st_size:
        print(f"[{idx:02d}/{total}] Skipping identical: {f.name}")
        continue
    
    print(f"[{idx:02d}/{total}] Writing: {f.name} ({f.stat().st_size} bytes)...")
    content = f.read_bytes()
    with open(dst_f, "wb") as out:
        out.write(content)
        out.flush()
    time.sleep(0.05)

print("\nSync completed successfully!")
