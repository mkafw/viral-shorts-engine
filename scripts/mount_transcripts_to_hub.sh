#!/usr/bin/env bash
# ============================================================
# mount_transcripts_to_hub.sh
# 批量把 88 集视频姬逐字稿 上传到「影视蓝图中枢」notebook
# 目标 notebook ID: bcf532c8-2127-40b3-a84d-d87d6e97c100
# ============================================================

NOTEBOOK_ID="bcf532c8-2127-40b3-a84d-d87d6e97c100"
TRANSCRIPTS_DIR="/home/qiyu/repos/mofelo/viral-shorts-engine/docs/shipinji_transcripts_raw"
LOG_FILE="/tmp/mount_transcripts_$(date +%Y%m%d_%H%M%S).log"

SUCCESS=0
FAIL=0
SKIP=0

echo "=== 开始上传 === $(date)" | tee "$LOG_FILE"
echo "目标 notebook: $NOTEBOOK_ID" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

for f in "$TRANSCRIPTS_DIR"/[0-9]*.md; do
    filename=$(basename "$f")
    title="${filename%.md}"

    echo -n "[$title] 上传中... " | tee -a "$LOG_FILE"

    result=$(nlm source add "$NOTEBOOK_ID" --file "$f" --title "$title" --wait --wait-timeout 120 --json 2>&1)
    exit_code=$?

    if [ $exit_code -eq 0 ]; then
        echo "✅ OK" | tee -a "$LOG_FILE"
        ((SUCCESS++))
    else
        echo "❌ FAIL: $result" | tee -a "$LOG_FILE"
        ((FAIL++))
    fi

    # 避免 rate limit
    sleep 1
done

# 上传 index 文件
INDEX_FILE="$TRANSCRIPTS_DIR/00_视频姬88集全集知识图谱与索引.md"
echo -n "[00_知识图谱索引] 上传中... " | tee -a "$LOG_FILE"
result=$(nlm source add "$NOTEBOOK_ID" --file "$INDEX_FILE" --title "00_视频姬88集全集知识图谱与索引" --wait --wait-timeout 120 --json 2>&1)
if [ $? -eq 0 ]; then
    echo "✅ OK" | tee -a "$LOG_FILE"
    ((SUCCESS++))
else
    echo "❌ FAIL: $result" | tee -a "$LOG_FILE"
    ((FAIL++))
fi

echo "" | tee -a "$LOG_FILE"
echo "=== 完成 ===" | tee -a "$LOG_FILE"
echo "✅ 成功: $SUCCESS  ❌ 失败: $FAIL  ⏭️ 跳过: $SKIP" | tee -a "$LOG_FILE"
echo "日志: $LOG_FILE"
