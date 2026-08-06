/**
 * 电影模块系统 — 解析引擎
 *
 * Slot 解析 + 模板渲染 + 提示词生成
 * 纯函数，无副作用，可同时在服务端和客户端使用
 */
import { MODULE_INSTANCES, PROMPT_TEMPLATES, EMOTION_LIGHTING, type ModuleInstance } from './data';

// ==================== 类型定义 ====================

/** 模块选择状态：type → code(s) */
export interface ModuleSelections {
  character?: string | null;
  scene?: string | null;
  emotion?: string | null;
  props?: string[];
  camera?: string | null;
  lighting?: string | null;
  conflict?: string | null;
  music?: string | null;
  sfx?: string | null;
  ambient?: string | null;
  negative_prompt?: string[];
  generation_params?: string | null;
  sequence?: string[];
  background?: string | null;
  template?: string;
}

/** 构建后的模块映射表：kebab-key → ModuleInstance */
export interface ModuleMap {
  character?: ModuleInstance;
  scene?: ModuleInstance;
  emotion?: ModuleInstance;
  props?: ModuleInstance[];
  camera?: ModuleInstance;
  lighting?: ModuleInstance;
  conflict?: ModuleInstance;
  music?: ModuleInstance;
  sfx?: ModuleInstance;
  ambient?: ModuleInstance;
  negative_prompt?: ModuleInstance[];
  generation_params?: ModuleInstance;
  sequence?: ModuleInstance[];
  background?: ModuleInstance;
  [key: string]: unknown;
}

// ==================== 构建模块映射 ====================

export function buildModuleMap(selections: ModuleSelections): ModuleMap {
  const modules: ModuleMap = {};

  if (selections.character) {
    const c = MODULE_INSTANCES.Character.find(x => x.code === selections.character);
    if (c) modules.character = c;
  }
  if (selections.scene) {
    const s = MODULE_INSTANCES.Scene.find(x => x.code === selections.scene);
    if (s) modules.scene = s;
  }
  if (selections.emotion) {
    const e = MODULE_INSTANCES.Emotion.find(x => x.code === selections.emotion);
    if (e) modules.emotion = e;
  }
  if (selections.props?.length) {
    modules.props = selections.props
      .map(p => MODULE_INSTANCES.Prop.find(x => x.code === p))
      .filter(Boolean) as ModuleInstance[];
  }
  if (selections.camera) {
    const c = MODULE_INSTANCES.Camera.find(x => x.code === selections.camera);
    if (c) modules.camera = c;
  }
  if (selections.lighting) {
    const l = MODULE_INSTANCES.Lighting?.find(x => x.code === selections.lighting);
    if (l) modules.lighting = l;
  }
  if (selections.conflict) {
    const c = MODULE_INSTANCES.Conflict.find(x => x.code === selections.conflict);
    if (c) modules.conflict = c;
  }
  if (selections.music) {
    const m = MODULE_INSTANCES.Music.find(x => x.code === selections.music);
    if (m) modules.music = m;
  }
  if (selections.sfx) {
    const s = MODULE_INSTANCES.SFX?.find(x => x.code === selections.sfx);
    if (s) modules.sfx = s;
  }
  if (selections.ambient) {
    const a = MODULE_INSTANCES.Ambient?.find(x => x.code === selections.ambient);
    if (a) modules.ambient = a;
  }
  if (selections.negative_prompt?.length) {
    modules.negative_prompt = selections.negative_prompt
      .map(p => MODULE_INSTANCES.NegativePrompt?.find(x => x.code === p))
      .filter(Boolean) as ModuleInstance[];
  }
  if (selections.generation_params) {
    const g = MODULE_INSTANCES.GenerationParams?.find(x => x.code === selections.generation_params);
    if (g) modules.generation_params = g;
  }
  if (selections.sequence?.length) {
    modules.sequence = selections.sequence
      .map(p => MODULE_INSTANCES.Sequence?.find(x => x.code === p))
      .filter(Boolean) as ModuleInstance[];
  }
  if (selections.background) {
    const b = MODULE_INSTANCES.Background.find(x => x.code === selections.background);
    if (b) modules.background = b;
  }

  return modules;
}

// ==================== Slot 解析引擎 ====================

/**
 * 解析单个 slot 表达式
 * @param moduleMap - 构建后的模块映射
 * @param slot - 点号路径，如 "character.appearance" 或 "camera.full"
 * @returns 解析后的字符串
 */
