# CODEX · viral-shorts-engine

Codex 专用约定层（AGENTS.md 覆盖所有 agent，本文件只记 Codex 特有约定）。修改代码前配合 `AGENTS.md` 与 `web/docs/`（尤其 `prompt-conventions.md`）阅读。

## Codex 相关创作闭环

- 本仓库 = 工程出片层（提示词引擎 + `{@角色}` 锚定 + 剪映导出）。
- 创作方法论层在独立 skill `ai-drama-pipeline`（~/.agents/skills/ai-drama-pipeline/）：
  - 选题配对 · 二十三线卡 · 自心写作 · 四十二层(19层全息) · 分镜八项报错 · 镜头语言 · 白描转化 · 启动清单+写作循环
- 两者是**分层对接**：skill 写对，engine 生成。

## 本仓库提示词模板（web/src/lib/prompts/defaultTemplates.ts）

- 内置模板含：script_v1/v2、script_iterate、script_review、script_to_scenes、publish_info、character/location/cover/action/bgm_prompt、scene_image/video_refine_prompt。
- 新增（2026-10-30 映射自 skill）：
  - `structure_depth_review` — 全剧结构纵深审查（二十三线 + 十九层全息）
  - `storyboard_error_gate` — 分镜八项报错质检

## 模板修改铁律（呼应 AGENTS 规则 4）

- 改 `systemPrompt` 必须同时新增 `variables`，否则用户磁盘缓存不升级。
- 修改后必须跑 `npx tsc --noEmit` 与 `npm run build` 验证。

## 出片

- `scripts/drama-pipeline.mjs`：故事 → 剧本 JSON → Flow 提示词 → 剪映草稿。
- 产物 `output_drama/drama_script.json`、`flow_prompts.json`、`captions.json`。
