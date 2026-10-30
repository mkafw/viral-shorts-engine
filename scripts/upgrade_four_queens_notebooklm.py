#!/usr/bin/env python3
"""
upgrade_four_queens_notebooklm.py
将 NotebookLM 全面升级为「四姬闭环制片厂」：
1. 重命名标题
2. 注入每个姬的专属系统自定义提示词 (Custom System Prompt)
3. 精准分发挂载对应的专业 PDF 典籍
"""

import subprocess
import time
from pathlib import Path

PDF_DIR = Path("/home/qiyu/gdrive_active/影视蓝图/deepseek/pdf")

# 5大核心 Notebook ID 映射
NOTEBOOKS = {
    "HUB": {
        "id": "bcf532c8-2127-40b3-a84d-d87d6e97c100",
        "title": "👑 影视蓝图 · 四姬制片厂全域总控中枢",
        "prompt": """你是【四姬制片厂】的全域总控中枢大管家。
你统领导演姬、妆造姬、分镜姬、剪辑姬四大超级前沿专家。
你的职责是依据《四纵十横九岗多模态资产总纲》与《HellGrind八段式工业协议》，进行全片总风格仲裁、阶段推进门禁验收、跨书交叉研究。
回答时，严格遵循好莱坞工业电影与商业爆款短剧的标准，提供结构化、可直接落地的生产指令。""",
        "pdfs": [
            "AI超神應用術  Google Gemini × NotebookLM × Nano Banana Pro × Veo × Flow 全解鎖 (鄧君如) (z-library.sk, 1lib.sk, z-lib.sk).pdf",
            "开源我的自动化视频制作 Skill——映画系统.pdf"
        ]
    },
    "DIRECTOR": {
        "id": "836031e1-15dd-467e-bbd5-4bcb638d8ec8", # 原 榨知姬-番茄
        "title": "🎬 导演姬 · 剧本风控与叙事中枢",
        "prompt": """你是四姬制片厂的【导演姬】。
你掌管剧本文学台本、三幕剧/八节拍骨架、微信/抖音/快手平台合规风控脱敏、前3秒留存生死门禁。
铁律：
1. 单镜台词严格 ≤8 词，配对身体动作指令。
2. 前3秒必须具备【视觉奇观】、【反常人设】或【高压倒计时】至少两项，不达标坚决退单打回。
3. 在55~60秒精准卡设断章崖。
4. 剧本正文中文，台词双轨提供精准英文翻译。""",
        "pdfs": [
            "准备分镜图 动画编剧与角色设定 2版 (（美）贝曼著) (z-library.sk, 1lib.sk, z-lib.sk).pdf"
        ]
    },
    "STYLIST": {
        "id": "c0c02370-9883-4429-abeb-7bbc488434d1", # 原 缝衍姬
        "title": "🎭 妆造姬 · 人设锁脸与疯批表演中枢",
        "prompt": """你是四姬制片厂的【妆造姬】。
你负责让角色100镜绝不换脸，并打破AI面瘫死人脸。
铁律：
1. 必须为每个核心角色设计1个“独一无二的视觉怪记号”（红鼻贴、双色短发、挂件）。
2. 输出严格锁脸语法：<<<REF>>> + 外观描述 + Lock: face + 3~6个固定特征。
3. 掌管影史级表演母题：周星驰冷面反差、小丑痉挛抽搐笑、非人哉神仙瘫、西装大爷蹲，必须将情绪拆解为解剖学3步微动作序列（眼球/下颌/肢体）。""",
        "pdfs": [
            "微表情人像手册：6套不同风格女性神态提示词.pdf",
            "人像摄影四部曲 提升内在 (高觉著) (z-library.sk, 1lib.sk, z-lib.sk).pdf",
            "缔造肌肤完美质感：数码人像摄影之用光、拍摄与修饰 (（美）LeeVaris著) (z-library.sk, 1lib.sk, z-lib.sk).pdf",
            "AI 短剧打斗总僵硬？这 24 组提示词直接抄.pdf"
        ]
    },
    "STORYBOARD": {
        "id": "116b3583-2f70-4aac-a039-561114a88682", # 原 视频姬
        "title": "📐 分镜姬 · 88集空间调度与摄影中枢",
        "prompt": """你是四姬制片厂的【分镜姬】。
你拥有88集官方原声逐字精炼知识库，负责空间几何调度、白模提取与电影级光影机位。
铁律：
1. 空间必须调度先行：绘制导演俯视走位图（ZONES），背景固定物必须可数（single column）。
2. 调用Roger Deakins逆光冷峻、暗部机位（Camera on shadow side）、85mm浅景深、毛孔级真实皮肤细节。
3. 输出纯净画面Prompt，强制包含[7 HARD LOCK]（轴线锁、速度锁）与[8 NEGATIVES]（严禁慢动作、严禁杂乱配乐）。""",
        "pdfs": [
            "世界著名导演的镜头语言 插图本 (朱玛，朱丹著, 朱玛, 朱丹著, 朱玛, 朱丹, 朱玛, 1938-) (z-library.sk, 1lib.sk, z-lib.sk).pdf",
            "70套AI视频运镜提示词，我做成一套能复用的 skill.pdf",
            "视觉之旅 3 摄影的视觉语言与表达技巧 (（美）杜舍曼著；梅菲译, (美)David duChemin著 , 梅菲译, 杜舍曼 etc.) (z-library.sk, 1lib.sk, z-lib.sk).pdf",
            "光的语言 摄影师、画家和设计师都必须了解的摄影用光 () (z-library.sk, 1lib.sk, z-lib.sk).pdf",
            "动画设计的构图与合成 (（美）盖特纳著；徐立译, 盖特纳, 徐立) (z-library.sk, 1lib.sk, z-lib.sk).pdf",
            "调色师手册 -电影和视频调色专业技法 (Alexis Van Hurkman) (z-library.sk, 1lib.sk, z-lib.sk).pdf"
        ]
    },
    "EDITOR": {
        "id": "aaca1340-cf85-47f3-8c94-cac2326a4970", # 原 音频四维
        "title": "✂️ 剪辑姬 · 声学卡点与剪映工程中枢",
        "prompt": """你是四姬制片厂的【剪辑姬】。
你执掌后期的灵魂：音频设计、情绪心流补偿与自动化工程出片。
铁律：
1. 声画补偿法则：画面平淡用声音强行操控肾上腺素。
2. 掌管三大情绪切入点：战歌起（808重低音Drop）、反转静音刹车（0.5s绝对死寂）、疯批魔性卡点。
3. 工业交付：调用cutcli生成标准CapCut/剪映四轨草稿（视频轨/人声轨/音效轨/BGM轨/打轴字幕），实现一键成片导出。""",
        "pdfs": [
            "音乐审美心理学教程 (林华著, 林华, (1942~), 林华, 1942-, 林华著, 林华) (z-library.sk, 1lib.sk, z-lib.sk).pdf",
            "音乐美学问题讨论集 (人民音乐出版社编辑部) (z-library.sk, 1lib.sk, z-lib.sk).pdf",
            "中国五声性调式和声的理论与方法 (樊祖荫) (z-library.sk, 1lib.sk, z-lib.sk).pdf"
        ]
    }
}

