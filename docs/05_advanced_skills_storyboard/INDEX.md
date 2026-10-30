# 高阶独立生产级 Skills 与分层编译器 (Advanced AI Short Film Skills & Compilers)

> **核心定位**：解决多镜头连续性、两阶段故事板自动合成、微表情控制与 Seedance 提示词自动编译打包的高阶工程 Skill。
> **适用平台**：Gemini Web 端 Skills、Claude Code Skills、本地 Agent。

---

## 📑 模块导航目录

1. [两阶段故事板生图与视频扩写 Skill (Storyboard Prompt Builder)](file:///home/qiyu/repos/mofelo/viral-shorts-engine/docs/05_advanced_skills_storyboard/01_两阶段故事板生图与视频扩写Skill.md)
   - **Phase 1 故事板合图**：基于故事梗概与人物参考图，单提示词直接生成 9/12/15/20 格编号故事板大图。
   - **Phase 2 电影级视频扩写**：根据确认的分镜图，一键拓展出包含摄影机参数、光影、微表情、SFX音效与台词的视频生成 Prompt。
2. [手绘轨迹运镜控制 Skill (Hand Drawn Path Video Prompt Skill)](file:///home/qiyu/repos/mofelo/viral-shorts-engine/docs/05_advanced_skills_storyboard/02_手绘轨迹运镜控制Skill.md)
   - 通过在画布上绘制空间运动轨迹、箭头与视线动线，直接映射为 3D 摄像机运动描述。
3. [70 套 AI 视频运镜提示词 Skill (70 Camera Moves)](file:///home/qiyu/repos/mofelo/viral-shorts-engine/docs/05_advanced_skills_storyboard/03_70套AI视频运镜提示词Skill.md)
   - 包含希区柯克变焦、环绕升降、穿梭穿越、主观第一视角等 70 套开箱即用电影运镜提示词。
4. [AI 生图工业框架 V2 (AI Image Generation Framework V2)](file:///home/qiyu/repos/mofelo/viral-shorts-engine/docs/05_advanced_skills_storyboard/04_AI生图工业框架V2.md)
   - 构图、光影、渲染器、材质、氛围的标准化参数装配线。
5. [导演级分层编译器与 Hooks 路由 (Director-Grade v6.5)](file:///home/qiyu/repos/mofelo/viral-shorts-engine/docs/05_advanced_skills_storyboard/director-grade-v6.5/)
   - 内含 `seedance_prompt_compiler.py`，支持按镜头图层拆分 `Action`、`Camera`、`Lighting`、`Atmosphere` 的 YAML 编译引擎。
