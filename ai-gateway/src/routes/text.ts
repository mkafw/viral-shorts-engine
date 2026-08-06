import { Router } from 'express';
import { smartGenerateText } from '../automators/smart-router.js';
import { enqueue } from '../middleware/serialQueue.js';

export const textRouter = Router();

/**
 * POST /api/text/generate
 * 
 * 智能路由文本生成：自动探测活跃引擎（Gemini/Doubao）并支持失败回退。
 */
textRouter.post('/generate', async (req, res) => {
  try {
    const { systemPrompt, userPrompt, forceJson, provider } = req.body;

    if (!systemPrompt || !userPrompt) {
      res.status(400).json({ error: 'Missing systemPrompt or userPrompt' });
      return;
    }

    console.log(`\n[Text Route] 收到生成请求。首选引擎: [${provider || '自动探测'}]. 提示词预览: "${userPrompt.substring(0, 60)}..."`);

    const text = await enqueue(() => {
      return smartGenerateText(systemPrompt, userPrompt, forceJson ?? true, provider);
    });

    res.json({ text });
  } catch (err: any) {
    console.error('[Text Route] 最终生成失败:', err.message);
    res.status(500).json({ error: err.message });
  }
});
