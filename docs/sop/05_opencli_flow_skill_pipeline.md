# 短剧 skill + opencli + Flow 接续 SOP

> 定位：把「短剧创作 skill（ai-drama-pipeline）→ opencli → Google Flow / flowApi → cutcli」串成一条可跑的流水线。
> 原则：**Flow REST（flowApi）为主干，opencli flow 浏览器为辅**；skill/opencli 自动产出中间件，Flow 端渲染半自动。

## 一、角色分工

| 组件 | 职责 | 接入点 |
|------|------|--------|
| `ai-drama-pipeline` skill | 创作方法论（选题→结构→分镜→质检的提示词模板） | `~/.agents/skills/ai-drama-pipeline/` |
| `drama-pipeline.mjs` | 中间件编排：剧本 JSON → Flow 提示词 → 剪映草稿 | `scripts/drama-pipeline.mjs` |
| `opencli` | 终端指挥棒（生成剧本 / 浏览器操作 Flow / 健康检查） | `OPENCLI_BIN` |
| `flowApi.ts` | Flow REST 直连（图/视频生成、credits、轮询、上传） | `web/src/lib/utils/flowApi.ts`（Path B 主干） |
| `opencli flow` | 浏览器 bridge 控制 Flow（预览/微调） | `opencli flow ...`（Path A 辅助） |
| `cutcli` | 剪映草稿打轴 + 字幕注入 | `CUTCLI_BIN` |

> 核心结论：**B（flowApi REST）为主，A（opencli flow）为辅**。要全自动选 B，要人肉微调补 A。

## 二、前置健康检查（每轮开工前）

| 检查 | 命令/方式 | 达标 |
|------|-----------|------|
| opencli 存活 | `opencli list` | 能看到 `flow` / 各 cli |
| opencli bridge / 浏览器 | `opencli doctor --live` | daemon、extension、connectivity 全 healthy |
| Flow REST 连通 | `flowGetCredits(at)` | 返回 credits 与 paygate tier，非 403 |
| cutcli 可用 | `cutcli` 存在且可执行 | `~/.local/bin/cutcli` |

> 任一失败：先修前置再走流水线。`opencli` 失败时可回退到内置模板（`drama-pipeline.mjs` 自带智能回退）。

## 三、端到端流水线（六步）

1. **创作**（skill，人/AI 操作）：用 `ai-drama-pipeline` 出选题、23 线结构、分镜、逐集文本。产物：故事/剧本概念。
2. **生成中间件**（命令）：
   ```bash
   node scripts/drama-pipeline.mjs "你的故事概念" --open-flow
   ```
   - 剧本+分镜：`output_drama/drama_script.json`
   - Flow 提示词：`output_drama/flow_prompts.json`（带 `{@角色}` 锚定）
   - 剪映草稿字幕：`output_drama/captions.json` + cutcli 自动创建草稿
   - `--open-flow`：可选，用 opencli 打开 Flow 首页
3. **质检**：分镜出图前过「八项报错」（skill `eight-error-gate`），未 PASS 不生成。
4. **上传资产**（Path B）：角色/场景概念图经 `flowUploadImage()` 传 Google Cloud 得 `mediaId`；命名严格匹配 `{@角色}`/`{@场景}` 铁律（见 `web/docs/prompt-conventions.md`）。
5. **生成**（Path B）：`flowSubmitVideoTask()` 文生视频 / 图生视频；`flowPollVideoStatus()` 轮询。
   - 备选（Path A 人肉）：`opencli flow open <project_id>` 到 Flow 界面手动微调生成。
6. **成片**：剪映草稿（步骤 2 已建）打轴字幕 → 精修 → 导出。

## 四、`{@}` 锚定铁律（不可违反）

- 全局场景引用必须 `{@场景}`，**不许** `{@银行大厅}` 等改名。
- 分镜独立场景用 `{@场景_S0}`、`{@场景_S1}`…。
- 角色一律 `{@角色名}`，防变脸。
- 布局参考 `{@Layout_XXXXXX}`（ID 后 6 位）。
- `videoPrompt`（喂 Veo/Sora）**禁用 `{@}`**，用纯自然语言 + 克制缓慢动作。
- 详见 `web/docs/prompt-conventions.md`。

## 五、已知接缝与避坑

- **Flow REST 走 token/认证**：`at` 令牌 + `flowGetCredits` 动态判 tier，403 多为令牌/key 不匹配，先查 `flowApi.ts` 请求链条。
- **参考图上传失败**：先查 `flowUploadImage` 的 projectId/aspectRatio 参数。
- **build 超时**：`NPM_EXIT=124` 是环境多 lockfile 全量编译慢，非代码错误；`tsc --noEmit` 为准。
- **opencli 不可用时**：`drama-pipeline.mjs` 会回退内置模板保底，别当故障。

## 六、改动必守（呼应 AGENTS）

- 改提示词模板 `defaultTemplates.ts`：改 `systemPrompt` 必须新增 `variables`，否则磁盘缓存不升级。
- 改代码后：`npx tsc --noEmit` + `npm run build`。
- **不碰** `db.ts` 迁移块、`afterPack.js`、`schema.ts`。
