# 卡片：短剧动作打斗分镜与打击感构建
来源：prompt-cards/AI 短剧打斗总僵硬？这 24 组提示词直接抄.pdf · books/cinematography/世界著名导演的镜头语言
适用：打斗分镜 | 近身肉搏 | 兵器交锋 | 动作打击感

## 可执行规则

### 1. 动作防僵硬三段论（动作 + 发力链 + 镜头机位）
打斗不能写抽象的“两人激烈交手”，每组动作必须拆解为三层：
1. **动作节点（起承转合）**：必须写清起点、中间轨迹（直线/斜线/弧线）、收势归位。刀剑必有“出鞘、劈砍、收刀”，拳脚必有“沉步、击打、受击反馈”。
2. **发力链（Force Chain）**：只写两头！起点在脚底/胯部，落点在拳锋/刀刃/枪尖。中间绝不堆砌无意义修饰词。
3. **镜头分配（机位伴随）**：
   - 蓄力/出招瞬间：贴近关节与兵器特写；
   - 击中瞬间：切受击侧中近景 + 画面微震（Camera Shake）；
   - 兵器收势：退至侧前方全景或定格手部。

### 2. 兵器与空间原则
- **长兵器（枪/棍/刀戟）**：重点展示“长度与扫掠纵深”。枪拍直线贯穿，棍拍低机位贴地弧线（扫起飞尘为免费动效）。
- **短兵与暗器**：拍飞行轨迹与视线交错，暗器必须写明飞行方向与交错次数。
- **近身擒拿肉搏**：必须写死手部抓握的具体落点（手腕、咽喉、衣领）与身体重心倾斜方向，避免模型生成跳交谊舞。

---

## 提示词片段（可粘贴）

### 常用核心打斗招式

#### 1. 居合拔刀斩（拔刀-横切-回鞘）
- **动作**：左手拇指顶开刀柄，膝盖下沉半寸，身形前欺，刀刃沿鞘口水平横抽出刀，弧线削击，斩落顺势甩血推刀入鞘。
- **发力**：膝沉踏步，力量从脚底过胯甩至手腕，出刀瞬间右臂完全绷直。
- **镜头**：极近景紧贴刀鞘口拍摄出鞘反光半秒 → 刀光划过瞬间硬切对手侧向受力后仰 → 镜头回切至收刀手部微特写。
- **Prompt (EN)**：extreme close-up on katana hilt, quick draw slash along horizontal line, sudden hard cut to opponent staggering back, camera returns to close-up on hand resheathing blade, cinematic action blur, sharp rim light.

#### 2. 长兵贴地横扫（低机位烟尘破空）
- **动作**：双手握持棍尾，棍身紧贴青石地面平扫半周，尘土激荡扬起，横扫破风后收棍竖立于胸前。
- **发力**：前手为轴，后手借腰力下压暴拧，棍风呈扇面推出。
- **镜头**：贴地超低仰角跟拍长棍扫地激起的尘浪，收棍时机位顺势上抬定格在面部冷峻神情。
- **Prompt (EN)**：ultra-low angle ground shot following quarterstaff sweeping across stone ground, dust and pebbles kicked up dynamically, camera tilts up quickly as fighter locks weapon vertically, high dynamic motion.

#### 3. 拳拳到肉贴身重击（爆发与受击反馈）
- **动作**：左手刁擒对手手腕下压破坏重心，右拳自腰间如冲锤击打对手肋部，对手身体弯曲后滑半米。
- **发力**：右脚蹬地拧转，后背肌肉隆起，短距寸劲爆发，打击后拳面下压定格。
- **镜头**：过肩近景锁定抓腕扭转 → 击中肋部瞬间摄影机剧烈单帧震动（micro-shake）并喷溅微小汗水粒子。
- **Prompt (EN)**：over-the-shoulder medium close-up, fighter grabs opponent wrist pulling down, delivers heavy compact right hook into ribs, subtle camera micro-shake on impact, sweat droplets flying, authentic physical impact.

---

## 禁忌
- 严禁缺失收势（动作断在半空导致前后分镜不接）。
- 严禁仅写双方名字对打而没有明确攻防判定（如“A与B大战三百回合”）。
- 严禁忽略受击反馈（击中后被攻击者若无后仰、踉跄、飞溅或防御僵直，画面必显假）。
