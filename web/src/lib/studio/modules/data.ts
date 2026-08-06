/**
 * 电影模块系统 — 数据定义
 *
 * 从 CloudFlare-ImgBed prompt-tool 移植
 * 所有模块类型、实例、模板、组合规则由数据驱动
 */

// ==================== 模块类型定义 ====================
export interface ModuleSchemaField {
  label: string;
  type: 'string' | 'text' | 'tags' | 'number';
  optional?: boolean;
}

export interface ModuleTypeDef {
  type: string;
  label: string;
  icon: string;
  required: boolean;
  multiple?: boolean;
  schema: Record<string, ModuleSchemaField>;
  tags: string[];
}

export const MODULE_TYPES: ModuleTypeDef[] = [
  {
    type: 'Character',
    label: '人物',
    icon: '👤',
    required: true,
    schema: {
      name: { label: '名称', type: 'string' },
      appearance: { label: '外貌', type: 'text' },
      clothing: { label: '服装', type: 'text' },
      personality: { label: '性格', type: 'tags' },
      catchphrase: { label: '口头禅', type: 'string', optional: true },
      laugh: { label: '笑声', type: 'string', optional: true },
      speech_style: { label: '说话风格', type: 'string', optional: true },
      tone_quality: { label: '音质', type: 'string', optional: true },
    },
    tags: ['主角', '配角', '男', '女'],
  },
  {
    type: 'Scene',
    label: '场景',
    icon: '🏙️',
    required: true,
    schema: {
      name: { label: '名称', type: 'string' },
      location: { label: '具体位置', type: 'string' },
      lighting: { label: '光照', type: 'text', optional: true },
      atmosphere: { label: '氛围', type: 'text' },
      color_scheme: { label: '色调', type: 'string', optional: true },
    },
    tags: ['室内', '户外', '现代', '古代', '白天', '夜晚'],
  },
  {
    type: 'Emotion',
    label: '情绪',
    icon: '😊',
    required: false,
    schema: {
      name: { label: '名称', type: 'string' },
      mood: { label: '情绪类型', type: 'string' },
      description: { label: '描述', type: 'text' },
      expression_desc: { label: '表情描述', type: 'text' },
      atmosphere_desc: { label: '氛围描述', type: 'text' },
      lighting_match: { label: '匹配光影', type: 'string' },
      intensity: { label: '强度', type: 'number', optional: true },
    },
    tags: ['正面', '负面', '高冷', '激烈', '忧郁', '温情'],
  },
  {
    type: 'Prop',
    label: '道具',
    icon: '🎯',
    required: false,
    multiple: true,
    schema: {
      name: { label: '名称', type: 'string' },
      description: { label: '描述', type: 'text' },
      appearance: { label: '外观', type: 'text', optional: true },
      usage_desc: { label: '使用方式', type: 'text', optional: true },
      kind: { label: '类型', type: 'string', optional: true },
    },
    tags: ['酒具', '办公', '笑声', '标志', '口头禅', '电子', '通讯'],
  },
  {
    type: 'Camera',
    label: '运镜',
    icon: '🎬',
    required: false,
    schema: {
      name: { label: '名称', type: 'string' },
      shot_size: { label: '景别', type: 'string' },
      movement: { label: '运动', type: 'string' },
      angle: { label: '角度', type: 'string' },
      lens_type: { label: '镜头类型', type: 'string', optional: true },
      focus_effect: { label: '焦点效果', type: 'string', optional: true },
      composition: { label: '构图', type: 'string', optional: true },
    },
    tags: ['远景', '中景', '近景', '特写', '固定', '跟拍', '仰拍', '俯拍', '平视', '鱼眼', '长焦', '变形宽银幕', '广角', '微距', '浅景深', '焦段切换', '移轴', '柔焦', '三分法', '引导线', '负空间', '对称', '画中画'],
  },
  {
    type: 'Lighting',
    label: '光影',
    icon: '💡',
    required: false,
    schema: {
      name: { label: '名称', type: 'string' },
      light_type: { label: '光线类型', type: 'string' },
      color_temp: { label: '色温', type: 'string' },
      intensity: { label: '强度', type: 'string' },
      direction: { label: '方向', type: 'string', optional: true },
      effect: { label: '特效', type: 'string', optional: true },
    },
    tags: ['自然光', '人工光', '暖色调', '冷色调', '高对比', '柔光', '逆光', '侧光', '体积光'],
  },
  {
    type: 'Conflict',
    label: '冲突',
    icon: '⚡',
    required: false,
    schema: {
      name: { label: '名称', type: 'string' },
      kind: { label: '类型', type: 'string' },
      intensity: { label: '强度', type: 'number', optional: true },
      description: { label: '描述', type: 'text' },
    },
    tags: ['面子', '利益', '信念', '生死'],
  },
  {
    type: 'Music',
    label: '音乐',
    icon: '🎵',
    required: false,
    schema: {
      name: { label: '名称', type: 'string' },
      genre: { label: '风格', type: 'string' },
      mood: { label: '情绪', type: 'string' },
      tempo: { label: '速度', type: 'string' },
      instruments: { label: '乐器', type: 'tags' },
      volume: { label: '音量', type: 'string', optional: true },
      dynamics: { label: '动态', type: 'string', optional: true },
      texture: { label: '织体', type: 'string', optional: true },
    },
    tags: ['悬疑', '紧张', '温情', '冷峻', '悲伤', '激昂'],
  },
  {
    type: 'SFX',
    label: '音效',
    icon: '🔊',
    required: false,
    schema: {
      name: { label: '名称', type: 'string' },
      kind: { label: '类型', type: 'string' },
      description: { label: '描述', type: 'text' },
      intensity: { label: '强度', type: 'string', optional: true },
      timing: { label: '时机', type: 'string', optional: true },
    },
    tags: ['脚步声', '关门声', '玻璃破碎', '警报', '枪声', '爆炸', '电流', '按键'],
  },
  {
    type: 'NegativePrompt',
    label: '排除项',
    icon: '🚫',
    required: false,
    multiple: true,
    schema: {
      name: { label: '名称', type: 'string' },
      target: { label: '排除对象', type: 'string' },
      severity: { label: '程度', type: 'string', optional: true },
      description: { label: '描述', type: 'text', optional: true },
    },
    tags: ['模糊', '噪点', '变形', '多余人物', '文字', '水印', '低质量', '过度平滑', '伪影'],
  },
  {
    type: 'GenerationParams',
    label: '生成参数',
    icon: '⚙️',
    required: false,
    schema: {
      name: { label: '名称', type: 'string' },
      aspect_ratio: { label: '宽高比', type: 'string' },
      duration: { label: '时长', type: 'string', optional: true },
      seed: { label: '种子', type: 'number', optional: true },
      fps: { label: '帧率', type: 'number', optional: true },
      style: { label: '风格', type: 'string', optional: true },
    },
    tags: ['16:9', '9:16', '4:3', '1:1', '电影宽屏', '24fps', '30fps', '写实', '动画'],
  },
  {
    type: 'Sequence',
    label: '序列',
    icon: '⏳',
    required: false,
    multiple: true,
    schema: {
      name: { label: '名称', type: 'string' },
      order: { label: '顺序', type: 'number' },
      action: { label: '动作', type: 'text' },
      character_ref: { label: '角色', type: 'string', optional: true },
      emotion_ref: { label: '情绪', type: 'string', optional: true },
      duration: { label: '持续', type: 'string', optional: true },
    },
    tags: ['入场', '转身', '对话', '冲突', '对峙', '离开', '动作', '静止'],
  },
  {
    type: 'Ambient',
    label: '环境音',
    icon: '🌊',
    required: false,
    schema: {
      name: { label: '名称', type: 'string' },
      kind: { label: '类型', type: 'string' },
      description: { label: '描述', type: 'text' },
      density: { label: '密度', type: 'string', optional: true },
      reverb: { label: '混响', type: 'string', optional: true },
    },
    tags: ['雨声', '风声', '交通', '人群', '脚步', '机器', '空调', '鸟鸣'],
  },
  {
    type: 'Background',
    label: '背景',
    icon: '🌄',
    required: true,
    schema: {
      name: { label: '名称', type: 'string' },
      world_desc: { label: '世界观', type: 'text' },
      era: { label: '时代', type: 'string' },
      weather: { label: '天气', type: 'string' },
      time_of_day: { label: '时间', type: 'string', optional: true },
    },
    tags: ['都市', '古典', '赛博朋克', '末日', '江南', '奇幻'],
  },
];

