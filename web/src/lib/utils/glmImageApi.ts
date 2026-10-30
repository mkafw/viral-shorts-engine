/**
 * GLM-Image API (image.z.ai) — 智谱AI 免费生图服务
 * 
 * Auth: 需要 session cookie（从浏览器复制）
 * Endpoint: POST https://image.z.ai/api/proxy/images/generate
 */

const GLM_IMAGE_BASE = 'https://image.z.ai/api/proxy/images';

export interface GlmImageParams {
  prompt: string;
  ratio?: string;       // "9:16" | "1:1" | "16:9"
  resolution?: string;  // "1K" | "2K"
  rm_label_watermark?: boolean;
}

export interface GlmImageResult {
  image_id: string;
  image_url: string;
  width: number;
  height: number;
  ratio: string;
  resolution: string;
}

export class GlmImageApi {
  private sessionCookie: string;

  constructor(sessionCookie: string) {
    this.sessionCookie = sessionCookie;
  }

  async generate(params: GlmImageParams): Promise<GlmImageResult> {
    const res = await fetch(`${GLM_IMAGE_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': this.sessionCookie,
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        'Origin': 'https://image.z.ai',
        'Referer': 'https://image.z.ai/create',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        ratio: params.ratio || '9:16',
        resolution: params.resolution || '1K',
        rm_label_watermark: params.rm_label_watermark ?? true,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GLM-Image API error ${res.status}: ${text}`);
    }

    const json = await res.json();
    if (json.code !== 200) {
      throw new Error(`GLM-Image API failed: ${json.message || JSON.stringify(json)}`);
    }

    const img = json.data.image;
    return {
      image_id: img.image_id,
      image_url: img.image_url,
      width: img.width,
      height: img.height,
      ratio: img.ratio,
      resolution: img.resolution,
    };
  }
}