#!/usr/bin/env node
import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Viral Shorts Drama Pipeline CLI
 * 极简短剧端到端自动化管道：
 * 1. 剧本 & 10s 分镜提示词生成 (OpenCLI DeepSeek / 智能回退)
 * 2. Google Flow 资产与分镜标准化 (带 {@角色} 锚定规范)
 * 3. 剪映/CapCut 草稿一键生成 (cutcli 自动化打轴与字幕注入)
 */

const CUTCLI_BIN = '/home/qiyu/.local/bin/cutcli';
const OPENCLI_BIN = '/home/qiyu/.nvm/versions/node/v24.14.0/bin/opencli';

function runCmd(cmd, args = [], options = {}) {
  const fullCmd = args.length > 0 ? `${cmd} ${args.join(' ')}` : cmd;
  console.log(`[Pipeline] 执行: ${fullCmd.substring(0, 150)}...`);
  try {
    return execSync(fullCmd, {
      encoding: 'utf-8',
      timeout: options.timeout || 60000,
      maxBuffer: 10 * 1024 * 1024,
      ...options,
    });
  } catch (err) {
    if (options.ignoreError) return null;
    throw new Error(`命令失败: ${fullCmd}\n${err.stderr || err.message}`);
  }
}

/**
 * 阶段 1：生成剧本与 10s 分镜数据
 */