// ==================== 模块实例数据 ====================
export interface ModuleInstance {
  code: string;
  name: string;
  [key: string]: unknown;
}

export const MODULE_INSTANCES: Record<string, ModuleInstance[]> = {
  Character: [
    { code: 'C01', name: '总裁', appearance: '35岁，身高185cm，五官棱角分明，眼神锐利', clothing: '深灰色定制西装，白色衬衫，袖口金色纽扣', personality: ['冷峻', '果断', '高傲'], catchphrase: '你还不配', laugh: '呵，呵...', speech_style: '冷峻简短，字字如刀', tone_quality: '低沉有磁性', tags: ['主角', '男', '霸道'] },
    { code: 'C02', name: '秘书', appearance: '28岁，气质温婉，面容精致', clothing: '白色职业套装，黑色细跟高跟鞋', personality: ['细心', '隐忍', '忠诚'], catchphrase: '好的', laugh: '', speech_style: '温柔克制，语气恭敬', tone_quality: '轻柔', tags: ['配角', '女', '助理'] },
    { code: 'C03', name: '保安', appearance: '40岁，身材魁梧，面色黝黑', clothing: '黑色保安制服', personality: ['忠厚', '老实', '固执'], catchphrase: '报告', laugh: '嘿嘿', speech_style: '直率朴实', tone_quality: '粗犷', tags: ['配角', '男', '底层'] },
  ],
  Scene: [
    { code: 'S01', name: '顶楼办公室', location: '顶楼落地窗前', lighting: '黄昏，逆光，暖金色光线洒入', atmosphere: '压抑，寂静，空气中弥漫着紧张', color_scheme: '暖金+暗影', tags: ['室内', '现代', '高层'] },
    { code: 'S02', name: '地下停车场', location: '昏暗的地下停车场角落', lighting: '冷白色荧光灯，忽明忽暗', atmosphere: '阴冷，空旷，回声清晰', color_scheme: '冷白+暗灰', tags: ['室内', '现代', '车库'] },
    { code: 'S03', name: '总裁家客厅', location: '客厅落地窗前', lighting: '深夜，暖色台灯，窗外城市灯火', atmosphere: '安静，孤独，私密', color_scheme: '暖黄+深蓝', tags: ['室内', '家', '夜晚'] },
  ],
  Emotion: [
    { code: 'E01', name: '冷漠', mood: 'Cold', description: '冷漠无情，拒人千里', expression_desc: '表情冷漠，目光如冰，嘴角微抿', atmosphere_desc: '气氛降至冰点，空气凝滞', lighting_match: '冷灰色，低对比度，偏暗', intensity: 8, tags: ['负面', '高冷'] },
    { code: 'E02', name: '愤怒', mood: 'Anger', description: '愤怒爆发', expression_desc: '眉头紧锁，目光锋利如刀，额角青筋微现', atmosphere_desc: '火药味弥漫，一触即发', lighting_match: '暗红色，高对比度，压抑', intensity: 9, tags: ['负面', '激烈'] },
    { code: 'E03', name: '悲伤', mood: 'Sadness', description: '悲伤压抑', expression_desc: '眼眶泛红，嘴唇微微颤抖', atmosphere_desc: '压抑的沉默，只能听见呼吸声', lighting_match: '蓝灰色，低对比度，昏暗', intensity: 7, tags: ['负面', '忧郁'] },
    { code: 'E04', name: '温柔', mood: 'Tender', description: '温柔深情', expression_desc: '目光柔和，嘴角带着浅笑', atmosphere_desc: '温暖，安宁，时光静好', lighting_match: '暖橙色，低饱和度，柔和', intensity: 5, tags: ['正面', '温情'] },
  ],
  Prop: [
    { code: 'P01', name: '威士忌杯', description: '总裁常用的水晶威士忌杯', appearance: '厚底水晶杯，琥珀色酒液', usage_desc: '修长的手指捏着杯壁，轻轻晃动，冰块碰撞发出清脆声响', kind: 'Physical', tags: ['酒具', '办公'] },
    { code: 'P02', name: '冷笑', description: '总裁标志性的冷笑', appearance: '', usage_desc: '', kind: 'Laugh', tags: ['笑声', '标志'] },
    { code: 'P03', name: '你还不配', description: '总裁的口头禅', appearance: '', usage_desc: '', kind: 'Catchphrase', tags: ['口头禅', '标志'] },
    { code: 'P04', name: '手机', description: '手机', appearance: '黑色金属机身', usage_desc: '手指在屏幕上快速滑动', kind: 'Physical', tags: ['电子', '通讯'] },
  ],
  Camera: [
    { code: 'M01', name: '标准中景', shot_size: '中景', movement: '固定', angle: '平视', tags: ['中景', '固定', '平视'] },
    { code: 'M02', name: '仰拍近景', shot_size: '近景', movement: '固定', angle: '仰拍', tags: ['近景', '固定', '仰拍'] },
    { code: 'M03', name: '特写', shot_size: '特写', movement: '缓慢推进', angle: '平视', tags: ['特写', '推进', '平视'] },
    { code: 'M04', name: '鱼眼广角', shot_size: '全景', movement: '固定', angle: '平视', lens_type: '鱼眼镜头', focus_effect: '', composition: '引导线', tags: ['全景', '固定', '平视', '鱼眼'] },
    { code: 'M05', name: '浅景深特写', shot_size: '特写', movement: '固定', angle: '平视', lens_type: '长焦镜头', focus_effect: '浅景深', composition: '三分法', tags: ['特写', '固定', '平视', '长焦', '浅景深'] },
    { code: 'M06', name: '移轴俯拍', shot_size: '全景', movement: '固定', angle: '俯拍', lens_type: '移轴镜头', focus_effect: '移轴效果', composition: '负空间', tags: ['全景', '固定', '俯拍', '移轴'] },
    { code: 'M07', name: '手持跟拍', shot_size: '中景', movement: '手持跟拍', angle: '平视', lens_type: '广角镜头', focus_effect: '', composition: '画中画', tags: ['中景', '跟拍', '平视', '广角'] },
    { code: 'M08', name: '变形宽银幕', shot_size: '远景', movement: '平移', angle: '平视', lens_type: '变形宽银幕', focus_effect: '柔焦', composition: '三分法', tags: ['远景', '平移', '平视', '变形宽银幕'] },
    { code: 'M09', name: '焦段推进', shot_size: '中景→特写', movement: '缓慢推进', angle: '平视', lens_type: '变焦镜头', focus_effect: '焦段切换', composition: '三分法', tags: ['中景', '特写', '推进', '变焦'] },
  ],
  Lighting: [
    { code: 'L01', name: '金色黄昏', light_type: '逆光', color_temp: '暖金色', intensity: '柔', direction: '逆光', effect: '黄昏光晕', tags: ['自然光', '暖色调', '逆光', '黄昏'] },
    { code: 'L02', name: '冷色荧光', light_type: '顶光', color_temp: '冷白色', intensity: '强', direction: '顶光', effect: '忽明忽暗', tags: ['人工光', '冷色调', '高对比', '顶光'] },
    { code: 'L03', name: '霓虹夜色', light_type: '混合', color_temp: '冷色+暖色', intensity: '中', direction: '多光源', effect: '霓虹光晕', tags: ['人工光', '混合', '多光源', '霓虹'] },
    { code: 'L04', name: '柔和晨光', light_type: '侧光', color_temp: '暖白色', intensity: '柔', direction: '侧光', effect: '体积光', tags: ['自然光', '暖色调', '柔光', '侧光'] },
    { code: 'L05', name: '戏剧剪影', light_type: '逆光', color_temp: '暖色', intensity: '强', direction: '逆光', effect: '剪影', tags: ['人工光', '暖色调', '高对比', '逆光'] },
    { code: 'L06', name: '月光冷色', light_type: '主光', color_temp: '冷蓝色', intensity: '弱', direction: '顶光', effect: '月光', tags: ['自然光', '冷色调', '弱光', '夜景'] },
    { code: 'L07', name: '烛光暖意', light_type: '主光', color_temp: '暖橙色', intensity: '弱', direction: '底光', effect: '闪烁', tags: ['人工光', '暖色调', '弱光', '底光'] },
    { code: 'L08', name: '体积光束', light_type: '侧光', color_temp: '暖白色', intensity: '中', direction: '侧光', effect: '体积光', tags: ['人工光', '暖色调', '体积光', '侧光'] },
  ],
  Conflict: [
    { code: 'CF01', name: '当众被驳', kind: 'Face', intensity: 7, description: '在下属面前被当众驳斥，面子尽失', tags: ['面子', '职场'] },
    { code: 'CF02', name: '合同被抢', kind: 'Interest', intensity: 8, description: '即将到手的合同被竞争对手截胡', tags: ['利益', '商战'] },
    { code: 'CF03', name: '真相崩塌', kind: 'Belief', intensity: 9, description: '深信不疑的信念被事实击碎', tags: ['信念', '反转'] },
  ],
  Music: [
    { code: 'MU01', name: '悬疑低音', genre: '暗潮', mood: '悬疑', tempo: '慢板', instruments: ['大提琴', '低音提琴'], volume: '中', dynamics: '平稳', texture: '单音', tags: ['悬疑', '紧张'] },
    { code: 'MU02', name: '紧张鼓点', genre: '电子', mood: '紧张', tempo: '快板', instruments: ['电子鼓', '合成器'], volume: '高', dynamics: '渐强', texture: '复调', tags: ['紧张', '激烈'] },
    { code: 'MU03', name: '温情钢琴', genre: '古典', mood: '温情', tempo: '行板', instruments: ['钢琴'], volume: '低', dynamics: '渐弱', texture: '和弦', tags: ['温情', '治愈'] },
    { code: 'MU04', name: '冷峻电子', genre: '电子', mood: '冷峻', tempo: '中板', instruments: ['合成器', '贝斯'], volume: '中', dynamics: '平稳', texture: '环境', tags: ['冷峻', '科技'] },
    { code: 'MU05', name: '悲伤大提琴', genre: '古典', mood: '悲伤', tempo: '慢板', instruments: ['大提琴'], volume: '低', dynamics: '渐弱', texture: '单音', tags: ['悲伤', '忧郁'] },
  ],
  NegativePrompt: [
    { code: 'NP01', name: '去模糊', target: '模糊', severity: '完全避免', description: '避免任何运动模糊或失焦', tags: ['模糊'] },
    { code: 'NP02', name: '去噪点', target: '噪点', severity: '完全避免', description: '避免高ISO噪点或颗粒感', tags: ['噪点'] },
    { code: 'NP03', name: '去畸形', target: '变形', severity: '完全避免', description: '避免人物面部或肢体畸形', tags: ['变形'] },
    { code: 'NP04', name: '去多余人物', target: '多余人物', severity: '完全避免', description: '背景中不应出现无关人物', tags: ['多余人物'] },
    { code: 'NP05', name: '去水印', target: '水印', severity: '完全避免', description: '画面上不应出现文字或水印', tags: ['水印', '文字'] },
    { code: 'NP06', name: '高质量优先', target: '低质量', severity: '完全避免', description: '避免低分辨率、压缩伪影或过度平滑', tags: ['低质量', '过度平滑', '伪影'] },
  ],
  Sequence: [
    { code: 'SEQ01', name: '总裁入场', order: 1, action: '推开办公室大门，大步走进房间', character_ref: 'C01', emotion_ref: 'E01', duration: '3秒', tags: ['入场', '动作'] },
    { code: 'SEQ02', name: '对峙', order: 2, action: '停下脚步，冷冷注视着对方', character_ref: 'C01', emotion_ref: 'E01', duration: '5秒', tags: ['对峙', '静止'] },
    { code: 'SEQ03', name: '爆发', order: 3, action: '猛拍桌子，文件散落一地', character_ref: 'C01', emotion_ref: 'E02', duration: '2秒', tags: ['冲突', '动作'] },
    { code: 'SEQ04', name: '转身离开', order: 4, action: '转身，大步走向门口，头也不回', character_ref: 'C01', emotion_ref: 'E03', duration: '4秒', tags: ['离开', '动作'] },
    { code: 'SEQ05', name: '秘书敲门', order: 1, action: '轻轻敲门，在门外等待回应', character_ref: 'C02', emotion_ref: '', duration: '3秒', tags: ['入场', '动作'] },
    { code: 'SEQ06', name: '轻声汇报', order: 2, action: '推门进入，轻声汇报工作', character_ref: 'C02', emotion_ref: 'E04', duration: '8秒', tags: ['对话', '动作'] },
  ],
  GenerationParams: [
    { code: 'GP01', name: '标准横屏', aspect_ratio: '16:9', duration: '10s', seed: 42, fps: 24, style: '写实', tags: ['16:9', '24fps', '写实'] },
    { code: 'GP02', name: '竖屏短视频', aspect_ratio: '9:16', duration: '15s', seed: 42, fps: 30, style: '写实', tags: ['9:16', '30fps', '写实'] },
    { code: 'GP03', name: '电影宽屏', aspect_ratio: '2.35:1', duration: '30s', seed: 42, fps: 24, style: '电影', tags: ['电影宽屏', '24fps', '电影'] },
    { code: 'GP04', name: '正方形', aspect_ratio: '1:1', duration: '5s', seed: 42, fps: 24, style: '动画', tags: ['1:1', '24fps', '动画'] },
  ],
  SFX: [
    { code: 'SFX01', name: '玻璃破碎', kind: '冲击', description: '水晶杯碎裂的清脆声响，碎片四溅', intensity: '强', timing: '同步', tags: ['玻璃破碎', '冲击'] },
    { code: 'SFX02', name: '沉重关门', kind: '动作', description: '厚重的实木门被用力关上，回荡在走廊', intensity: '强', timing: '同步', tags: ['关门声', '动作'] },
    { code: 'SFX03', name: '高跟鞋', kind: '动作', description: '高跟鞋敲击大理石地面的声音，节奏稳定', intensity: '中', timing: '持续', tags: ['脚步声', '动作'] },
    { code: 'SFX04', name: '警报声', kind: '信号', description: '尖锐的警报声由远及近', intensity: '逐渐增强', timing: '延迟', tags: ['警报', '信号'] },
    { code: 'SFX05', name: '电流嗡鸣', kind: '电子', description: '低频电流的嗡鸣声，带着轻微的失真', intensity: '弱', timing: '持续', tags: ['电流', '电子'] },
    { code: 'SFX06', name: '按键声', kind: '动作', description: '机械键盘清脆的按键声', intensity: '弱', timing: '持续', tags: ['按键', '动作'] },
  ],
  Ambient: [
    { code: 'AMB01', name: '雨夜街景', kind: '自然', description: '细雨落在柏油路面上的沙沙声，远处偶尔传来汽车驶过积水的声音', density: '间歇', reverb: '大空间', tags: ['雨声', '自然', '夜晚'] },
    { code: 'AMB02', name: '办公室安静', kind: '室内', description: '中央空调的低频嗡鸣，远处打印机工作的声音，偶尔的键盘敲击', density: '稀疏', reverb: '小空间', tags: ['室内', '机器', '空调'] },
    { code: 'AMB03', name: '繁华街道', kind: '城市', description: '人群嘈杂的交谈声，汽车喇叭声，脚步声混杂', density: '密集', reverb: '大空间', tags: ['交通', '人群', '城市'] },
    { code: 'AMB04', name: '空旷回廊', kind: '室内', description: '空旷走廊中的脚步声回荡，远处隐约的水滴声', density: '稀疏', reverb: '回声', tags: ['室内', '声音', '回声'] },
    { code: 'AMB05', name: '森林清晨', kind: '自然', description: '鸟鸣声，风吹树叶的沙沙声，远处溪流声', density: '间歇', reverb: '大空间', tags: ['鸟鸣', '自然', '清晨'] },
  ],
  Background: [
    { code: 'B01', name: '都市夜景', world_desc: '繁华都市，霓虹闪烁，车水马龙', era: '现代', weather: '晴朗', time_of_day: '夜晚', tags: ['都市', '现代', '夜晚'] },
    { code: 'B02', name: '古典庄园', world_desc: '欧式古典庄园，绿树成荫，喷泉花园', era: '19世纪', weather: '晴朗', time_of_day: '午后', tags: ['古典', '欧洲'] },
    { code: 'B03', name: '赛博朋克街道', world_desc: '霓虹灯牌，全息广告，雨夜潮湿的街道', era: '未来', weather: '雨', time_of_day: '夜晚', tags: ['赛博朋克', '未来'] },
    { code: 'B04', name: '末日废墟', world_desc: '废弃的城市，残垣断壁，灰暗的天空', era: '末世', weather: '阴霾', time_of_day: '黄昏', tags: ['末日', '荒凉'] },
    { code: 'B05', name: '江南水乡', world_desc: '小桥流水，青石板路，白墙黛瓦', era: '古代', weather: '微雨', time_of_day: '清晨', tags: ['江南', '古典'] },
  ],
};

