# 生视频提示词模板

结构提炼自 Hell Grind（90 分钟 AI 长片）14,553 条真实生成记录。
主力模型 seedance 2.0，21:9 / 1080p / 6–15 秒每镜。提示词平均长度 **1.1 万字符**——
是的，一个镜头的提示词就有一千多词，这就是成片质量和随手一句话的差距。

---

## 完整骨架（八段式）

```
[1 影像质量总纲]     ← 全片复用，一字不改（复用率最高的 12 行）
[2 参考/身份锚点]     ← 本镜出现的角色和场景
[3 场景上下文]        ← 这一刻在发生什么、角色在想什么
[4 空间布局]          ← 谁在哪个分区、朝向、距离
[5 表演与台词]        ← 身体指令 + 台词
[6 镜头与灯光]        ← 景别焦段运镜 + 光锚点
[7 硬锁 HARD LOCK]   ← 禁止模型自由发挥的地方
[8 负面清单 NEGATIVES] ← 明确不要什么
```

前 6 段决定"生成什么"，7、8 段决定"**不许**生成什么"。
**新手 90% 的失败都是漏掉 7、8 段。**

---

## 第 1 段：影像质量总纲（直接复制，全片不变）

这 12 行在语料里各自复用了 **1500–2800 次**，是全片每条提示词的开头：

```
Style: 8K IMAX. Photorealistic — no 3D render, no game engine, no game-cutscene aesthetic.
Cinematography: Emmanuel Lubezki × Roger Deakins.
Lighting: Natural light only — contre-jour backlight, camera on shadow side, atmospheric haze throughout. Key light from sky and windows only.
Color: 60:30:10 — dominant / secondary / accent.
Camera: Physical cine lens. 180° shutter motion blur.
Skin: Pore-level realism — vellus hair, asymmetric moles, capillary flush, pore-shadow matching on-set light.
Acting: Hollywood — micro-pauses before reactions, precise eye-line, wet living eyes with catch-lights, visible breath and chest rise.
Physics: Gravity and inertia respected — mass has real weight, correct contact shadows. No floating props.
Composition: Rule of thirds + golden ratio. Every person moving from frame one.
Continuity: Characters, props, environment identical across every cut. No identity drift.
Technical: 24fps smooth motion. 8K detail. No jitter.
Audio: Environmental SFX only. No music. No subtitles.
```

**逐行解释（为什么每一行都不能删）**：

| 行 | 治什么病 |
|---|---|
| `Photorealistic — no 3D render, no game engine, no game-cutscene aesthetic` | 挡掉"游戏 CG 塑料感"，AI 默认最爱出这个 |
| `Cinematography: Emmanuel Lubezki × Roger Deakins` | **报摄影指导的名字**。比写十句"要有电影感"管用。见下方替换表 |
| `Lighting: Natural light only — contre-jour...` | 统一全片光线逻辑。`camera on shadow side`（机位在暗面）是高级感的来源 |
| `Color: 60:30:10` | 配色比例法则，防止画面花 |
| `180° shutter motion blur` | 电影标准运动模糊，缺了就像手机拍的 |
| `Skin: Pore-level realism...` | **专治 AI 塑料脸**：汗毛、不对称的痣、毛细血管血色 |
| `Acting: Hollywood — micro-pauses...` | 专治木偶感。`wet living eyes with catch-lights`（湿润的、有眼神光的活眼睛）是关键 |
| `Physics: Gravity and inertia respected` | 防止道具漂浮、脚不沾地 |
| `Composition: ... Every person moving from frame one` | 防止第一帧所有人定格 |
| `Continuity: ... No identity drift` | 显式声明不许变人 |
| `Technical: 24fps ... No jitter` | 防抖动 |
| `Audio: Environmental SFX only. No music. No subtitles.` | **必写**。不写会随机配乐 + 烧死字幕，后期完全没法剪 |

### 摄影风格替换表（改 `Cinematography:` 那一行）

| 你要的感觉 | 写谁 |
|---|---|
| 自然光、长镜头、飘逸 | `Emmanuel Lubezki` |
| 极简构图、硬光、冷峻 | `Roger Deakins` |
| 高饱和、对称、童话感 | `Wes Anderson` |
| 阴郁写实、手持、街头 | `Darius Khondji` |
| 霓虹赛博、强色彩 | `Blade Runner 2049 look` |
| 战争纪实、手持 | `Janusz Kamiński` |
| 东方留白、静止长镜 | `Christopher Doyle` / `Mark Lee Ping-bing` |

