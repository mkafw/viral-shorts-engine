import { deepSeekAsk, doubaoChat, deepSeekStatus, doubaoStatus, extractResponseContent } from './opencli.js';

/**
 * 智能调度器：使用 OpenCLI 自动探测可用 AI 服务并进行调用。
 * 支持主备切换与自动热插拔。
 *
 * 注意：OpenCLI 不提供 Gemini 适配器，因此 Gemini 不再作为备选引擎。
 * 备选引擎为 DeepSeek（首选）→ 豆包（备选）。
 */

/**
 * 探测哪些 AI 引擎可用（通过 OpenCLI status 命令）
 */
async function detectAvailableProviders(): Promise<string[]> {
  const available: string[] = [];

  // DeepSeek
  try {
    const out = deepSeekStatus();
    if (out.includes('logged_in')) {
      available.push('deepseek');
      console.log(`[Smart Router] ✅ DeepSeek 可用`);
    }
  } catch {
    console.log(`[Smart Router] ❌ DeepSeek 不可用`);
  }

  // 豆包
  try {
    const out = doubaoStatus();
    if (out.includes('logged_in')) {
      available.push('doubao');
      console.log(`[Smart Router] ✅ 豆包 可用`);
    }
  } catch {
    console.log(`[Smart Router] ❌ 豆包 不可用`);
  }

  return available;
}

/**
 * 智能文本生成。
 * 使用 OpenCLI 依次尝试可用的 AI 引擎，支持失败自动回退。
 */
export async function smartGenerateText(
  systemPrompt: string,
  userPrompt: string,
  forceJson: boolean = true,
  preferredProvider?: string
): Promise<string> {
  console.log(`[Smart Router] 正在探测可用 AI 引擎...`);

  // 探测可用引擎
  let availableProviders = await detectAvailableProviders();
  console.log(`[Smart Router] 检测到活跃引擎: [${availableProviders.join(', ') || '无'}]`);

  // 确定调用顺序
  let queue: string[] = [];
  if (preferredProvider && availableProviders.includes(preferredProvider)) {
    queue.push(preferredProvider);
  }

  // 优先级：DeepSeek → 豆包
  const priority = ['deepseek', 'doubao'];
  for (const p of priority) {
    if (availableProviders.includes(p) && !queue.includes(p)) {
      queue.push(p);
    }
  }

  // 探测不到时，也尝试所有引擎
  if (queue.length === 0) {
    if (preferredProvider) queue.push(preferredProvider);
    queue.push(...priority);
  }

  // 拼接完整 prompt
  let fullPrompt = `${systemPrompt}\n\n======================\n\n${userPrompt}`;
  if (forceJson) {
    fullPrompt += `\n\n(REMEMBER: Output strict JSON only)`;
  }

  let lastError: Error | null = null;
  for (const provider of queue) {
    try {
      console.log(`[Smart Router] 正在尝试使用 [${provider}] 生成内容...`);
      let result: string;

      if (provider === 'deepseek') {
        result = deepSeekAsk(fullPrompt);
      } else if (provider === 'doubao') {
        result = doubaoChat(fullPrompt);
      } else {
        console.log(`[Smart Router] 未知引擎: ${provider}，跳过`);
        continue;
      }

      // 从 OpenCLI 表格输出中提取实际内容
      const content = extractResponseContent(result);
      if (content) {
        console.log(`[Smart Router] ✅ [${provider}] 生成成功 (${content.length} 字符)`);
        return content;
      }
      throw new Error(`[${provider}] 返回内容为空`);
    } catch (e: any) {
      console.error(`[Smart Router] ❌ [${provider}] 调用失败: ${e.message}`);
      lastError = e;
      console.log(`[Smart Router] 正在尝试切换到下一个备用引擎...`);
    }
  }

  throw new Error(
    `[Smart Router] 所有 AI 引擎均调用失败。最后一次错误: ${lastError?.message}`
  );
}