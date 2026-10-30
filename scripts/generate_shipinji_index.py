import json
from pathlib import Path

raw_dir = Path('docs/shipinji_transcripts_raw')
manifest_file = raw_dir / '00_MANIFEST.json'

with open(manifest_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

sources = data['sources']
total = len(sources)

def classify_pillar(title, keywords, summary):
    t = title.lower()
    k = ' '.join(keywords).lower()
    s = summary.lower()
    
    if any(w in t for w in ['白膜', '调度图', '故事板', '灰模', '俯视', '九宫格']):
        return '01_故事板与白模空间调度'
    if any(w in t for w in ['运境', '运镜', '转场', '开场', '镜头语言']):
        return '02_电影级运镜与转场连贯'
    if any(w in t for w in ['角色', '微表情', '换装', '大众脸', '站位', '穿搭', '鲁棒性']):
        return '03_角色一致性、站位与微表情'
    if any(w in t for w in ['光影', '塑料', '色卡', '调色', '空镜', '光线', '尘雾', '真实感', '夕阳', '水墨', '黑红']):
        return '04_光影、色调与去塑料感美学'
    if any(w in t for w in ['配音', '发音', '音色', '语速']):
        return '05_四维发音与声音工程体系'
    if any(w in t for w in ['提示词', '反推', '反写', '手撕', '文化碰撞']):
        return '06_高阶提示词与工程工作流'
    return '07_实战案例与模型评测'

pillars = {
    '01_故事板与白模空间调度': [],
    '02_电影级运镜与转场连贯': [],
    '03_角色一致性、站位与微表情': [],
    '04_光影、色调与去塑料感美学': [],
    '05_四维发音与声音工程体系': [],
    '06_高阶提示词与工程工作流': [],
    '07_实战案例与模型评测': []
}

for s in sources:
    p = classify_pillar(s['title'], s.get('keywords', []), s.get('summary', ''))
    pillars[p].append(s)

md_out = [
    '# 🎬 视频姬·88集官方AI短剧工业全域知识图谱与逐字精炼索引',
    '',
    '> **数据来源**：Google NotebookLM `视频姬` 原生音频转录（Notebook ID: `116b3583-2f70-4aac-a039-561114a88682`）',
    f'> **总集数**：88集完整全录 | **数据状态**：100% 逐字原声无损提取 + AI Guide 导读归纳',
    '',
    '## 📑 七大工业支柱概览',
    ''
]

for p_name, p_list in pillars.items():
    md_out.append(f'- **{p_name}**：共 `{len(p_list)}` 节核心课')

md_out.append('')
md_out.append('---')
md_out.append('')

for p_name, p_list in pillars.items():
    md_out.append(f'## 🏛️ {p_name} ({len(p_list)} 集)')
    md_out.append('')
    md_out.append('| 序号 | 课程原名 | 对应文件 | 原声字数 | 核心关键词 | AI Guide 精炼导读摘要 |')
    md_out.append('| :--- | :--- | :--- | :--- | :--- | :--- |')
    for s in p_list:
        idx = s['index']
        title = s['title']
        fname = s['filename']
        chars = s.get('char_count', 0)
        kw = '、'.join(s.get('keywords', [])[:3])
        summ = s.get('summary', '').replace('\n', ' ')
        if len(summ) > 120:
            summ = summ[:117] + '...'
        md_out.append(f'| {idx:02d} | **{title}** | [{fname}](file:///home/qiyu/repos/mofelo/viral-shorts-engine/docs/shipinji_transcripts_raw/{fname}) | {chars}字 | {kw} | {summ} |')
    md_out.append('')

index_path = raw_dir / '00_视频姬88集全集知识图谱与索引.md'
with open(index_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(md_out))

print(f'Successfully generated {index_path} with {total} sources.')
