/**
 * 从浏览器 CDP 自动提取 image.z.ai session cookie
 */

import puppeteer from 'puppeteer-core';

export async function getGlmImageSession(port: number = 9222): Promise<string> {
  const url = `http://127.0.0.1:${port}/json/version`;
  const res = await fetch(url);
  const data = await res.json();

  const browser = await puppeteer.connect({
    browserWSEndpoint: data.webSocketDebuggerUrl,
    defaultViewport: null,
  });

  try {
    const pages = await browser.pages();
    // 找 image.z.ai 或 chat.z.ai 页面
    const page = pages.find(p =>
      p.url().includes('image.z.ai') || p.url().includes('chat.z.ai')
    );

    if (!page) {
      throw new Error(
        '未找到 image.z.ai 或 chat.z.ai 页面。请先在 Chrome 中打开 https://image.z.ai/ 并登录。'
      );
    }

    const cookies = await page.cookies();
    const sessionCookie = cookies.find(c => c.name === 'session');
    if (!sessionCookie) {
      throw new Error(
        '未找到 session cookie。请确保已在 image.z.ai 登录。'
      );
    }

    return `session=${sessionCookie.value}`;
  } finally {
    await browser.disconnect();
  }
}

export async function getGlmImageSessionFromStore(): Promise<string | null> {
  const { getDb } = await import('@/lib/db');
  const { systemStates } = await import('@/lib/schema');
  const { eq } = await import('drizzle-orm');
  const db = getDb();
  const row = db.select().from(systemStates)
    .where(eq(systemStates.key, 'glmImageSession')).get();
  return row?.value || null;
}
