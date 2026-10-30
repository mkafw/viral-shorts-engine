# 02 角色资产与防变脸板 (Character Model Sheet)

> **定位**：角色形象设定、四视图锁脸、去除 AI 大众脸与塑料感、微表情与待机感消除。  
> **知识来源**：`091-角色-两招去掉AI大众脸`、`090-角色-解决人物空洞待机感`、`020-七种表情控制`、`DeepSeek - 角色建模参考板规格`、`缔造肌肤完美质感：数码人像摄影`。

---

## 一、角色四视图工业级锁脸规格板 (4-View Model Sheet)

在任何生图/生视频模型中，单张正脸图作为参考必然变脸。必须使用**白底/灰底无杂物四视图**建立角色资产。

### 1.1 四视图标准提示词模板
```plaintext
[角色中文名/代号], [年龄]岁亚洲[男性/女性], [具体五官特征，如：单眼皮冷冽眼眸，高挺鼻梁，唇角微下垂], [发型发色，如：利落微卷黑色齐肩短发], [标志性服装，如：深灰剪裁羊毛西装搭配高领黑毛衣], 
4-view character model sheet: front view, side profile view, three-quarter view, back view. 
Neutral white background, full body standing pose, consistent character design, cinematic studio portrait lighting, 8k resolution, raw photo quality, highly detailed skin pores, no AI plastic smoothing, photorealistic.
```

### 1.2 锁脸三大铁律
1. **绝对不要换发型**：短剧换一个镜头换发型，AI 会直接识别为全新角色。
2. **锁死物理特征标签（Anchor Token）**：如“右眼角泪痣”、“下巴浅凹坑”、“左耳银色耳骨夹”。这些特征能强行拉住 AI 的注意力权重。
3. **命名强绑定**：资产库命名必须纯粹固定为 `[角色名]`（如 `{@陆辰}`），全局所有镜头引用严禁随意添加别名。

---

## 二、消除 AI 大众脸：双参考图重构法

如果你只给自然语言描述，AI 会默认调用训练集权重最高的一眼假“网红脸/模板脸”。

### 2.1 双参考图融合法
- **参考图 A（骨相与皮肤肌理）**：选择一张皮肤通透、有真实毛孔、骨骼清晰但长相普通的素人摄影图，权重用于锁定真实质感；
- **参考图 B（五官比例与神态）**：选择符合角色气质的特征图（如阴鸷冷峻、坚毅执拗）；
- **操作逻辑**：在图像生成器中将图 A（权重 0.4）与图 B（权重 0.6）融合，提示词加上真实相机参数（如 `Leica M11, Summilux 50mm f/1.4, subtle film grain`），彻底剥离 AI 蜡像感。

---

## 三、消除人物“空洞待机感”与微表情控制

很多 AI 视频人物像 NPC 站桩待机，眼神空洞无神。核心原因是**提示词缺乏动作动机和时间轴触发词**。

### 3.1 时间词触发器（时间轴驱动微动作）
在视频提示词中，禁用静态描述（“他很生气”），必须使用时间轴动态词：
- `0.0s - 1.5s`：目光先低垂看向手中的文件，呼吸起伏；
- `1.5s - 3.0s`：睫毛颤动，眼神骤然向上抬起锁定镜头，瞳孔微微紧缩；
- `3.0s - 5.0s`：喉结吞咽，嘴角勾起一丝不易察觉的冷笑。

### 3.2 反向表演法（Reverse Acting）
- 想要表现“极度愤怒”，不要让角色张牙舞爪，而是写：**“他极力压制呼吸，双手下垂死死攥紧拳头指节泛白，脸上却带着礼貌而僵硬的微笑”**。
- 想要表现“极度恐惧”，不要大叫，而是写：**“他身体僵立不动，只有后颈的细小寒毛竖起，冷汗顺着下颌线缓缓滴落”**。

---

## 四、七种微表情控制词库

| 情绪类型 | 核心物理指引（给视频模型的 Prompt 词组） |
| :--- | :--- |
| **压抑轻蔑** | `Subtle asymmetric smirk, head slightly tilted up, looking down through eyelids, relaxed jaw` |
| **惊愕强忍** | `Brief widening of pupils, sudden shallow breath, throat swallow motion, frozen facial tension` |
| **绝望麻木** | `Dull unfocused gaze, slightly parted dry lips, micro eyelid droop, complete absence of micro-expression` |
| **算计隐忍** | `Eyes darting sideways then returning, tongue touching upper teeth behind closed lips, tight jawline` |
| **濒死虚弱** | `Rapid shallow chest heave, fluttering heavy eyelids, sweat on temples, subtle head tremor` |
| **冷酷决绝** | `Completely still eyebrows, slow deliberate single blink, sharp direct eye contact, unblinking focus` |
| **痛极反笑** | `Bitter ironic chuckle, squinted eyes with a single tear forced out, teeth slightly clenched` |
