# 🎬 AI 短剧工业化总控中枢 (AI Drama Industrial Engine)

> **版本**：v2.0 工业级标准化重构版  
> **定位**：连接 **云端超强模型（Gemini 网页端 / Claude）** 与 **本地生产线（Viral Shorts Engine / Flow / cutcli）** 的双向资产中枢。实现“一鱼两吃、零抽卡稳定出片”。

---

## 📚 知识架构导览地图

本中枢将散落在 `video/docs/`（128 篇视频听写实操）、`deepseek/`（66 份长篇剧作大纲）与 30 本大师级视听巨著彻底重构为 **5 大标准化核心模块**：

| 模块编码 | 模块名称 | 解决的核心问题 | 核心知识沉淀与来源 |
| :--- | :--- | :--- | :--- |
| **[01]** | [**剧本与叙事大脑**](./01_剧本与叙事大脑_Script_Engine.md) | 故事老套、人物单薄、长篇写崩断线 | 现实癫文选题法、23 线卡、四十二层全息洋葱引擎、自心写作五感八触 |
| **[02]** | [**角色资产与防变脸板**](./02_角色资产与防变脸板_Character_Model_Sheet.md) | 角色变脸、AI 大众脸、蜡像假人感、NPC 待机僵硬 | 四视图工业锁脸（4-view）、双参考图骨相重构法、微表情时间轴触发器 |
| **[03]** | [**故事板与场景调度实操**](./03_故事板与场景调度实操_Storyboard_Staging_Lab.md) | 画面盲盒、打斗空间跑偏、运镜乱晃 | **故事板铁三角定律**（白模手绘定景别 + 身份版锁人 + 效果图锁风）、**导演级俯视调度图** |
| **[04]** | [**运镜光影与去塑料感**](./04_运镜光影与去塑料感_Cinematography_Lighting.md) | 画面像廉价监控、塑料感严重、缺乏电影张力 | 8 大电影级光影实操、写光不写空气减法审美、八大运镜公式、四维配音 |
| **[05]** | [**自动化对接与标准 JSON**](./05_自动化对接与标准JSON_Pipeline_API_Schema.md) | 脚本怎么连、打轴怎么做、模型数据不通 | Google Flow `{@角色}` 资产标签、剪映 cutcli 毫秒级打轴、八项出图门禁、标准 JSON |

---

## 🚀 一鱼两吃实操指南 (Cloud & Local)

### 第一吃：在 Google Gemini 网页端（做超强大脑）
1. **通过 Google Drive 引用**：
   - 本套文档同步到 Google Drive（`影视蓝图/deepseek/00-ai-drama-engine/`）后，在 Gemini 对话框中直接输入：
     > `@Google Drive 引用 03_故事板与场景调度实操.md，为我刚才的打斗戏设计俯视机位和运镜提示词`
2. **通过 Gemini Skills 斜杠召唤（推荐）**：
   - 打开 [gemini.google.com](https://gemini.google.com/) → **Customize > Skills**。
   - 分别创建三个专用 Skill（指令在 `gemini_skills/` 目录下）：
     - `/drama-script`：[编剧 Skill 配置](./gemini_skills/drama_script.md)
     - `/drama-character`：[角色锁脸 Skill 配置](./gemini_skills/drama_character.md)
     - `/drama-storyboard`：[分镜与 JSON Skill 配置](./gemini_skills/drama_storyboard.md)

### 第二吃：在本地 Viral Shorts Engine（做自动出片流水线）
1. 将 Gemini 或本地生成的标准短剧 JSON 保存为 `output_drama/drama_script.json`。
2. 运行一键命令：
   ```bash
   node scripts/drama-pipeline.mjs "你的故事主题"
   ```
3. 流水线会自动完成：
   - 读取本中枢的规范输出标准化 Google Flow 提示词包（`flow_prompts.json`）；
   - 自动调用 `cutcli` 创建剪映桌面端草稿工程并自动注入打轴字幕和短剧花字样式；
   - 本地打开剪映即可直接预览与微调！