### 胶片质感行（可选，加在总纲后）

语料高频写法：

```
Film stock and look: 35mm Kodak Vision3 250D, anamorphic glass, real organic film grain, photochemical render. 24fps.
```

| 写法 | 效果 |
|---|---|
| `16mm Kodak 500T` | 颗粒粗、复古、纪实、低照度 |
| `35mm Kodak Vision3 500T` | 标准电影夜戏 |
| `35mm Kodak Vision3 250D` | 标准电影日戏，色彩干净 |
| `anamorphic glass` | 变形宽银幕，椭圆光斑、横向蓝色炫光 |
| `ARRI cine lenses` | 中性、现代高端 |

### 极简格式行（短片可用，替代整块总纲）

```
Photoreal. NON-IP. 16:9. 10s. SFX only. NO CGI. Cinematic.
```

---

## 第 2 段：参考 / 身份锚点

见 `identity-anchors.md`。本镜出现谁就贴谁的锚点原文。语料里的标准写法：

```
[REFERENCES + IDENTITY ANCHORS]
<<<image_2>>> = ROKO — [完整外观描述]. Lock: face + [记号] + [记号] + [记号].
<<<image_3>>> = GANDELFINA — 40s, black trenchcoat, silver-streaked hair.

ENVIRONMENT:
<<<image_1>>> — [场景描述]. Anchors: [可数固定物], [可数固定物]. [色调]. [空气].
```

**关注点分离原则**（语料里出现 720 次的原句）：

```
Character appearance only - costume, identity, body type. Environment is supplied separately.
```

角色锚点里**只写人**，环境锚点里**只写景**。混在一起模型会串味。

---

## 第 3 段：场景上下文

一小段散文，交代**这一刻的处境和心理**。模型据此决定表演强度。

```
SCENE CONTEXT: Night, after the briefing. The others have gone to their rooms.
Roko walking fast along the corridor and meets Gandelfina near the door. He's
covered in injuries he hasn't treated. The only thing he's thinking about is
time. Every hour they wait is an hour Lulu is somewhere he can't reach.
```

**要点**：写**动机**，不只写动作。"他脑子里只有时间"比"他很着急"有效得多。

也可以用语料里的显式小标题：`WHAT THIS SCENE IS ABOUT:`（出现 442 次）。

---

## 第 4 段：空间布局

### 简版（两三个人）

```
SPATIAL: Roko going fast along the corridor then meets Gandelfina.
Gandelfina RIGHT, 3 meters away.
```

### 分区版（复杂场景，语料里的 ZONES 系统）

给场景划命名分区，整场戏所有镜头共用同一套分区名：

```
⚠️ ROOM ZONES (read from establishing camera looking into the home):
- BED ZONE (camera-LEFT foreground): raised platform with a messy unmade bed, dark grey duvet and pillows.
- WORKDESK ZONE (deep frame back-center): tech workdesk with two monitors (dark screens at night), ergonomic gaming chair. Unused during this scene.
- DOOR (back wall, between workdesk and right zone): a single white interior door — closed unless explicitly opened by a character in the current shot.
- GLASS WALLS (back-left and far-right): floor-to-ceiling glass partitions to a dim landscaped rocky garden, garden in shadow, no bright outdoor light.
```

**为什么值得这么写**：分区名一旦定下，后面每个镜头只要写"角色从 BED ZONE 走向 DOOR"，
模型就能保证空间一致。不这么做，同一个房间每个镜头的家具位置都会变。

**必须量化**：谁在画面左/右/中、相距几米、面朝哪。
不写空间关系 → 正反打完全不接。

---

## 第 5 段：表演与台词

格式：`角色 — 身体状态/表情/眼神: "台词"`

```
Roko — jaw tight, eyes direct, body braced against door: "When do we leave? We don't have time."
Gandelfina — brief glance at his injuries, then steady: "Recover first. And learn to control what you've got."
Roko — weight forward, not pleading, insisting: "I can't wait while she's dying down there."
Gandelfina — unblinking: "Don't worry. We'll do everything we can to bring her back."
```

**要点**：台词前那串**身体指令**（下颌绷紧 / 重心前倾 / 不眨眼）才是让表演可信的东西。
只给台词，模型会给你一个面瘫说话人。

**动作戏用大写强调动词**（语料写法）：

```
The skin over one bump on the belly THINS — turns lighter as it stretches to
breaking point — then a sharp white bone TIP pierces through — the skin TEARS
around it — peeling back like wet paper — the bone needle EMERGES.
```

