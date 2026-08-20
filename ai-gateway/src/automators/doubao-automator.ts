import { doubaoChat, extractResponseContent } from './opencli.js';

/**
 * 豆包 Automator (OpenCLI 版)
 *
 * 使用 OpenCLI 的 doubao 适配器，通过 Chrome 浏览器连接豆包网页版。
 * 不需要手动管理 Playwright CDP 连接。
 */

let isDoubaoGenerating = false;

export async function generatePromptWithDoubaoWeb(
  systemPrompt: string,
  userPrompt: string,
  forceJson: boolean = true
): Promise<string> {
  // 简单自旋锁，防止并发
  const maxWaitTime = 120000;
  const startTime = Date.now();
  while (isDoubaoGenerating) {
    if (Date.now() - startTime > maxWaitTime) {
      throw new Error('Doubao automator is busy and timed out.');
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  isDoubaoGenerating = true;

  try {
    console.log(`[Doubao Automator] 通过 OpenCLI 调用豆包...`);

    let fullPrompt = `${systemPrompt}\n\n======================\n\n${userPrompt}`;
    if (forceJson) {
      fullPrompt += `\n\n(REMEMBER: Output strict JSON only)`;
    }

    const result = doubaoChat(fullPrompt);
    const content = extractResponseContent(result);

    if (!content) {
      throw new Error('豆包 返回内容为空');
    }

    console.log(`[Doubao Automator] ✅ 生成成功 (${content.length} 字符)`);
    return content;
  } finally {
    isDoubaoGenerating = false;
  }
}