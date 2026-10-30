#!/usr/bin/env python3
"""
upgrade_master_books_v2.py
将 8 本 Master Books 升级为 v2.0 逐字稿精炼版。
数据来源：docs/shipinji_transcripts_raw/ (88集音频逐字稿)
"""

import os
import re
import json
from pathlib import Path

BASE_DIR = Path("/home/qiyu/repos/mofelo/viral-shorts-engine")
TRANSCRIPTS_DIR = BASE_DIR / "docs" / "shipinji_transcripts_raw"
MASTER_BOOKS_DIR = BASE_DIR / "docs" / "video-vault-cleaned" / "master-books"
INDEX_FILE = TRANSCRIPTS_DIR / "00_视频姬88集全集知识图谱与索引.md"

# 7大支柱对应8本手册的映射规则
# 支柱01 -> 01_故事板与白模 + 02_场景调度与俯视图
# 支柱02 -> 03_电影级运镜技巧
# 支柱04 -> 04_光影与去塑料感
# 支柱03 -> 05_角色锁脸与微表情
# 支柱05 -> 06_四维配音与音效
# 支柱06 + 支柱07部分 -> 07_模型实战与提示词案例
# 支柱07其余 + 综合 -> 08_短剧创作综合

BOOK_DEFINITIONS = {
    "01_故事板与白模_完整精炼手册.md": {
        "title": "AI 短剧工业化实操全集 · 故事板与白模白膜体系",
        "keywords_filter": ["白膜", "白模", "故事板", "九宫格", "灰模", "铁三角"],
        "pillar": "01_故事板与白模空间调度"
    },
    "02_场景调度与俯视图_完整精炼手册.md": {
        "title": "AI 短剧工业化实操全集 · 导演俯视图与空间调度体系",
        "keywords_filter": ["调度", "俯视", "站位", "固定场景"],
        "pillar": "01_故事板与白模空间调度"
    },
    "03_电影级运镜技巧_完整精炼手册.md": {
        "title": "AI 短剧工业化实操全集 · 电影级运镜与转场连贯体系",
        "keywords_filter": [],
        "pillar": "02_电影级运镜与转场连贯"
    },
    "04_光影与去塑料感_完整精炼手册.md": {
        "title": "AI 短剧工业化实操全集 · 光影色调与去塑料感美学体系",
        "keywords_filter": [],
        "pillar": "04_光影、色调与去塑料感美学"
    },
    "05_角色锁脸与微表情_完整精炼手册.md": {
        "title": "AI 短剧工业化实操全集 · 角色一致性、站位与微表情体系",
        "keywords_filter": [],
        "pillar": "03_角色一致性、站位与微表情"
    },
    "06_四维配音与音效_完整精炼手册.md": {
        "title": "AI 短剧工业化实操全集 · 四维发音与声音工程体系",
        "keywords_filter": [],
        "pillar": "05_四维发音与声音工程体系"
    },
    "07_模型实战与提示词案例_完整精炼手册.md": {
        "title": "AI 短剧工业化实操全集 · 高阶提示词与多模型工程实战",
        "keywords_filter": [],
        "pillar": "06_高阶提示词与工程工作流"
    },
    "08_短剧创作综合_完整精炼手册.md": {
        "title": "AI 短剧工业化实操全集 · 爆款短剧导演级综合实战",
        "keywords_filter": [],
        "pillar": "07_实战案例与模型评测"
    }
}

def clean_spaced_text(text: str) -> str:
    """去除中文汉字之间的单个空格，保留英文单词间的正常空格"""
    # 匹配中文字符与中文字符之间的空格
    text = re.sub(r'([\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef])\s+([\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef])', r'\1\2', text)
    # 二次匹配处理连续单字带空格
    for _ in range(3):
        text = re.sub(r'([\u4e00-\u9fa5])\s+([\u4e00-\u9fa5])', r'\1\2', text)
    return text.strip()

def parse_transcript_file(file_path: Path):
    content = file_path.read_text(encoding="utf-8")
    
    # 提取基本元数据
    title_match = re.search(r'^#\s*(.+)$', content, re.M)
    title = title_match.group(1).strip() if title_match else file_path.stem
    
    kw_match = re.search(r'-\s*\*\*Keywords\*\*:\s*(.+)$', content, re.M)
    keywords = kw_match.group(1).strip() if kw_match else ""
    
    # 提取 AI Summary
    summary = ""
    summary_match = re.search(r'## 核心提炼与导读 \(AI Summary\)\s*\n\n(.*?)(?=\n##|\Z)', content, re.S)
    if summary_match:
        summary = summary_match.group(1).strip()
        
    # 提取逐字稿
    transcript = ""
    transcript_match = re.search(r'## 完整逐字原声演讲记录 \(Verbatim Transcript\)\s*\n\n(.*?)(?=\n##|\Z)', content, re.S)
    if transcript_match:
        transcript = clean_spaced_text(transcript_match.group(1).strip())
        
    return {
        "filename": file_path.name,
        "title": title,
        "keywords": keywords,
        "summary": summary,
        "transcript": transcript,
        "char_count": len(transcript)
    }