export function resolveSlot(moduleMap: ModuleMap, slot: string): string {
  if (!slot || !moduleMap) return '';

  const parts = slot.split('.');
  if (parts.length < 2) return '';

  const [type, field] = parts;

  // camera.full → 组合所有运镜字段
  if (type === 'camera' && field === 'full') {
    const cam = moduleMap.camera;
    if (!cam) return '';
    const base = [cam.shot_size as string, cam.movement as string, cam.angle as string].filter(Boolean);
    const extras: string[] = [];
    if (cam.lens_type) extras.push(`镜头:${cam.lens_type}`);
    if (cam.focus_effect) extras.push(`焦点:${cam.focus_effect}`);
    if (cam.composition) extras.push(`构图:${cam.composition}`);
    if (extras.length) base.push(extras.join('，'));
    return base.join('，');
  }

  // lighting.full → 组合所有光影字段
  if (type === 'lighting' && field === 'full') {
    const lit = moduleMap.lighting;
    if (!lit) return '';
    const p = [lit.light_type, lit.color_temp, lit.intensity];
    if (lit.direction) p.push(lit.direction as string);
    if (lit.effect) p.push(lit.effect as string);
    return p.filter(Boolean).join('，');
  }

  // sfx.full → 组合音效字段
  if (type === 'sfx' && field === 'full') {
    const sfx = moduleMap.sfx;
    if (!sfx) return '';
    const p = [sfx.kind, sfx.description];
    if (sfx.intensity) p.push(`强度:${sfx.intensity}`);
    if (sfx.timing) p.push(`时机:${sfx.timing}`);
    return p.filter(Boolean).join('，');
  }

  // ambient.full → 组合环境音字段
  if (type === 'ambient' && field === 'full') {
    const amb = moduleMap.ambient;
    if (!amb) return '';
    const p = [amb.kind, amb.description];
    if (amb.density) p.push(`密度:${amb.density}`);
    if (amb.reverb) p.push(`混响:${amb.reverb}`);
    return p.filter(Boolean).join('，');
  }

  // negative_prompt.full → 多选组合
  if (type === 'negative_prompt' && field === 'full') {
    const items = moduleMap.negative_prompt || [];
    if (!Array.isArray(items)) return '';
    return items.map(np => {
      let desc = np.target as string;
      if (np.severity) desc = `${np.severity}:${desc}`;
      return desc;
    }).filter(Boolean).join('，');
  }

  // generation_params.full → 组合参数
  if (type === 'generation_params' && field === 'full') {
    const gp = moduleMap.generation_params;
    if (!gp) return '';
    const p = [gp.aspect_ratio];
    if (gp.duration) p.push(`时长${gp.duration}`);
    if (gp.seed) p.push(`seed${gp.seed}`);
    if (gp.fps) p.push(`${gp.fps}fps`);
    if (gp.style) p.push(gp.style as string);
    return p.join('，');
  }

  // sequence.full → 按 order 排序，→ 连接
  if (type === 'sequence' && field === 'full') {
    const items = moduleMap.sequence || [];
    if (!Array.isArray(items)) return '';
    const sorted = [...items].sort((a, b) => (a.order as number || 0) - (b.order as number || 0));
    return sorted.map(seq => {
      let desc = `[${seq.order}] ${seq.action}`;
      if (seq.duration) desc += `(${seq.duration})`;
      return desc;
    }).join(' → ');
  }

  // character.personality → 数组转字符串
  if (type === 'character' && field === 'personality') {
    const char = moduleMap.character;
    if (!char || !Array.isArray(char.personality)) return '';
    return char.personality.join('、');
  }

  // 多选模块（props）
  if (type === 'prop' || type === 'props') {
    const items = moduleMap.props || [];
    if (!Array.isArray(items)) return '';
    return items.map(p => {
      if (typeof p === 'string') return p;
      const val = p[field];
      return val ? String(val) : '';
    }).filter(Boolean).join('，');
  }

  // 通用字段
  const mod = moduleMap[type] as Record<string, unknown> | undefined;
  if (!mod) return '';
  const val = mod[field];
  if (Array.isArray(val)) return val.join('、');
  if (typeof val === 'string') return val;
  if (val === null || val === undefined) return '';
  return String(val);
}

/**
 * 解析模板的所有 slots，返回拼接后的字符串
 */