大写的动词会被模型当成动作节拍点。**每条提示词大写强调不超过 5–8 处**。

---

## 第 6 段：镜头与灯光

```
Camera: medium two-shot 50mm, corridor walls tight on both sides.
CUT — alternating medium close-ups 85mm: slow push-in 3% on Roko's face; static on Gandelfina.
Style: sparse strip lights above — narrow top-down practical key on faces, deep shadow on sides. No ambient fill. All from environment.
```

**要点**：
- 一条提示词里可用 `CUT —` 描述**镜头内剪辑**（一次生成出两个机位），但**最多 2 刀**
- 推镜必须量化：`slow push-in 3%`，不量化模型会猛推
- 灯光要说明**光从哪来**：`from environment` / `practical` / `from sky and windows`
- 语料偏好：`Profile and 3/4 framings preferred over flat frontal CU.`（侧脸和 3/4 优于正面平拍）

### 光锚点 LIGHT ANCHOR（整场戏锁死光线，出现 584 次）

```
LIGHT ANCHOR (locked entire 15s):
Camera always on the shadow side of all subjects — characters are backlit,
faces in partial shadow, no front fill.
```

一场戏所有镜头共用同一个光锚点，这是"看起来像同一部片"的根本。

### 允许摄影师放飞（需要视觉冲击时加）

```
⚠️ OPERATOR'S CREATIVE FREEDOM — UNUSUAL CAMERA ANGLES ENCOURAGED:
- DUTCH ANGLES (world cocked sideways for disorientation, instability, dread)
- EXTREME LOW ANGLES (lens at ground level looking up, dwarfing figures against the sky)
- EXTREME HIGH ANGLES (overhead looking down, crushing the figures)
- ASYMMETRIC FRAMINGS (subject at extreme edge, massive negative space opposite)
- THROUGH-OBJECT FRAMINGS (shooting past dark out-of-focus foreground brush, shoulders)
```

---

## 第 7 段：硬锁 HARD LOCK（最关键）

语料里 `HARD LOCK` 出现 **4,194 次**。写法：`⚠️` + 全大写标题 + `(HARD LOCK)`。

### 速度锁——防止模型自作主张上慢动作
```
⚠️ REAL-TIME / NO SLOW MOTION (HARD LOCK):
Entire 6 seconds at REAL-TIME / NORMAL SPEED.
```

### 情绪锁——统一全体角色的情绪强度
```
⚠️ EMOTION LOCK (HARD LOCK):
All four characters show STRONG PANIC and TERROR throughout. Wide eyes, mouths
slightly open in alarm, brows furrowed, faces showing visible fear. Bodies tense
but motionless. Hollywood-naturalist prestige-drama acting at peak intensity.
```

### 静止锁——防止群演乱动抢戏
```
⚠️ STILLNESS LOCK (HARD LOCK):
All four characters STAND COMPLETELY STILL. NO movement, NO talking, NO head
turns, NO gestures. Only <<<image_2>>> performs explicit actions (described below).
```

### 动作锁——把角色动作限死成有序清单
```
⚠️ ROKO ACTIONS (HARD LOCK — REACTION + CROUCH ONLY):
<<<image_2>>> performs ONLY TWO things in sequence:
1. FEAR REACTION — expression shifts from tense panic to pronounced FEAR/SHOCK.
   Eyes widen, mouth opens in fearful gasp, brows raise. Fast and visible.
2. CROUCH DOWN — body drops into a sharp crouch. Fast panicked downward movement.
NO head turns. NO looking around. NO body rotation. NO other movements.
His head stays facing the same forward direction throughout.
```

### 机位/轴线锁——保证正反打不越轴
```
⚠️ AXIS LOCK (HARD LOCK — CRITICAL):
The camera in CUT 2 is positioned on <<<image_2>>>'s anatomical LEFT side.
NO line-crossing — the camera always views the action from the same consistent flank.
```

### 其他语料中的高频锁

| 锁名 | 用途 |
|---|---|
| `SCALE LOCK` | 锁死物体/角色相对大小，防止道具忽大忽小 |
| `DEPTH OF FIELD LOCK` | 锁死景深，防止虚实关系跳变 |
| `LENS LOCK` | 锁死焦段 |
| `FRAMING LOCK` | 锁死构图 |
| `STATE LOCK` | 锁死角色当前状态（受伤程度、衣服脏污） |
| `PHYSICS LOCK` | 锁死重量感（"车是重的，不是滑的"） |
| `WORLD LOCK` | 锁死世界观规则（如 `NO MAGIC LOCK`：本片没有魔法特效） |
| `DIALOGUE LOCK` | 锁死只有指定角色说话 |