// ==================== 组合规则 ====================
export const COMBINATION_RULES: Record<string, { rule: string; template: string; optional?: boolean }> = {
  'Character+Scene':  { rule: 'concat', template: '{character}在{scene}' },
  'Character+Emotion':  { rule: 'transform', template: '{character}，{emotion}表情' },
  'Character+Prop':  { rule: 'concat', template: '{character}，{prop}', optional: true },
  'Character+Conflict':  { rule: 'tension', template: '{character}陷入{conflict}' },
  'Scene+Emotion':  { rule: 'atmosphere', template: '{scene}，{emotion}氛围' },
  'Scene+Prop':  { rule: 'concat', template: '{scene}，{prop}' },
  'Scene+Camera':  { rule: 'frame', template: '{camera}拍摄{scene}' },
  'Emotion+Prop':  { rule: 'context', template: '{emotion}情绪下，{prop}' },
  'Emotion+Conflict':  { rule: 'amplify', template: '{emotion}中{conflict}加剧' },
  'Prop+Camera':  { rule: 'focus', template: '{camera}聚焦{prop}' },
  'Emotion+Lighting':  { rule: 'map', template: '{emotion}→{lighting}' },
  'Character+Lighting':  { rule: 'illuminate', template: '{lighting}照亮{character}' },
  'Scene+Lighting':      { rule: 'set', template: '{scene}，{lighting}光线' },
  'Lighting+Prop':       { rule: 'highlight', template: '{lighting}下，{prop}' },
  'Lighting+Music':      { rule: 'mood', template: '{lighting}光影，{music}回响' },
  'Lighting+Camera':     { rule: 'style', template: '{camera}，{lighting}' },
  'Conflict+Scene':  { rule: 'tension', template: '{conflict}发生在{scene}' },
  'Character+Background':  { rule: 'match', template: '{character}在{background}' },
  'Background+Scene':  { rule: 'embed', template: '{background}中的{scene}' },
  'Scene+Music':  { rule: 'soundscape', template: '{scene}，{music}响起' },
  'Emotion+Music':  { rule: 'resonate', template: '{emotion}情绪下，{music}衬托' },
  'Background+Music':  { rule: 'ambient', template: '{background}，{music}弥漫' },
  'Character+SFX':     { rule: 'action', template: '{character}，{sfx}音效' },
  'Scene+SFX':         { rule: 'ambient', template: '{scene}，{sfx}响起' },
  'SFX+Conflict':      { rule: 'impact', template: '{sfx}强调了{conflict}' },
  'Emotion+SFX':       { rule: 'accent', template: '{emotion}中，{sfx}' },
  'Character+Ambient': { rule: 'environment', template: '{character}身处{ambient}中' },
  'Scene+Ambient':     { rule: 'soundscape', template: '{scene}，{ambient}' },
  'Conflict+Ambient':  { rule: 'tension', template: '{ambient}中，{conflict}一触即发' },
  'SFX+Ambient':       { rule: 'layer', template: '{ambient}之上，{sfx}' },
  'NegativePrompt+Character': { rule: 'exclude', template: '{character}不应出现{negative_prompt}' },
  'NegativePrompt+Scene':    { rule: 'avoid', template: '{scene}中避免{negative_prompt}' },
  'NegativePrompt+Prop':     { rule: 'no', template: '不应出现{negative_prompt}类型的{prop}' },
  'GenerationParams+Scene':  { rule: 'format', template: '{generation_params}格式的{scene}' },
  'Sequence+Character':  { rule: 'act', template: '{character}进行{sequence}' },
  'Sequence+Scene':      { rule: 'stage', template: '{scene}中，{sequence}' },
  'Sequence+Emotion':    { rule: 'transform', template: '{sequence}，情绪转为{emotion}' },
  'Sequence+Conflict':   { rule: 'crescendo', template: '{sequence}，{conflict}升级' },
  'Sequence+Camera':     { rule: 'follow', template: '{camera}跟拍{sequence}' },
  'Camera+Character': { rule: 'focus', template: '{camera}聚焦{character}' },
  'Camera+Background': { rule: 'establish', template: '{camera}展示{background}' },
  'Camera+Scene': { rule: 'frame', template: '{camera}框住{scene}' },
};

