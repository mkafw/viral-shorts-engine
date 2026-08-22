import { chromium } from 'playwright-core';

/**
 * 豆包 (Doubao) TTS 自动化驱动
 * 利用豆包聊天框的语音预览功能或专门的语音合成页面实现
 */
export async function generateDoubaoTTS(
  text: string,
  voiceName: string = "灿灿" // 默认好听的中文女声
): Promise<{ success: boolean; audioBase64: string; mimeType: string; error?: string }> {
  const CDP_URL = process.env.CHROME_CDP_URL || 'http://127.0.0.1:9222';
  
  console.log(`[Doubao TTS] Connecting to Chrome CDP...`);
  
  let browser;
  try {
    browser = await chromium.connectOverCDP(CDP_URL);
  } catch (e: any) {
    throw new Error(`[Doubao TTS] Failed to connect: ${e.message}`);
  }

  try {
    const context = browser.contexts()[0];
    let page = context.pages().find(p => p.url().includes('doubao.com/chat'));

    if (!page) {
       page = await context.newPage();
       await page.goto('https://www.doubao.com/chat', { waitUntil: 'networkidle' });
    }

    console.log(`[Doubao TTS] 正在准备文本: "${text.substring(0, 30)}..."`);
    
    // 1. 寻找输入框并输入文本
    const inputArea = page.locator('textarea').first();
    await inputArea.waitFor({ state: 'visible' });
    await inputArea.fill(text);
    await page.waitForTimeout(500);

    // 2. 核心：劫持音频请求。豆包点击“朗读”时会发出二进制音频流请求
    console.log(`[Doubao TTS] 正在开启请求拦截以抓取音频...`);
    
    const audioPromise = page.waitForResponse(response => 
      response.url().includes('vop.baidu.com') || 
      response.url().includes('volcengine.com') || 
      response.headerValue('content-type')?.includes('audio/') ||
      response.url().includes('api/v1/voice/generate'),
      { timeout: 30000 }
    );

    // 3. 点击“朗读”或“语音预览”按钮
    // 豆包的 UI 经常变，通常是一个小喇叭图标
    const speakBtn = page.locator('svg[data-dbx-name="button-voice"], .voice-btn, [aria-label*="朗读"]').last();
    if (await speakBtn.isVisible()) {
        await speakBtn.click();
    } else {
        // 如果找不到按钮，尝试通过右键菜单或快捷键触发（根据具体 UI 调整）
        console.log(`[Doubao TTS] 未找到显式朗读按钮，尝试通过 Enter 发送并抓取回复后的朗读...`);
        await page.keyboard.press('Enter');
    }

    const response = await audioPromise;
    const buffer = await response.body();
    const mimeType = response.headerValue('content-type') || 'audio/mpeg';

    console.log(`[Doubao TTS] 成功抓取音频流，大小: ${buffer.length} bytes`);

    await browser.close();
    return {
      success: true,
      audioBase64: buffer.toString('base64'),
      mimeType: mimeType
    };

  } catch (e: any) {
    if (browser) await browser.close();
    console.error(`[Doubao TTS Error] ${e.message}`);
    return { success: false, audioBase64: '', mimeType: '', error: e.message };
  }
}