def load_pillar_mapping():
    """解析知识图谱文件，获取各支柱包含的文件列表"""
    index_content = INDEX_FILE.read_text(encoding="utf-8")
    sections = re.split(r'## 🏛️\s*', index_content)
    
    pillar_to_files = {}
    for sec in sections[1:]:
        lines = sec.strip().split("\n")
        header = lines[0].split("(")[0].strip()
        pillar_name = header
        file_list = []
        for line in lines:
            m = re.search(r'\[(.*?.md)\]', line)
            if m:
                fname = m.group(1)
                file_list.append(fname)
        pillar_to_files[pillar_name] = file_list
    return pillar_to_files

def main():
    print(">>> 正在读取 88 集逐字稿与知识图谱...")
    pillar_files = load_pillar_mapping()
    
    all_transcripts = {}
    for f in TRANSCRIPTS_DIR.glob("[0-9]*.md"):
        data = parse_transcript_file(f)
        all_transcripts[f.name] = data
        
    print(f"成功解析 {len(all_transcripts)} 篇逐字稿数据。")
    
    # 构建手册内容
    for book_filename, cfg in BOOK_DEFINITIONS.items():
        out_path = MASTER_BOOKS_DIR / book_filename
        pillar_name = cfg["pillar"]
        kw_filter = cfg["keywords_filter"]
        
        # 寻找匹配文件
        candidate_files = pillar_files.get(pillar_name, [])
        selected_files = []
        
        for fname in candidate_files:
            if fname not in all_transcripts:
                continue
            item = all_transcripts[fname]
            if kw_filter:
                # 检查关键词或标题是否匹配过滤条件
                combined_text = f"{item['title']} {item['keywords']}"
                if any(k in combined_text for k in kw_filter):
                    selected_files.append(fname)
            else:
                selected_files.append(fname)
                
        # 兜底：如果过滤过严导致为空，放宽匹配
        if not selected_files and candidate_files:
            selected_files = [f for f in candidate_files if f in all_transcripts][:10]
            
        print(f"[{book_filename}] 归纳包含 {len(selected_files)} 讲内容...")
        
        # 编写 Markdown
        md = []
        md.append(f"# {cfg['title']} · v2.0 官方逐字原声精炼版\n")
        md.append("> **版本定义**：v2.0 工业权威版 | **数据源**：NotebookLM 官方原声音频逐字提取（88集全集）")
        md.append("> **架构升级**：彻底剔除旧版 OCR 画面模糊识别与时间戳乱码，100% 还原导演现场实操口诀与模型 Prompt 语法。\n")
        md.append("---\n")
        
        md.append("## 📑 课程与实操全集目录\n")
        md.append("| 讲次 | 课程原名 | 核心关键词 | 演讲字数 | 核心提炼摘要 |")
        md.append("| :--- | :--- | :--- | :--- | :--- |")
        
        for idx, fname in enumerate(selected_files, 1):
            t = all_transcripts[fname]
            summary_short = t['summary'][:60].replace("\n", " ") + "..." if len(t['summary']) > 60 else t['summary']
            md.append(f"| 第 {idx:02d} 讲 | **{t['title']}** | `{t['keywords']}` | {t['char_count']} 字 | {summary_short} |")
            
        md.append("\n---\n")
        
        # 各讲正文
        for idx, fname in enumerate(selected_files, 1):
            t = all_transcripts[fname]
            md.append(f"## 第 {idx:02d} 讲 · {t['title']}\n")
            md.append(f"- **归属文件**：`{fname}`")
            md.append(f"- **核心关键词**：`{t['keywords']}`")
            md.append(f"- **原声字数**：约 {t['char_count']} 字\n")
            
            md.append("### 🎯 核心提炼与实操导读")
            md.append(f"{t['summary']}\n")
            
            md.append("### 🎙️ 完整官方原声教学实录（清洗去噪版）")
            md.append(f"{t['transcript']}\n")
            md.append("---\n")
            
        out_path.write_text("\n".join(md), encoding="utf-8")
        print(f"✅ 已写入: {out_path.name} ({len(md)} 行)")

    print("\n🎉 全部 8 本 Master Books 升级至 v2.0 成功！")

if __name__ == "__main__":
    main()
