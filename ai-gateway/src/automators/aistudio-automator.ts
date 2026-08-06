import { chromium } from 'playwright-core';

/**
 * AI Studio TTS Automator (Playwright CDP)
 *
 * 返回 Base64 编码的音频数据，由调用方自行决定存储位置。
 */
const MAKERSUITE_API = 'alkalimakersuite-pa.clients6.google.com/$rpc/google.internal.alkali.applications.makersuite.v1.MakerSuiteService';

export async function generateTTS(
  dialogueText: string,
  voiceName: string = "Zephyr"
): Promise<{ success: boolean; audioBase64: string; mimeType: string; error?: string }> {
  const CDP_URL = process.env.CHROME_CDP_URL;
  const AISTUDIO_URL = 'https://aistudio.google.com/generate-speech?model=gemini-3.1-flash-tts-preview';

  if (!CDP_URL) {
     return { success: false, audioBase64: '', mimeType: '', error: "Missing CHROME_CDP_URL in env." };
  }

  console.log(`[AIStudio Automator] Connecting to Chrome CDP at ${CDP_URL}...`);

  try {
    const browser = await chromium.connectOverCDP(CDP_URL);
    const defaultContext = browser.contexts()[0];

    // Find an existing AI Studio page
    let page = defaultContext.pages().find(p => p.url().includes('generate-speech'));

    if (!page) {
      console.log(`[AIStudio Automator] Navigating to ${AISTUDIO_URL} in a new tab...`);
      page = await defaultContext.newPage();
      await page.goto(AISTUDIO_URL, { waitUntil: 'domcontentloaded' });
    } else {
      console.log(`[AIStudio Automator] Reusing existing tab: ${page.url()}`);
      if (!page.url().includes('model=gemini-3.1-flash-tts-preview')) {
         await page.goto(AISTUDIO_URL, { waitUntil: 'domcontentloaded' });
      }
    }

    // 0. Check if we are on the Intro screen
    console.log(`[AIStudio Automator] Checking for intro screen...`);
    try {
      const introBtn = page.locator('button.text-input-container', { hasText: 'Turn text' }).first();
      await introBtn.waitFor({ state: 'visible', timeout: 3000 });
      console.log(`[AIStudio Automator] Found intro screen, clicking the huge text button...`);
      await introBtn.click();
      await page.waitForTimeout(1000);
    } catch (e) {
      console.log(`[AIStudio Automator] No intro screen found, assuming already in playground.`);
    }

    // 1. Wait for page to be ready
    console.log(`[AIStudio Automator] Wait for text area...`);
    await page.waitForSelector('ms-autosize-textarea textarea', { timeout: 30000 });
    const editor = page.locator('ms-autosize-textarea textarea').last();

    // 2. Select Voice if provided
    if (voiceName) {
      console.log(`[AIStudio Automator] Attempting to select Voice: ${voiceName}`);

      const speechBlock = page.locator('ms-speech-block').last();
      const speakerBtn = speechBlock.locator('.block-header .chip-row button').first();

      if (await speakerBtn.count() > 0) {
          console.log(`[AIStudio Automator] Opening speaker settings panel...`);
          await speakerBtn.click({ timeout: 5000 });
          await page.waitForSelector('ms-speaker-settings-panel', { state: 'visible', timeout: 5000 });
          await page.waitForTimeout(800);
      }

      const voiceCard = page.locator(`css=.voice-card[data-voice-name="${voiceName}"]`).first();
      if (await voiceCard.count() > 0) {
          await voiceCard.scrollIntoViewIfNeeded();
          const isSelected = await voiceCard.evaluate((node) => node.classList.contains('selected'));
          if (!isSelected) {
             console.log(`[AIStudio Automator] Clicking voice card: ${voiceName}`);
             await voiceCard.click({ timeout: 5000 });
             await page.waitForTimeout(500);
          } else {
             console.log(`[AIStudio Automator] Voice ${voiceName} is already selected.`);
          }
      } else {
          console.log(`[AIStudio Automator] Voice ${voiceName} not found, continuing with default.`);
      }

      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }

    // 3. Clear text box and input new dialogue
    const cleanedDialogueText = dialogueText
        .replace(/\[\s*excited\s*\]/gi, '[happy]')
        .replace(/【.*?】/g, '')
        .replace(/\[[^\]]*[一-龥]+[^\]]*\]/g, '')
        .replace(/\([^)]*[一-龥]+[^)]*\)/g, '')
        .trim();

    console.log(`[AIStudio Automator] Inputting dialogue: ${cleanedDialogueText}`);
    await page.keyboard.press('Escape');
    await editor.click({ force: true });
    await page.keyboard.press('Meta+A');
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(100);
    await editor.fill(cleanedDialogueText || dialogueText);
    await page.waitForTimeout(500);

    // ======== INTERCEPT: Set up network + snackbar error detection ========
    console.log(`[AIStudio Automator] Setting up error interceptors...`);

    // Promise A: Detect 403 via MakerSuite API response
    const api403Promise = page.waitForResponse(
      resp => resp.url().includes(MAKERSUITE_API) && resp.status() === 403,
      { timeout: 20000 }
    ).then(resp => resp.status()).catch(() => null);

    // Promise B: Detect 403/error snackbar toast
    const snackbarErrorPromise = page.locator('ms-callout.error-callout').first().waitFor({
      state: 'visible', timeout: 60000
    }).then(async () => {
      const errorText = await page.locator('ms-callout.error-callout .message').first().textContent();
      return errorText || 'Unknown snackbar error';
    }).catch(() => null);

    // 4. Click Run Button
    console.log(`[AIStudio Automator] Hitting Run...`);
    const runBtn = page.locator('ms-run-button button').first();
    await page.waitForTimeout(500);
    await runBtn.click({ timeout: 5000 });

    // 5. Race: wait for generation to finish vs error
    console.log(`[AIStudio Automator] Waiting for generation...`);

    // Wait for Run button to indicate "generating" (disabled)
    try {
      await page.waitForFunction(() => {
        const btn = document.querySelector('ms-run-button button');
        return btn?.getAttribute('aria-disabled') === 'true';
      }, null, { timeout: 5000 });
      console.log(`[AIStudio Automator] Generation started (Button disabled).`);
    } catch (e) {
      console.log(`[AIStudio Automator] Run button didn't disable quickly.`);
    }

    // Wait for completion — race between button re-enable, 403, and snackbar
    const genDonePromise = page.waitForFunction(() => {
      const btn = document.querySelector('ms-run-button button');
      return btn && btn.getAttribute('aria-disabled') !== 'true';
    }, null, { timeout: 60000 }).then(() => 'DONE').catch(() => 'TIMEOUT');

    const raceResult = await Promise.race([genDonePromise, api403Promise, snackbarErrorPromise]);

    // Check for errors first
    if (raceResult === 403 || (typeof raceResult === 'string' && raceResult.includes('403'))) {
      throw new Error("AI Studio API returned 403 (permission denied). The caller does not have permission. Try: using a different Google account, checking WARP region, or adding an API key.");
    }

    if (typeof raceResult === 'string' && raceResult.length > 10) {
      // It's a snackbar error message
      throw new Error(`AI Studio Error: ${raceResult}`);
    }

    // Also check snackbar after race (in case it appeared after gen completed)
    const snackbar = page.locator('ms-callout.error-callout');
    if (await snackbar.count() > 0 && await snackbar.isVisible()) {
      const errorText = await snackbar.locator('.message').textContent();
      throw new Error(`AI Studio Error: ${errorText || 'Unknown error from snackbar'}`);
    }

    console.log(`[AIStudio Automator] Generation finished! Finding audio download...`);
    await page.waitForTimeout(1500);

    // ======== DOWNLOAD: Multi-level fallback for audio download button ========
    let downloadBtn;

    // Level 1: Old UI — ms-music-player button.download-button
    downloadBtn = page.locator('ms-music-player button.download-button').last();
    if (await downloadBtn.count() === 0 || !(await downloadBtn.isVisible().catch(() => false))) {
      // Level 2: New UI — look for download icon anywhere (ms-audio-footer or other)
      downloadBtn = page.locator('button[download], [aria-label*="download" i]').last();
    }
    if (await downloadBtn.count() === 0 || !(await downloadBtn.isVisible().catch(() => false))) {
      // Level 3: material-symbols download icon inside any button
      downloadBtn = page.locator('button:has(span.material-symbols-outlined:has-text("download"))').last();
    }
    if (await downloadBtn.count() === 0 || !(await downloadBtn.isVisible().catch(() => false))) {
      // Level 4: Try audio element with src
      const audioSrc = await page.evaluate(() => {
        const audio = document.querySelector('audio[src]');
        return audio ? audio.getAttribute('src') : null;
      });
      if (audioSrc) {
        console.log(`[AIStudio Automator] Found audio element with src, fetching directly...`);
        const response = await page.evaluate(async (src) => {
          const resp = await fetch(src);
          const blob = await resp.blob();
          return { base64: await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          })};
        }, audioSrc);
        const base64Data = response.base64.split(',')[1];
        console.log(`[AIStudio Automator] Audio fetched via src (${(base64Data.length * 0.75 / 1024).toFixed(1)} KB)`);
        return { success: true, audioBase64: base64Data, mimeType: 'audio/wav' };
      }
    }

    // If we found a download button, use it
    if (await downloadBtn.count() > 0 && await downloadBtn.isVisible().catch(() => false)) {
      console.log(`[AIStudio Automator] Intercepting Download via button click...`);
      const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
      await downloadBtn.click({ timeout: 5000 });
      const download = await downloadPromise;
      const stream = await download.createReadStream();
      if (!stream) throw new Error("Received empty download stream from browser.");

      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      const audioBuffer = Buffer.concat(chunks);
      const audioBase64 = audioBuffer.toString('base64');
      console.log(`[AIStudio Automator] Audio captured (${(audioBuffer.length / 1024).toFixed(1)} KB)`);
      return { success: true, audioBase64, mimeType: 'audio/wav' };
    }

    // Nothing found
    throw new Error("Generation completed but no audio download button or element found. The UI may have changed.");

  } catch (err: any) {
    console.error("[AIStudio Automator] Error generating TTS:", err);
    return { success: false, audioBase64: '', mimeType: '', error: err.message };
  }
}