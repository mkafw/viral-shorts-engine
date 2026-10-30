<!-- skill-alignment-work-HANDOFF-BEGIN PH-20261030-skill-alignment-01 -->

## 短剧 skill 体系对齐 + 引擎模板映射（2026-10-30）

### 交接区

- 交接编号：PH-20261030-skill-alignment-01
- 源任务编号：（留空）
- 用户确认范围：保存这次长任务的进度；目录涉及 `~/.agents/skills/ai-drama-pipeline/`、`~/.codex/skills/`、`/home/qiyu/repos/mofelo/viral-shorts-engine/`、`/home/qiyu/gdrive_active/影视蓝图/`
- 项目目录：/home/qiyu/repos/mofelo/viral-shorts-engine
- 接手任务编号：（创建成功后填写）
- 交接状态：材料已核对
- 更新时间：2026-10-30 13:30 Asia/Shanghai

### 任务与版本

- 目标：把分散的短剧素材对齐成可复用的 skill，并把 skill 方法论映射进 viral-shorts-engine 提示词引擎（方案1分层对接）
- 范围与完成标准：skill 模块可查；两个新模板（全剧纵深审查、分镜八项报错质检）在引擎可加载；不修改 db.ts 迁移块、afterPack.js、schema.ts
- 版本位置：`web/src/lib/prompts/defaultTemplates.ts` 已改未提交（新增 2 模板）；分支 master

### 权威资料

- `/home/qiyu/.agents/skills/ai-drama-pipeline/SKILL.md`：短剧创作总入口，路由表含全部模块
- `web/src/lib/prompts/defaultTemplates.ts`：引擎提示词模板（新增 structure_depth_review / storyboard_error_gate）
- `web/docs/prompt-conventions.md`：模板清单 + Token/资产命名铁律
- `/home/qiyu/gdrive_active/影视蓝图/`：源素材库；`deepseek/_kb/知识库总索引.md` 按 8 场景索引
- 冲突：无已知冲突；build 超时（NPM_EXIT=124）是环境多 lockfile 耗时，非代码报错

### 决定与限制

- 用户已确认：方案1（映射式）而非「engine 接管 skill」；「四十二层」经核对为 19 层全息系统；记录文件用 CODEX.md 而非 CHANGELOG.md
- Agent 建议：skill 留 `~/.agents/skills/` 当创作入口，engine 当出片层，靠 drama-pipeline.mjs 桥接
- 未决：是否长期常驻 dev 服务、是否把新模板补进其余 docs
- 已否决路线：不把 skill 源码搬进 engine 代码（侵入大、与内置模板冲突）
- 授权边界：已授权新增/编辑 skill 模块与 engine 模板；安装/发布/删除需单独确认

### 进展与运行状态

- 已完成：
  - ai-drama-pipeline 齐 19 个模块（选题配对/二十三线/自心写作/四十二层19层/分镜八项报错/镜头语言/白描转化/启动清单+写作循环等），路径全部核验无断链
  - skill 目录 CODEX.md 已建并追加记录
  - 仓库根 CODEX.md 已建（Codex 约定层）
  - defaultTemplates.ts 新增 2 模板，`tsc --noEmit` 通过；dev 实跑 API 确认 15 模板全加载
  - prompt-conventions.md 已补「0. 模板清单」小节
  - project-handoff 技能已安装
- 进行中：无常驻任务（dev 是 timeout 120s 起的，已自动停止）
- 未做：`npm run build` 完整跑通（环境超时）
- 未验证：Prompt Studio 实际 UI 操作两个新模板；build 完整体

### 接续动作

1. 第一步：在 Prompt Studio 或经 API 实测 `structure_depth_review`/`storyboard_error_gate` 输入输出是否合预期
2. 验收：两个模板能用，产出 JSON 结构正确
3. 前置条件与阻塞：需要 dev 服务运行或本地构建；本机沙箱监听端口需沙箱外权限

开场白：

```
$project-handoff 恢复。项目 /home/qiyu/repos/mofelo/viral-shorts-engine；来源 PROJECT_STATE.md 交接区 PH-20261030-skill-alignment-01；目标 验证两个新模板可用并继续 skill↔engine 对接；限制 不改 db.ts 迁移块/afterPack.js/schema.ts；第一步 在 Prompt Studio 实测 structure_depth_review 与 storyboard_error_gate；验收 模板产出合法 JSON。先只读核对再继续。
```

<!-- skill-alignment-work-HANDOFF-END PH-20261030-skill-alignment-01 -->
