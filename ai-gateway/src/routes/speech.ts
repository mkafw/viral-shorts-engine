import { Router } from 'express';
import { generateTTS as generateGoogleTTS } from '../automators/aistudio-automator.js';
import { generateDoubaoTTS } from '../automators/doubao-automator-tts.js'; // 修正导入名
import { enqueue } from '../middleware/serialQueue.js';

export const speechRouter = Router();

/**
 * POST /api/speech/generate
 * 
 * 智能语音生成路由：支持 Google AI Studio 和 豆包 TTS 热插拔。
 * 
 * Body:
 *   - text: string (要合成的文本)
 *   - voiceName?: string (声音名称)
 *   - provider?: 'google' | 'doubao' (默认 google)
 */
speechRouter.post('/generate', async (req, res) => {
  try {
    const { text, voiceName, provider } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Missing text' });
      return;
    }

    const currentProvider = provider || 'google';
    console.log(`\n[Speech Route] 收到配音请求. 引擎: [${currentProvider}], 文本: "${text.substring(0, 40)}..."`);

    const result = await enqueue(async () => {
      if (currentProvider === 'doubao') {
        return await generateDoubaoTTS(text, voiceName || '灿灿');
      } else {
        return await generateGoogleTTS(text, voiceName || 'Zephyr');
      }
    });

    res.json(result);
  } catch (err: any) {
    console.error('[Speech Route] 最终生成失败:', err.message);
    res.status(500).json({ success: false, audioBase64: '', mimeType: '', error: err.message });
  }
});