export function resolveTemplate(
  moduleMap: ModuleMap,
  slots: string[],
  joinStr?: string,
  detail?: false
): string;
export function resolveTemplate(
  moduleMap: ModuleMap,
  slots: string[],
  joinStr: string,
  detail: true
): { text: string; slots: { slot: string; value: string }[] };
export function resolveTemplate(
  moduleMap: ModuleMap,
  slots: string[],
  joinStr = '，',
  detail?: boolean
): string | { text: string; slots: { slot: string; value: string }[] } {
  if (!slots?.length) return detail ? { text: '', slots: [] } : '';

  const resolved = slots.map(slot => ({
    slot,
    value: resolveSlot(moduleMap, slot),
  }));

  const text = resolved.map(r => r.value).filter(Boolean).join(joinStr);

  if (detail) return { text, slots: resolved };
  return text;
}

// ==================== 提示词生成 ====================

export interface PromptResult {
  title: string;
  full_prompt: string;
  negative_prompt: string;
  template: string;
  parameters: {
    aspect_ratio: string | null;
    duration: string | null;
    seed: number | null;
    fps: number | null;
    style: string | null;
  };
  layers: {
    lighting: string;
    composition: string;
  };
  metadata: Record<string, unknown>;
  module_codes: Record<string, string | string[] | null>;
}

export function generatePrompt(selections: ModuleSelections): PromptResult {
  const modules = buildModuleMap(selections);
  const templateId = selections.template || 'default';
  const tmpl = PROMPT_TEMPLATES.find(t => t.id === templateId) || PROMPT_TEMPLATES[0];

  const promptText = resolveTemplate(modules, tmpl.slots, '，');

  // 光影
  let lighting = '-', composition = '-';
  if (modules.emotion) {
    const l = EMOTION_LIGHTING[modules.emotion.mood as string];
    if (l) { lighting = l.lighting; composition = l.composition; }
  }

  // 排除项
  const negativePromptText = (modules.negative_prompt || [])
    .map(np => {
      let desc = np.target as string;
      if (np.severity) desc = `${np.severity}:${desc}`;
      return desc;
    })
    .join('，');

  const title = [modules.background?.name, modules.character?.name, modules.scene?.name, modules.emotion?.name]
    .filter(Boolean).join('_');

  const moduleCodes: Record<string, string | string[] | null> = {};
  if (selections.character) moduleCodes.character = selections.character;
  if (selections.scene) moduleCodes.scene = selections.scene;
  if (selections.emotion) moduleCodes.emotion = selections.emotion;
  if (selections.props?.length) moduleCodes.props = selections.props;
  if (selections.camera) moduleCodes.camera = selections.camera;
  if (selections.lighting) moduleCodes.lighting = selections.lighting;
  if (selections.conflict) moduleCodes.conflict = selections.conflict;
  if (selections.music) moduleCodes.music = selections.music;
  if (selections.sfx) moduleCodes.sfx = selections.sfx;
  if (selections.ambient) moduleCodes.ambient = selections.ambient;
  if (selections.negative_prompt?.length) moduleCodes.negative_prompt = selections.negative_prompt;
  if (selections.generation_params) moduleCodes.generation_params = selections.generation_params;
  if (selections.sequence?.length) moduleCodes.sequence = selections.sequence;
  if (selections.background) moduleCodes.background = selections.background;

  return {
    title,
    full_prompt: promptText,
    negative_prompt: negativePromptText,
    template: templateId,
    parameters: {
      aspect_ratio: modules.generation_params?.aspect_ratio as string || null,
      duration: modules.generation_params?.duration as string || null,
      seed: modules.generation_params?.seed as number || null,
      fps: modules.generation_params?.fps as number || null,
      style: modules.generation_params?.style as string || null,
    },
    layers: { lighting, composition },
    metadata: {
      module_count: Object.keys(moduleCodes).length,
      character: modules.character?.name || null,
      scene: modules.scene?.name || null,
      emotion: modules.emotion?.name || null,
      lighting: modules.lighting?.name || null,
      props: modules.props?.map(p => p.name) || [],
      music: modules.music?.name || null,
      sfx: modules.sfx?.name || null,
      ambient: modules.ambient?.name || null,
      negative_prompt: modules.negative_prompt?.map(p => p.name) || [],
      generation_params: modules.generation_params?.name || null,
      sequence: modules.sequence?.map(p => p.name) || [],
      background: modules.background?.name || null,
      conflict: modules.conflict?.name || null,
      template: templateId,
    },
    module_codes: moduleCodes,
  };
}