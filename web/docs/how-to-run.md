# 🚀 Viral Shorts Engine — 本地运行完整指南

> 本文是当前架构（OpenCLI 版）的权威启动手册。

---

## 架构概览

```
Chrome (带 WARP 代理 + CDP 端口 9222)
    │
    ├── OpenCLI 命令行 ──► DeepSeek / 豆包（文本生成）
    │
    ├── AI Gateway (port 4100)  ──► TTS 语音合成（Playwright CDP）
    │
    └── Web UI (port 3000)  ──► 主控制台
```

> **文本生成**（剧本、分镜提示词）：通过 `opencli` 命令行工具调用，无需在浏览器手动打开 Gemini 页面。  
> **TTS 语音合成**：仍然通过 Playwright CDP 控制 AI Studio / 豆包网页实现。

---

## 第一步：环境依赖

| 软件 | 版本要求 | 安装方式 |
|------|---------|---------|
| Node.js | ≥ 18 | [nodejs.org](https://nodejs.org) 或 nvm |
| Git | 任意 | 系统自带 |
| FFmpeg | 任意 | `brew install ffmpeg` / `choco install ffmpeg` |
| Google Chrome | 任意 | 官网下载 |
| **OpenCLI** | 最新 | 见下方 |

### 安装 OpenCLI

```bash
# jackwener/OpenCLI —— 统一调用 DeepSeek、豆包等 AI 的命令行工具
npm install -g opencli
```

安装后登录你需要的引擎：

```bash
opencli deepseek login   # 登录 DeepSeek
opencli doubao login     # 登录豆包
```

验证是否就绪：

```bash
opencli deepseek status  # 应显示 logged_in
opencli doubao status    # 应显示 logged_in
```

---

## 第二步：拉取代码 & 安装依赖

```bash
git clone <仓库地址>
cd viral-shorts-engine

# 安装 Web 前端依赖
cd web && npm install && cd ..

# 安装 AI Gateway 依赖
cd ai-gateway && npm install && cd ..
```

---

## 第三步：配置环境变量

### Web 前端 (`web/.env.local`)

```bash
cp web/.env.example web/.env.local
```

打开 `web/.env.local`，必填项：

```env
# 你本地存放短剧项目的文件夹（绝对路径）
WORKSPACE_PATH="/Users/你的名字/Desktop/短剧项目"

# Google Labs Flow 项目地址（去 labs.google 创建）
FLOW_PROJECT_URL="https://labs.google/fx/zh/tools/flow/project/你的项目ID"
```

### AI Gateway (`ai-gateway/.env`)

```bash
cp ai-gateway/.env.example ai-gateway/.env
```

默认内容无需修改，确认如下即可：

```env
CHROME_CDP_URL=http://127.0.0.1:9222
PORT=4100
```

---

## 第四步：启动 Chrome（CDP 模式）

TTS 语音合成仍需通过浏览器自动化实现，因此 Chrome 必须以 CDP 模式启动。

### Linux（本机 / Codespace）

```bash
# 先关掉所有现有 Chrome
pkill chrome 2>/dev/null; sleep 2

# 清理锁文件
rm -f /home/qiyu/.config/google-chrome/Singleton*

# 创建软链接（绕过 Chrome 146+ 安全限制）
rm -rf /home/qiyu/.config/chrome-cdp-profile
ln -sf /home/qiyu/.config/google-chrome /home/qiyu/.config/chrome-cdp-profile

# 启动（如需 WARP 代理，加 --proxy-server=socks5://127.0.0.1:1081）
google-chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/home/qiyu/.config/chrome-cdp-profile/google-chrome \
  --profile-directory="Profile 1" \
  --no-first-run \
  --disable-features=OsCryptLinuxUsePortal &
```

### Mac

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222
```

### Windows

在 Chrome 快捷方式的"目标"栏末尾加上：`--remote-debugging-port=9222`

**验证 CDP 是否成功：**

```bash
curl -s http://127.0.0.1:9222/json/version
# 应显示：{"Browser": "Chrome/146..."}
```

---

## 第五步：打开必要网页（保持不关）

在刚才启动的 Chrome 里打开并登录：

| 用途 | 网址 |
|------|------|
| TTS 语音合成 | https://aistudio.google.com/generate-speech?model=gemini-3.1-flash-tts-preview |
| 生图 / 生视频 | 你的 Flow 项目地址（即 `FLOW_PROJECT_URL` 配置的那个） |

> ✅ **文本生成无需打开浏览器！** DeepSeek / 豆包由 `opencli` 命令行直接调用。

---

## 第六步：启动服务（开 2 个终端）

```bash
# 终端 1 —— AI Gateway（文本生成 + TTS 转发）
cd ai-gateway
npm run dev
# 看到 "AI Gateway is running on port 4100" 即成功

# 终端 2 —— Web 主控制台
cd web
npm run dev
# 看到 "Ready" 即成功
```

启动后打开浏览器访问：👉 **http://localhost:3000**

---

## 快速健康检查

```bash
# AI Gateway
curl -s http://localhost:4100/health

# OpenCLI 引擎状态
opencli deepseek status
opencli doubao status

# Chrome CDP
curl -s http://127.0.0.1:9222/json/version
```

---

## 完整制片流程（5 步）

### 📍 阶段一：剧本室
- 输入一句话灵感（或一键拉取热点素材）
- AI 自动生成极限反转剧本 → 自动评审打分 → 自动迭代
- 定稿后「拆解为分镜」，生成【角色表】+【分镜台词表】

### 📍 阶段二：定妆室（防变脸关键！）
- 生成**场景概念图**：极简留白背景，下载保存
- 生成**角色定妆照**：正面高清全身照，下载保存

### 📍 阶段三：Flow 素材绑定（手动操作）
切换到 Google Labs Flow，上传图片到左侧资产库，**必须按以下铁律重命名**：

| 素材 | 命名规则 |
|------|---------|
| 全局场景图 | 必须命名为：`场景` |
| 角色定妆照 | 必须命名为角色名（如：`小雪`、`布偶猫`） |
| 画板首帧图 | 系统自动命名：`项目名_S镜号_StartImg` |
| 画板尾帧图 | 系统自动命名：`项目名_S镜号_Img` |

> ⚠️ **名字错了 = 变脸！** 系统生成视频时自动在提示词里打 `@场景`、`@小雪`，Flow 里找不到就彻底脱相。

### 📍 阶段四：画板区（全自动）
- 系统自动生成每个分镜的首尾帧提示词 + 视频动态描述
- 点击【生成视频】，引擎自动接管 Flow 网页 → 填词 → `@` 引用素材 → Veo 3.1 渲染
- 采用「首尾帧继承架构」：第 N 镜的首帧 = 第 N-1 镜的尾帧，无缝衔接

### 📍 阶段五：渲染室（一键成片）
- 自动生成所有角色 TTS 配音
- 拖动时间轴对齐画面与音频
- 点击【合成导出 4K】→ FFmpeg 压制完成，可直接发布的竖屏 4K 短剧！

---

## 常见问题

**Q：主角变脸了 / 背景乱飘？**  
A：检查 Flow 资产库里的图片命名。角色名 = 剧本中文名，场景图 = `场景`，一字不差。

**Q：生图被 Google 风控了（UNUSUAL_ACTIVITY）？**  
A：挂 WARP 全局代理 + 清空 Chrome 缓存（`Shift+Cmd+Delete`），刷新 Flow 页面重试。  
详见：[WARP 防封禁指南](./codespace-warp-proxy-guide.md)

**Q：`opencli deepseek status` 显示未登录？**  
A：重新运行 `opencli deepseek login` 完成登录。

**Q：TTS 配音失败？**  
A：确认 Chrome 以 CDP 模式启动，且 AI Studio 页面已登录并保持打开。

**Q：画面里只有一个人在对着空气说话？**  
A：检查画板区提示词是否把两个角色都 `{@角色A}{@角色B}` 一起 @ 进去了，漏写的人不会出现。
