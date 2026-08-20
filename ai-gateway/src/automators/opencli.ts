import { execSync } from 'child_process';

/**
 * OpenCLI 包装器
 *
 * 将 OpenCLI (jackwener/OpenCLI) 的命令行适配器封装为可调用的异步函数。
 * 所有命令通过 execSync 执行，超时默认 120 秒。
 */

const OPENCLI_BIN = 'opencli';
const DEFAULT_TIMEOUT = 120_000;

function runOpenCli(args: string, timeout = DEFAULT_TIMEOUT): string {
  // 移除换行防止 shell 注入
  const safeArgs = args.replace(/\n/g, ' ').replace(/\r/g, '');
  const cmd = `${OPENCLI_BIN} ${safeArgs}`;
  console.log(`[OpenCLI] $ ${cmd.substring(0, 200)}`);
  try {
    return execSync(cmd, {
      encoding: 'utf-8',
      timeout,
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });
  } catch (e: any) {
    throw new Error(`[OpenCLI] 命令失败: ${cmd.substring(0, 120)}...\n${e.stderr || e.message}`);
  }
}

// ─── DeepSeek ────────────────────────────────────────────────────────────────

export function deepSeekAsk(prompt: string, timeout = 120_000): string {
  // 构造 JSON 安全的单行 prompt
  const safe = prompt.replace(/"/g, '\\"').replace(/\n/g, '\\n').substring(0, 8000);
  return runOpenCli(`deepseek ask --prompt "${safe}"`, timeout);
}

export function deepSeekStatus(): string {
  return runOpenCli('deepseek status', 15_000);
}

// ─── 豆包 (Doubao) ──────────────────────────────────────────────────────────

export function doubaoChat(message: string, timeout = 120_000): string {
  const safe = message.replace(/"/g, '\\"').replace(/\n/g, '\\n').substring(0, 8000);
  return runOpenCli(`doubao chat --message "${safe}"`, timeout);
}

export function doubaoStatus(): string {
  return runOpenCli('doubao status', 15_000);
}

// ─── Google Flow ─────────────────────────────────────────────────────────────

export function flowStatus(): string {
  return runOpenCli('flow status', 15_000);
}

export function flowNew(): string {
  return runOpenCli('flow new', 30_000);
}

export function flowOpen(projectId: string): string {
  return runOpenCli(`flow open ${projectId}`, 30_000);
}

export function flowPrompt(): string {
  return runOpenCli('flow prompt', 10_000);
}

export function flowScene(): string {
  return runOpenCli('flow scene', 10_000);
}

// ─── 工具函数：从 OpenCLI 表格输出中提取文本内容 ─────────────────────────

/**
 * 从 OpenCLI 的表格输出中提取第一条非空内容（跳过表头和分割线）。
 */
export function extractTableContent(output: string): string {
  const lines = output.split('\n').filter(line => {
    const t = line.trim();
    return t && !t.startsWith('┌') && !t.startsWith('├') && !t.startsWith('└') && !t.startsWith('│') && !t.startsWith('─');
  });
  return lines.join('\n').trim();
}

/**
 * 从 OpenCLI 的 Response 列中提取文本内容。
 */
export function extractResponseContent(output: string): string {
  // 尝试提取表格中的 Response 列内容
  const lines = output.split('\n');
  let inResponse = false;
  let inData = false;
  const results: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();

    // 找到表头 "│ Response"
    if (trimmed.includes('│ Response')) {
      inResponse = true;
      continue;
    }

    if (inResponse) {
      // 跳过表格分割线 ├───┼───┤
      if (trimmed.startsWith('├')) continue;

      // 表格结束 └───┴───┘
      if (trimmed.startsWith('└')) break;

      // 数据行 │ ... │
      if (trimmed.startsWith('│')) {
        const content = trimmed.replace(/^│\s*/, '').replace(/\s*│$/, '').trim();
        if (content) results.push(content);
      }
    }
  }
  return results.join('\n') || output;
}