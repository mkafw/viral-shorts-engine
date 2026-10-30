#!/usr/bin/env bash
# 重试上次失败的 24 个文件，加大 sleep 避免 rate-limit

NOTEBOOK_ID="bcf532c8-2127-40b3-a84d-d87d6e97c100"
TRANSCRIPTS_DIR="/home/qiyu/repos/mofelo/viral-shorts-engine/docs/shipinji_transcripts_raw"
LOG_FILE="/tmp/retry_mount_$(date +%Y%m%d_%H%M%S).log"
SUCCESS=0; FAIL=0

# 当前 notebook 已有的 source 标题，避免重复上传
echo "=== 获取已有 sources ===" | tee "$LOG_FILE"
EXISTING=$(nlm source list "$NOTEBOOK_ID" --json 2>/dev/null | python3 -c "
import sys, json
data = json.load(sys.stdin)
sources = data if isinstance(data, list) else data.get('sources', [])
for s in sources:
    print(s.get('title',''))
" 2>/dev/null)

echo "已有 sources 数: $(echo "$EXISTING" | wc -l)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"
echo "=== 开始重试 === $(date)" | tee -a "$LOG_FILE"

for f in "$TRANSCRIPTS_DIR"/*.md; do
    filename=$(basename "$f")
    title="${filename%.md}"

    # 跳过已成功的
    if echo "$EXISTING" | grep -qF "$title"; then
        echo "⏭️  [$title] 已存在，跳过" | tee -a "$LOG_FILE"
        continue
    fi

    echo -n "[$title] 重试上传... " | tee -a "$LOG_FILE"
    sleep 2  # 避免 rate-limit

    result=$(nlm source add "$NOTEBOOK_ID" \
        --file "$f" \
        --title "$title" \
        --wait --wait-timeout 180 \
        --json 2>&1)
    
    if [ $? -eq 0 ]; then
        echo "✅ OK" | tee -a "$LOG_FILE"
        ((SUCCESS++))
    else
        echo "❌ FAIL: $result" | tee -a "$LOG_FILE"
        ((FAIL++))
    fi
done

echo "" | tee -a "$LOG_FILE"
echo "=== 重试完成 ===" | tee -a "$LOG_FILE"
echo "✅ 成功: $SUCCESS  ❌ 失败: $FAIL" | tee -a "$LOG_FILE"
echo "日志: $LOG_FILE"
