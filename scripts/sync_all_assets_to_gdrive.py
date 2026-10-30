import os
import shutil
import time

pairs = [
    (
        "/home/qiyu/repos/mofelo/viral-shorts-engine/docs/02_zhiren_molikexing_110ep",
        "/home/qiyu/gdrive_active/影视蓝图/02-智人磨粒克星-110集全案"
    ),
    (
        "/home/qiyu/repos/mofelo/viral-shorts-engine/docs/03_hollywood_shortfilm_prompts",
        "/home/qiyu/gdrive_active/影视蓝图/03-好莱坞短片提示词与方法论"
    ),
    (
        "/home/qiyu/repos/mofelo/viral-shorts-engine/docs/04_character_and_narrative_mind",
        "/home/qiyu/gdrive_active/影视蓝图/04-人物底色与深度人设中枢"
    ),
    (
        "/home/qiyu/repos/mofelo/viral-shorts-engine/docs/05_advanced_skills_storyboard",
        "/home/qiyu/gdrive_active/影视蓝图/05-高阶提示词与故事板Skill"
    ),
    (
        "/home/qiyu/repos/mofelo/viral-shorts-engine/docs/06_visual_beat_boards",
        "/home/qiyu/gdrive_active/影视蓝图/06-黄金分镜视觉基准板"
    ),
    (
        "/home/qiyu/repos/mofelo/viral-shorts-engine/docs/07_cinematic_master_essence",
        "/home/qiyu/gdrive_active/影视蓝图/07-影视大师视听与调色精要"
    ),
]

def safe_copy_file(src_path, dst_path, max_retries=3):
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    if os.path.exists(dst_path) and os.path.getsize(dst_path) == os.path.getsize(src_path):
        print(f"Skipping identical: {os.path.basename(dst_path)}")
        return True
    for attempt in range(max_retries):
        try:
            shutil.copy2(src_path, dst_path)
            print(f"Copied: {os.path.basename(src_path)} -> {os.path.basename(dst_path)}")
            time.sleep(0.3)
            return True
        except Exception as e:
            print(f"Retry {attempt+1}/{max_retries} for {os.path.basename(src_path)}: {e}")
            time.sleep(1.5)
    return False

def sync_dir(src, dst):
    print(f"\n==========================================")
    print(f"Syncing:\n  {src}\n  -> {dst}")
    print(f"==========================================")
    os.makedirs(dst, exist_ok=True)
    total_files = 0
    copied_files = 0
    for root, dirs, files in os.walk(src):
        rel_path = os.path.relpath(root, src)
        target_dir = os.path.join(dst, rel_path) if rel_path != "." else dst
        os.makedirs(target_dir, exist_ok=True)
        for f in files:
            total_files += 1
            src_file = os.path.join(root, f)
            dst_file = os.path.join(target_dir, f)
            if safe_copy_file(src_file, dst_file):
                copied_files += 1
    print(f"Completed {copied_files}/{total_files} files in {os.path.basename(dst)}")

def main():
    start_time = time.time()
    for src, dst in pairs:
        if os.path.exists(src):
            sync_dir(src, dst)
        else:
            print(f"Source missing: {src}")
    print(f"\nAll 6 asset packages synchronized to Google Drive in {time.time() - start_time:.1f}s!")

if __name__ == "__main__":
    main()