// ==================== 模板系统 ====================
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  slots: string[];
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'default',
    name: '标准模板',
    description: '人物+场景+情绪+光影+道具的标准组合',
    slots: [
      'character.appearance', 'character.clothing', 'character.personality',
      'scene.location', 'lighting.full', 'scene.lighting', 'scene.atmosphere',
      'emotion.expression_desc', 'emotion.atmosphere_desc',
      'prop.usage_desc', 'camera.full',
    ],
  },
  {
    id: 'story',
    name: '叙事模板',
    description: '适合有冲突的情节叙述',
    slots: [
      'character.name', 'conflict.description', 'scene.atmosphere',
      'emotion.expression_desc', 'prop.usage_desc', 'camera.full',
    ],
  },
  {
    id: 'full',
    name: '完整模板',
    description: '含背景、人物、音乐、场景的完整描述',
    slots: [
      'background.world_desc', 'character.appearance', 'character.clothing',
      'scene.location', 'scene.lighting', 'scene.atmosphere',
      'emotion.expression_desc', 'music.genre', 'music.instruments',
      'prop.usage_desc', 'camera.full',
    ],
  },
  {
    id: 'cinematic',
    name: '电影模板',
    description: '含完整镜头语言、音乐、光影的电影级描述',
    slots: [
      'background.world_desc', 'character.appearance', 'character.clothing',
      'scene.location', 'camera.full', 'lighting.full',
      'scene.atmosphere', 'emotion.expression_desc',
      'music.genre', 'music.instruments', 'prop.usage_desc',
    ],
  },
  {
    id: 'lighting',
    name: '光影模板',
    description: '光线优先的戏剧化描述',
    slots: [
      'character.appearance', 'character.clothing', 'scene.location',
      'lighting.full', 'scene.atmosphere', 'emotion.expression_desc', 'camera.full',
    ],
  },
  {
    id: 'audio',
    name: '声音模板',
    description: '含音效、环境音、音乐的完整声音描述',
    slots: [
      'scene.atmosphere', 'ambient.full', 'sfx.full',
      'music.genre', 'music.instruments', 'music.dynamics', 'emotion.expression_desc',
    ],
  },
  {
    id: 'production',
    name: '生产模板',
    description: '含生成参数、排除项、完整模块的生产级描述',
    slots: [
      'generation_params.full', 'background.world_desc', 'character.appearance', 'character.clothing',
      'scene.location', 'lighting.full', 'scene.atmosphere', 'ambient.full', 'sfx.full',
      'emotion.expression_desc', 'music.genre', 'music.instruments',
      'prop.usage_desc', 'camera.full', 'negative_prompt.full',
    ],
  },
  {
    id: 'narrative',
    name: '叙事模板',
    description: '含序列动作的叙事性提示词',
    slots: [
      'background.world_desc', 'character.appearance', 'character.clothing',
      'scene.location', 'lighting.full', 'scene.atmosphere',
      'sequence.full', 'emotion.expression_desc', 'sfx.full', 'ambient.full',
      'music.genre', 'music.instruments', 'camera.full',
    ],
  },
];

// ==================== 光影映射表 ====================
export const EMOTION_LIGHTING: Record<string, { lighting: string; composition: string; camera: string; lighting_ref: string }> = {
  'Cold':   { lighting: '冷灰色，低对比度，偏暗', composition: '平视，中景', camera: 'M01', lighting_ref: 'L02' },
  'Anger':  { lighting: '暗红色，高对比度，压抑', composition: '仰拍，近景', camera: 'M02', lighting_ref: 'L05' },
  'Sadness': { lighting: '蓝灰色，低对比度，昏暗', composition: '侧拍，中景', camera: 'M01', lighting_ref: 'L06' },
  'Tender': { lighting: '暖橙色，低饱和度，柔和', composition: '近景特写', camera: 'M03', lighting_ref: 'L04' },
};