def run_cmd(cmd):
    print(f">> 执行: {cmd}")
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"⚠️ 报错: {res.stderr.strip() or res.stdout.strip()}")
    else:
        print(f"✅ 成功: {res.stdout.strip()}")
    return res

def main():
    print("=== 开始升级 NotebookLM 为四姬制片厂架构 ===")
    
    for key, cfg in NOTEBOOKS.items():
        nb_id = cfg["id"]
        title = cfg["title"]
        prompt = cfg["prompt"]
        pdfs = cfg["pdfs"]
        
        print(f"\n================================")
        print(f"处理: {title} ({nb_id})")
        print(f"================================")
        
        # 1. 重命名
        print(f">> [1/3] 重命名标题...")
        run_cmd(f'nlm notebook rename "{nb_id}" "{title}"')
        time.sleep(1)
        
        # 2. 注入系统自定义提示词
        print(f">> [2/3] 注入系统自定义提示词...")
        # 写入临时 prompt 文件避免 shell 引号转义问题
        tmp_prompt_file = Path(f"/tmp/nlm_prompt_{key}.txt")
        tmp_prompt_file.write_text(prompt, encoding="utf-8")
        run_cmd(f'nlm chat configure "{nb_id}" --goal custom --prompt "$(cat {tmp_prompt_file})"')
        time.sleep(1)
        
        # 3. 挂载专业 PDF
        print(f">> [3/3] 挂载专属专业 PDF 典籍...")
        for pdf_name in pdfs:
            pdf_path = PDF_DIR / pdf_name
            if not pdf_path.exists():
                print(f"⚠️ 找不到 PDF 文件: {pdf_name}")
                continue
            print(f"  --> 正在挂载: {pdf_name[:40]}...")
            run_cmd(f'nlm source add "{nb_id}" --file "{pdf_path}" --title "{pdf_name[:35]}" --wait --wait-timeout 180 --json')
            time.sleep(2)
            
    print("\n🎉 四姬制片厂 NotebookLM 全量重命名、提示词注入与 PDF 挂载完成！")

if __name__ == "__main__":
    main()
