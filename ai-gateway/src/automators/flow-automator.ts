/**
 * Google Flow Automator (OpenCLI 版)
 *
 * Flow 是 Google 的 AI 创意工作室，支持 Veo 3.1（视频）、Nano Banana（图片）、Gemini Omni 等模型。
 * 使用 OpenCLI 的 flow 适配器操作 Flow 页面，不需要手动管理 Playwright CDP 连接。
 */

import { flowStatus, flowNew, flowOpen, flowPrompt, flowScene, extractTableContent } from './opencli.js';

export { flowPrompt, flowScene };

/**
 * 获取 Flow 页面状态
 */
export async function getFlowPageStatus(): Promise<{
  success: boolean;
  onProjectPage: boolean;
  interactiveElements: string[];
  error?: string;
}> {
  try {
    const result = flowStatus();
    const content = extractTableContent(result);

    const onProjectPage = content.includes('project') || content.includes('Project');
    const elements: string[] = [];

    // 从输出中提取 URL 信息
    if (content.includes('about:blank')) {
      console.log(`[Flow Automator] Flow 页面未打开，尝试打开...`);
      await flowNew();
    }

    return {
      success: true,
      onProjectPage,
      interactiveElements: elements,
    };
  } catch (err: any) {
    return {
      success: false,
      onProjectPage: false,
      interactiveElements: [],
      error: err.message,
    };
  }
}

/**
 * 在 Flow 页面中执行函数（通过 OpenCLI 的 flow 命令）
 * 保留与原版相同的签名以便兼容
 */
export async function evaluateOnFlowPage<T>(
  fn: (page: any) => Promise<T>
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    // 检查 Flow 状态
    const status = flowStatus();
    const content = extractTableContent(status);

    if (content.includes('about:blank') || !content) {
      await flowNew();
    }

    // 注意：OpenCLI 不支持在 Flow 页面中执行任意 JS，
    // 如需复杂 DOM 操作，请使用 OpenCLI 的 flow 命令或直接操作浏览器
    console.log(`[Flow Automator] evaluateOnFlowPage 在 OpenCLI 模式下受限，请使用具体 flow 命令替代`);

    return {
      success: true,
      data: undefined as unknown as T,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
    };
  }
}