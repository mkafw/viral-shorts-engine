import { deepSeekAsk, extractResponseContent } from './opencli.js';

/**
 * DeepSeek Automator (OpenCLI 版)
 *
 * 使用 OpenCLI 的 deepseek 适配器，通过 Chrome 浏览器连接 DeepSeek 网页版。
 * 不需要手动管理 Playwright CDP 连接。
 */

let isDeepSeekGenerating = false;

export async function generatePromptWithDeepSeekWeb(
  systemPrompt: string,
  userPrompt: string,
  forceJson: boolean = true
): Promise<string> {
  // 简单自旋锁，防止并发
  const maxWaitTime = 120000;
  const startTime = Date.now();
  while (isDeepSeekGenerating) {
    if (Date.now() - startTime > maxWaitTime) {
      throw new Error('DeepSeek automator is busy and timed out.');
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  isDeepSeekGenerating = true;

  try {
    console.log(`[DeepSeek Automator] 通过 OpenCLI 调用 DeepSeek...`);

    let fullPrompt = `${systemPrompt}\n\n======================\n\n${userPrompt}`;
    if (forceJson) {
      fullPrompt += `\n\n(REMEMBER: Output strict JSON only)`;
    }

    const result = deepSeekAsk(fullPrompt);
    const content = extractResponseContent(result);

    if (!content) {
      throw new Error('DeepSeek 返回内容为空');
    }

    console.log(`[DeepSeek Automator] ✅ 生成成功 (${content.length} 字符)`);
    return content;
  } finally {
    isDeepSeekGenerating = false;
  }
}