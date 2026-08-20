import { deepSeekAsk, extractResponseContent } from './opencli.js';

/**
 * Gemini Automator (OpenCLI 版)
 *
 * OpenCLI 没有内置 Gemini 适配器，因此使用 DeepSeek 作为替代引擎。
 * 保留了原函数签名以保证向后兼容。
 */

export async function generatePromptWithGeminiWeb(
  systemPrompt: string,
  userPrompt: string,
  forceJson: boolean = true
): Promise<string> {
  console.log(`[Gemini Automator] OpenCLI 无 Gemini 适配器，使用 DeepSeek 替代...`);

  let fullPrompt = `${systemPrompt}\n\n======================\n\n${userPrompt}`;
  if (forceJson) {
    fullPrompt += `\n\n(REMEMBER: Output strict JSON only)`;
  }

  const result = deepSeekAsk(fullPrompt);
  const content = extractResponseContent(result);

  if (!content) {
    throw new Error('Gemini (via DeepSeek) 返回内容为空');
  }

  console.log(`[Gemini Automator] ✅ 通过 DeepSeek 生成成功 (${content.length} 字符)`);
  return content;
}