### 硬锁写法要诀

1. **只锁真正会出问题的地方**，一条提示词 2–4 个锁即可；锁太多模型会整体崩
2. **用否定式排比**：`NO head turns. NO looking around. NO body rotation.` 比一句"保持不动"有效
3. **动作要编号**：`ONLY TWO things in sequence: 1. ... 2. ...`
4. **重复关键约束**：同一约束在提示词里出现两次是**有意为之**，不是冗余

---

## 第 8 段：负面清单 NEGATIVES

语料里 `NEGATIVES` 出现 1,309 次。写法是**具体、成串、大写 NO**：

```
NEGATIVES: NO music, NO score, NO slow-motion, NO speed ramps, NO cuts, NO edits,
NO fades, NO dissolves, NO mirror reflections, NO doubled characters, NO visible
crew, NO 3D render look, NO game engine look, NO CG plastic sheen, NO sun,
NO direct light, NO theatrical key, NO horizon line.
```

**要点**：不要写抽象的"不要难看"，要写**这个镜头具体会出现的错误**。
比如夜戏就把所有天光可能性全排掉：

```
no daylight, no sky color, no sunlight, no sunset, no sunrise, no dusk, no dawn,
no twilight, no magic hour, no golden hour, no blue hour, no orange sky, no warm
sky, no glowing sky, no horizon glow.
```

**通用负面清单（新手直接抄）**：

```
NEGATIVES: NO music, NO score, NO subtitles, NO text overlay, NO watermark,
NO slow-motion, NO speed ramps, NO extra cuts, NO 3D render look, NO game engine
look, NO CG plastic sheen, NO plastic skin, NO waxy faces, NO deformed hands,
NO bent limbs, NO extra fingers, NO floating props, NO identity drift,
NO visible crew, NO camera jitter.
```

### 参考影片法（定风格最快的手段）

```
References: Blade Runner 2049 LAPD precinct night scenes + Dune Atreides war room
+ The Matrix Zion command. Environment only.
```

**注意**：末尾的 `Environment only.` / `Character appearance only.` 很重要——
限定参考的是哪一方面，否则模型会把参考片的角色也搬进来。

---

## 收尾约束行

```
Constraints: avoid jitter and bent limbs. [角色]'s grief contained — no breakdown.
Push-in smooth and gradual. SFX only, no music, no subtitles.
```

---

## 生成参数（Hell Grind 实际用值，seedance 2.0）

| 参数 | 主用值 | 说明 |
|---|---|---|
| `aspect_ratio` | `21:9`（11156 次）/ `16:9`（1398 次） | 21:9 宽银幕电影感；竖屏短视频用 `9:16` |
| `resolution` | `1080p` | |
| `duration` | `15`（7804 次）/ `10` / `8` / `7` / `5` | 对话 5–8s，长动作 15s |
| `generate_audio` | `true`（99%） | 要环境音 |
| `prompt_language` | `en` | **提示词必须英文** |
| `mode` | `std` | |

> 一个镜头**跑 4 个版本**再挑是正常成本（`batch_size: 4` 是语料里的主流设置）。
> 一次就中的概率约 1/4。

---

## 常见问题 → 该加哪一段

| 生成出来的毛病 | 解法 |
|---|---|
| 莫名其妙变慢动作 | 速度锁 `REAL-TIME / NO SLOW MOTION (HARD LOCK)` |
| 角色一直转头东张西望 | 动作锁 + `NO head turns` 排比 |
| 背景群演乱动抢戏 | 静止锁 |
| 正反打不接、越轴 | 轴线锁 `NO line-crossing` |
| 同一房间家具位置乱变 | 第 4 段用 ZONES 分区 |
| 人物表情木讷 | 总纲 `Acting: Hollywood...` + 情绪锁 |
| 人脸变了 | 锚点 `Lock:` 行 + 总纲 `No identity drift` |
| 自动配乐/烧字幕 | 总纲 `Audio:` 行 + 负面清单 |
| 塑料脸 | 总纲 `Skin: Pore-level realism...` + 胶片质感行 |
| 手/肢体扭曲 | `Constraints: avoid jitter and bent limbs` |
| 镜头推得太猛 | 量化 `slow push-in 3%`、`smooth and gradual` |
| 画面像游戏 CG | `no 3D render, no game engine, no game-cutscene aesthetic` + 胶片行 |
| 光线每个镜头都不一样 | 第 6 段加 `LIGHT ANCHOR (locked entire scene)` |
