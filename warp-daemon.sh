#!/bin/bash
# WARP 隧道守护脚本 - 自动检测并重连
# 当 SSH 隧道断开时自动重新连接

CODESPACE="warp-proxy-5gx695gxjrpjc4595"
LOCAL_PORT=1081
REMOTE_PORT=40000
LOG_FILE="/home/qiyu/repos/mofelo/viral-shorts-engine/warp-tunnel.log"
PID_FILE="/tmp/warp-tunnel-daemon.pid"

log() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

ensure_warp() {
    log "检查 WARP 连接状态..."
    local ip
    ip=$(curl -s --connect-timeout 5 --socks5-hostname 127.0.0.1:$LOCAL_PORT ipinfo.io/ip 2>/dev/null)
    if [ -n "$ip" ]; then
        log "WARP 正常 (IP: $ip)"
        # 保持隧道活跃：发送心跳请求，防止 Codespace 空闲超时
        curl -s --connect-timeout 3 --socks5-hostname 127.0.0.1:$LOCAL_PORT \
          https://ipinfo.io/ip >/dev/null 2>&1 &
        return 0
    fi
    log "WARP 断开，开始重连..."

    # 1. 杀掉所有旧隧道进程（gh 父进程 + ssh 子进程都要杀）
    #    用 pkill -9 匹配整个命令链，避免累积进程触发 GitHub SSH 限流
    pkill -9 -f "codespace.*warp-proxy" 2>/dev/null
    pkill -9 -f "ssh.*${LOCAL_PORT}.*${REMOTE_PORT}" 2>/dev/null
    # 确保端口完全释放
    for i in $(seq 1 10); do
        ss -tlnp 2>/dev/null | grep -q ":$LOCAL_PORT " || break
        sleep 0.5
    done

    # 2. 确保 codespace 上的 WARP 服务运行并已连接
    gh cs ssh -c "$CODESPACE" -- "pgrep -x warp-svc >/dev/null || sudo nohup /usr/bin/warp-svc >/dev/null 2>&1 &" 2>/dev/null
    sleep 2
    gh cs ssh -c "$CODESPACE" -- "warp-cli --accept-tos connect" 2>/dev/null
    sleep 2

    # 3. 建立 SSH 隧道（带 keepalive 防止断开）
    gh cs ssh -c "$CODESPACE" -- \
      -o ServerAliveInterval=15 \
      -o ServerAliveCountMax=3 \
      -o TCPKeepAlive=yes \
      -o ExitOnForwardFailure=yes \
      -N -L "$LOCAL_PORT":127.0.0.1:"$REMOTE_PORT" &>/dev/null &

    # 4. 验证
    for i in $(seq 1 10); do
        sleep 2
        ip=$(curl -s --connect-timeout 3 --socks5-hostname 127.0.0.1:$LOCAL_PORT ipinfo.io/ip 2>/dev/null)
        if [ -n "$ip" ]; then
            log "重连成功 (IP: $ip)"
            return 0
        fi
    done
    log "重连失败，30 秒后重试"
    return 1
}

# 启动
echo "$$" > "$PID_FILE"
log "WARP 隧道守护脚本启动"

while true; do
    ensure_warp
    if [ $? -ne 0 ]; then
        sleep 30
        continue
    fi
    # 每 2 分钟检查一次，避免长时间断连
    sleep 120
done