async function generateDramaData(storyConcept) {
  console.log('\n🎬 ====================================================');
  console.log(`[Stage 1] 正在生成剧本与 10s 工业级分镜: "${storyConcept}"`);
  console.log('====================================================');

  const prompt = `你是一名专业 AI 短剧编剧与分镜导演。请根据以下故事概念，输出标准 JSON 格式的短剧方案。
必须严格遵循：
1. 黄金 3 秒开局：前 3 秒有强冲突悬念或生死反转钩子。
2. 角色四视图规范：定义主角与配角，提供锁脸四视图描述。
3. 10s 镜头节奏：每个分镜严格控制在 3-10 秒以内，标注镜头运动、视觉 Prompt 与台词。

故事概念: ${storyConcept}

请只返回纯合法 JSON，不要加多余 markdown 描述，JSON 结构如下:
{
  "title": "短剧标题",
  "hook": "黄金3秒开场反转说明",
  "characters": [
    {
      "name": "角色中文名",
      "identity": "身份定位",
      "fourViewPrompt": "角色全身及面部细节描述，用于生成四视图以防变脸"
    }
  ],
  "shots": [
    {
      "index": 1,
      "duration": 5,
      "camera": "特写/推镜头",
      "visualPrompt": "画面视觉描述，包含光影、环境与动作细节",
      "characterRefs": ["角色中文名"],
      "dialogue": "台词内容，无台词则填内心独白或环境音",
      "speaker": "说话者"
    }
  ]
}`;

  let jsonResult = null;

  // 尝试使用 opencli deepseek 生成
  try {
    console.log('[Stage 1] 尝试通过 OpenCLI DeepSeek 生成...');
    const safePrompt = prompt.replace(/"/g, '\\"').replace(/\n/g, ' ');
    const res = runCmd(OPENCLI_BIN, ['deepseek', 'ask', '--prompt', `"${safePrompt.substring(0, 4000)}"`], { timeout: 30000, ignoreError: true });
    if (res) {
      const match = res.match(/\{[\s\S]*\}/);
      if (match) {
        jsonResult = JSON.parse(match[0]);
        console.log('[Stage 1] ✅ DeepSeek 生成成功！');
      }
    }
  } catch (e) {
    console.log(`[Stage 1] 提示: DeepSeek 未连接或超时 (${e.message})，启用智能短剧引擎生成...`);
  }

  // 离线/降级智能模版保证确定性产出
  if (!jsonResult) {
    console.log('[Stage 1] 采用内置高反转工业模板快速构建...');
    const title = storyConcept.length > 12 ? storyConcept.substring(0, 12) : storyConcept;
    jsonResult = {
      title: title || '逆袭反转短剧',
      hook: '开场0.5秒巴掌声与离婚协议甩在脸上，紧接着主角眼神冷峻反转',
      characters: [
        {
          name: '陆辰',
          identity: '隐世龙王/重生成年男主',
          fourViewPrompt: '陆辰，26岁亚洲青年男性，利落黑色碎发，目光深邃冷冽，身着黑色定制西装搭配深灰衬衫，身形挺拔，四视图，全身站姿，超写实电影质感，虚幻引擎渲染，8k分辨率'
        },
        {
          name: '苏晴',
          identity: '傲慢前妻/反派女主',
          fourViewPrompt: '苏晴，25岁亚洲女性，高马尾波浪卷，妆容精致凌厉，身着红色风衣与高跟鞋，眼神轻蔑骄横，四视图，全身站姿，真实摄影质感，电影布光'
        }
      ],
      shots: [
        {
          index: 1,
          duration: 4,
          camera: '特写急速推近到男主瞳孔',
          visualPrompt: '电影级冷色调特写，{@陆辰} 额头流血却神情漠然，文件被风吹散，背景是奢华宴会厅的模糊虚影，强逆光高对比度',
          characterRefs: ['陆辰'],
          dialogue: '三年契约已到，这份协议，我签。',
          speaker: '陆辰'
        },
        {
          index: 2,
          duration: 5,
          camera: '中景低角度仰拍',
          visualPrompt: '{@苏晴} 双手抱胸冷笑，居高临下注视前方，周围宾客指指点点，暖黄色水晶吊灯下映衬着冷嘲热讽的嘴角',
          characterRefs: ['苏晴'],
          dialogue: '签了就赶紧滚，你这辈子都配不上苏家！',
          speaker: '苏晴'
        },
        {
          index: 3,
          duration: 6,
          camera: '远景平移转大特写',
          visualPrompt: '大门猛然推开，十辆黑色劳斯莱斯列队停在门外，数百名黑衣护卫齐齐鞠躬，{@陆辰} 缓缓转身戴上黑金指环',
          characterRefs: ['陆辰'],
          dialogue: '恭迎少主龙王归位！',
          speaker: '黑衣侍从'
        }
      ]
    };
  }

  return jsonResult;
}

/**
 * 阶段 2：输出 Google Flow 资产与提示词标准化文件
 */
function exportGoogleFlowPrompts(dramaData, outputDir) {
  console.log('\n🎨 ====================================================');
  console.log('[Stage 2] 正在标准化 Google Flow 资产与提示词...');
  console.log('====================================================');

  const flowPrompts = {
    project: dramaData.title,
    characters: dramaData.characters.map(c => ({
      assetName: c.name,
      flowAssetTag: `{@${c.name}}`,
      modelPrompt: `${c.fourViewPrompt}, front view, side view, back view, 4-view character sheet, neutral background, photorealistic 8k`,
      tips: `请在 Flow 资产库上传此四视图，并命名为 [${c.name}]`
    })),
    scenes: dramaData.shots.map(s => {
      const charTags = s.characterRefs.map(c => `{@${c}}`).join(' ');
      return {
        shotIndex: s.index,
        durationSeconds: s.duration,
        camera: s.camera,
        flowPrompt: `Create a cinematic clip: ${charTags} ${s.visualPrompt}. Camera motion: ${s.camera}. Style: cinematic realism, 8k, photorealistic, dramatic movie lighting.`,
        dialogue: s.dialogue
      };
    })
  };

  const flowPath = path.join(outputDir, 'flow_prompts.json');
  fs.writeFileSync(flowPath, JSON.stringify(flowPrompts, null, 2), 'utf-8');
  console.log(`[Stage 2] ✅ Flow 提示词已写入: ${flowPath}`);
  return flowPrompts;
}

/**
 * 阶段 3：调用 cutcli 生成剪映草稿并写入字幕与音视频轨
 */
function exportCutcliDraft(dramaData, outputDir) {
  console.log('\n✂️ ====================================================');
  console.log('[Stage 3] 正在通过 cutcli 自动构建剪映草稿...');
  console.log('====================================================');

  const draftName = `drama_${Date.now().toString().slice(-6)}_${dramaData.title.replace(/[^\w\u4e00-\u9fa5]/g, '_')}`;

  // 1. 创建草稿
  let createResRaw = runCmd(CUTCLI_BIN, ['draft', 'create', '--width', '1080', '--height', '1920', '--name', draftName]);
  let draftId = draftName;
  try {
    const parsed = JSON.parse(createResRaw);
    if (parsed.draftId) draftId = parsed.draftId;
  } catch (e) {
    // 兼容文本输出
    const m = createResRaw.match(/"draftId":"([^"]+)"/);
    if (m) draftId = m[1];
  }
  console.log(`[Stage 3] ✅ 成功创建剪映草稿 ID: ${draftId}`);

  // 2. 计算台词时间轴 (微秒: 1s = 1,000,000 μs)
  let currentTimeUs = 0;
  const captions = [];

  for (const shot of dramaData.shots) {
    const shotDurationUs = (shot.duration || 4) * 1000000;
    const startUs = currentTimeUs;
    const endUs = currentTimeUs + shotDurationUs;
    if (shot.dialogue && shot.dialogue.trim()) {
      captions.push({
        text: `${shot.speaker ? shot.speaker + '：' : ''}${shot.dialogue}`,
        start: startUs,
        end: endUs
      });
    }
    currentTimeUs += shotDurationUs;
  }

  // 3. 写入字幕到剪映草稿
  if (captions.length > 0) {
    const captionsFile = path.join(outputDir, 'captions.json');
    fs.writeFileSync(captionsFile, JSON.stringify(captions, null, 2), 'utf-8');

    console.log(`[Stage 3] 正在添加 ${captions.length} 条台词字幕并配置黄金短剧花字样式...`);
    const captionsArg = JSON.stringify(captions).replace(/"/g, '\\"');
    runCmd(CUTCLI_BIN, [
      'captions', 'add', draftId,
      '--captions', `'${JSON.stringify(captions)}'`,
      '--font-size', '9',
      '--bold',
      '--text-color', '"#FFFFFF"',
      '--border-color', '"#000000"',
      '--border-width', '2',
      '--has-shadow'
    ]);
    console.log(`[Stage 3] ✅ 剪映字幕轴与花字样式注入完毕！`);
  }

  return {
    draftId,
    totalDurationSeconds: currentTimeUs / 1000000,
    captionsCount: captions.length
  };
}

/**
 * 主执行流程
 */
async function main() {
  const args = process.argv.slice(2);
  const storyConcept = args[0] || '战神归来发现女儿住狗窝，一声令下十万将士奔赴';
  const shouldOpenFlow = args.includes('--open-flow');

  const outputDir = path.resolve(process.cwd(), 'output_drama');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🚀 Viral Shorts Drama Pipeline 启动中...');
  console.log(`输出目录: ${outputDir}`);

  // 1. 剧本与分镜
  const dramaData = await generateDramaData(storyConcept);
  const scriptPath = path.join(outputDir, 'drama_script.json');
  fs.writeFileSync(scriptPath, JSON.stringify(dramaData, null, 2), 'utf-8');
  console.log(`[Result] 剧本元数据已保存: ${scriptPath}`);

  // 2. Flow 资产提示词标准化
  const flowPrompts = exportGoogleFlowPrompts(dramaData, outputDir);

  // 3. 剪映草稿生成
  const draftInfo = exportCutcliDraft(dramaData, outputDir);

  // 4. 可选：打开 Google Flow
  if (shouldOpenFlow) {
    console.log('\n🌐 [Stage 4] 正在通过 OpenCLI 打开 Google Flow...');
    try {
      runCmd(OPENCLI_BIN, ['flow', 'new']);
      console.log('✅ Google Flow 页面已在 Chrome 中唤醒！');
    } catch (e) {
      console.log(`提示: 打开 Flow 失败 (${e.message})`);
    }
  }

  console.log('\n🎉 ====================================================');
  console.log('全部核心流程已打通！');
  console.log(`1. 剧本分镜数据: ${scriptPath}`);
  console.log(`2. Flow 提示词包: ${path.join(outputDir, 'flow_prompts.json')}`);
  console.log(`3. 剪映工程草稿: Draft ID = ${draftInfo.draftId} (总时长: ${draftInfo.totalDurationSeconds}s)`);
  console.log('你可以直接打开剪映 (CapCut) 桌面端，在草稿列表中看到刚刚生成的短剧工程！');
  console.log('====================================================\n');
}

main().catch(err => {
  console.error('\n❌ Pipeline 执行失败:', err);
  process.exit(1);
});
