# 🚀 一键重启指南

当所有服务都挂了（WARP 隧道、Chrome、AI Gateway、Web UI），按以下顺序恢复。

---

## 1. 唤醒 WARP 隧道

打开一个新终端，执行：

```bash
gh cs ssh -c warp-proxy-5gx695gxjrpjc4595 -- "sudo warp-svc --accept-tos > /dev/null 2>&1 & sleep 2 && warp-cli --accept-tos connect"
```

等它显示 `Success` 后，接着执行（**这个窗口不能关**）：

```bash
gh cs ssh -c warp-proxy-5gx695gxjrpjc4595 -- -N -L 1081:127.0.0.1:40000
```

验证：
```bash
curl -s --socks5-hostname 127.0.0.1:1081 ipinfo.io/ip
# 应该看到 104.28.xxx.xxx
```

---

## 2. 启动 Chrome（带 WARP 代理 + Profile 1）

> ⚠️ **Chrome 146+ 安全限制：** `--remote-debugging-port` 不能配合默认用户数据目录使用。必须用**非默认路径**。这里用软链接解决：创建一个非默认目录，链接到真实的数据目录。

再开一个新终端：

```bash
# 关掉所有 Chrome
pkill chrome
sleep 2

# 删掉锁文件
rm -f /home/qiyu/.config/google-chrome/Singleton*

# 创建软链接（绕过 Chrome DevTools 安全限制）
# Chrome 要求 user-data-dir 不能是默认路径，否则忽略 --remote-debugging-port
mkdir -p /home/qiyu/.config/chrome-cdp-profile
rm -rf /home/qiyu/.config/chrome-cdp-profile
ln -sf /home/qiyu/.config/google-chrome /home/qiyu/.config/chrome-cdp-profile

# 启动 CDP Chrome（走 WARP 代理 + Profile 1）
# --disable-features=OsCryptLinuxUsePortal 绕过 D-Bus 密钥门户加密失败的问题
google-chrome \
  --remote-debugging-port=9222 \
  --proxy-server=socks5://127.0.0.1:1081 \
  --user-data-dir=/home/qiyu/.config/chrome-cdp-profile/google-chrome \
  --profile-directory="Profile 1" \
  --no-first-run \
  --disable-features=OsCryptLinuxUsePortal &
```

> ⚠️ **注意：** 不要用 `~/.config/...`，bash 不会展开等号后面的 `~`，会导致 Chrome 使用字面路径 `~/.config/...` 创建一个空白资料。**始终用绝对路径 `/home/qiyu/...`**

验证：
```bash
curl -s http://127.0.0.1:9222/json/version
# 应该看到 Browser: Chrome/146...
```

---

## 3. 启动 AI Gateway

再开一个新终端：

```bash
cd /home/qiyu/repos/mofelo/viral-shorts-engine/ai-gateway

# 确认 CDP 端口配置正确
grep CHROME_CDP_URL .env
# 应该显示: CHROME_CDP_URL=http://127.0.0.1:9222

# 启动
npx tsx src/server.ts
```

看到 `Listening on port 4100` 就成功了。

---

## 4. 启动 Web UI

再开一个新终端：

```bash
cd /home/qiyu/repos/mofelo/viral-shorts-engine/web
npm run dev
```

看到 `Ready` 提示后，浏览器打开 **http://localhost:3000**

---

## 5. 启动 WARP 守护脚本（推荐，自动保活）

```bash
# 启动后每 30 分钟自动检测，断了自动重连
nohup /home/qiyu/repos/mofelo/viral-shorts-engine/warp-daemon.sh > /dev/null 2>&1 &

# 查看日志
tail -f /home/qiyu/repos/mofelo/viral-shorts-engine/warp-tunnel.log
```

---

## 6. 打开 Google 页面（保持不关）

在刚才启动的 Chrome 里打开这 3 个页面：

1. **Gemini** → https://gemini.google.com/app
2. **AI Studio TTS** → https://aistudio.google.com/generate-speech?model=gemini-3.1-flash-tts-preview
3. **Flow 项目** → https://labs.google/fx/zh/tools/flow/project/a44492fc-a050-4f8d-9fc7-3035c782aa30

---

## 快速检查状态

```bash
# WARP 隧道
curl -s --socks5-hostname 127.0.0.1:1081 ipinfo.io/ip

# Chrome CDP
curl -s http://127.0.0.1:9222/json/version || curl -s http://127.0.0.1:38757/json/version

# AI Gateway
curl -s http://localhost:4100

# Web UI
curl -s http://localhost:3000
```

---

## 注意事项

- **SSH 隧道窗口不能关**，关了 WARP 就断了
- Chrome 要配 `--proxy-server=socks5://127.0.0.1:1081`，否则访问 Google 不走 WARP
- Codespace 闲置 30 分钟会自动休眠，隧道断了重跑第 1 步就行