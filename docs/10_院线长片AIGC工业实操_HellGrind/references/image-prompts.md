# 生图提示词模板

在这套流程里，生图承担三个职责，**写法完全不同**，不要混用：

| 用途 | 产出 | 用哪种模型 |
|---|---|---|
| **A. 设定稿** | 角色/道具/场景的多视图参考图，全片复用 | 文生图（imagegen / seedream / soul） |
| **B. 关键帧** | 每个镜头的首帧，喂给视频模型 | 文生图 或 图生图 |
| **C. 精修** | 改错字、修细节、换元素、灰模预演 | 图像编辑（nano banana 等） |

Hell Grind 的比例：视频 12,554 条，生图 1,600+ 条——**生图主要是为视频服务的**。

---

## A. 设定稿：多视图法

一次生成多个角度，得到全片可复用的参考图。语料原文：

```
A studio photograph of a custom-built black cargo van featuring a clean, angular
body design, a black finish, and no brand logos. The van has a modern, aggressive
look achieved through the sharp geometric lines of the panels, deep body contours,
narrow angular headlights, recessed door handles, and wide black wheels with
low-profile tires
Frame 1: Front view, straight-on
Frame 2: Three-quarter front view, 45° angle
Frame 3: Rear view, straight-on
Solid neutral gray background (#808080), realistic natural shadow cast onto the
ground, soft directional studio lighting from the upper left, barely noticeable
reflections on the body panels, realistic paint texture. Photography style:
automotive press kit, shot on a Canon EOS R5 with an 85mm lens, f/8, ISO 200.
No CGI effects, no rendering artifacts, photojournalistic realism, ultra-sharp details.
```

### 拆解成模板

```
A studio photograph of [对象], featuring [形态特征1], [形态特征2], [材质/颜色].
[整体气质] achieved through [具体设计细节列举].

Frame 1: [视角1]
Frame 2: [视角2]
Frame 3: [视角3]

Solid neutral gray background (#808080), realistic natural shadow cast onto the
ground, soft directional studio lighting from the upper left, realistic texture.
Photography style: [参考摄影类型], shot on a [相机] with a [镜头], f/[光圈], ISO [值].
No CGI effects, no rendering artifacts, photojournalistic realism, ultra-sharp details.
```

### 关键要素

| 要素 | 为什么 |
|---|---|
| `Solid neutral gray background (#808080)` | 中性灰背景，**方便后续抠图和当参考** |
| `Frame 1/2/3:` 多视图 | 一张图给出多角度，视频模型认人更稳 |
| 相机 + 镜头 + 光圈 + ISO | 报具体参数比写"高质量"有效得多 |
| `No CGI effects, no rendering artifacts` | 挡掉 3D 渲染感 |

### 角色设定稿视角组合（推荐）

```
Frame 1: Full body, front view, straight-on, neutral A-pose
Frame 2: Full body, three-quarter view, 45° angle
Frame 3: Full body, side profile
Frame 4: Head and shoulders close-up, front, neutral expression
```

### 场景设定稿视角组合

```
Frame 1: Wide establishing view from the main entrance
Frame 2: Reverse angle from the opposite end
Frame 3: Detail view of [关键锚点物件]
```

---

## B. 关键帧：把分镜表的一行变成一张图

关键帧提示词 = **视频提示词去掉运动和台词**。结构：

```
[影像质量总纲 —— 与视频版一致，删掉 Acting/Physics/Audio 三行]

[身份锚点：本帧出现的角色和场景]

[画面内容：谁在哪、在做什么、什么表情]

[镜头：景别 + 焦段 + 机位角度 + 景深]

[灯光：光从哪来、什么质感、有无补光]

[负面清单]
```

### 模板

```
Style: 8K IMAX. Photorealistic — no 3D render, no game engine.
Cinematography: Emmanuel Lubezki × Roger Deakins.
Film stock: 35mm Kodak Vision3 250D, anamorphic glass, real organic film grain.
Color: 60:30:10 — dominant / secondary / accent.
Skin: Pore-level realism — vellus hair, asymmetric moles, capillary flush.
Composition: Rule of thirds + golden ratio.

CHARACTERS:
<<<image_1>>> = [角色代号] — [完整锚点]. Lock: face + [记号] + [记号].

ENVIRONMENT:
<<<image_2>>> — [场景锚点]. Anchors: [可数固定物]. [色调]. [空气].

FRAME: [谁] stands [在哪个分区], [身体朝向], [表情/状态].
[其他角色] [位置关系], [距离].

CAMERA: [景别] [焦段], [机位角度], [景深 f/x].
LIGHTING: [光源] from [方向], [质感]. [有无补光].

NEGATIVES: NO 3D render look, NO game engine look, NO CG plastic sheen,
NO plastic skin, NO waxy faces, NO deformed hands, NO extra fingers,
NO text, NO watermark, NO identity drift.
```

### 关键帧要注意的三件事

1. **首帧要留出运动余地**。如果这个镜头要推近，首帧就构得松一点。
2. **表情要给中间态**。首帧给"惊恐的顶点"，视频就没得演了；给"开始察觉"。
3. **尺寸对齐视频**。视频出 21:9 就生 21:9 的图，不要生完再裁——裁会破坏构图。

---

## C. 精修：图像编辑

图像编辑的核心原则：**先声明"什么不许变"，再说"改哪里"**。

### 精准局部改写（语料原文结构）

```
Make two precise edits to this image while preserving everything else exactly as
is — same lighting, same rainy night atmosphere, same camera angle, same wear and
grime on the building, same reflections on the wet asphalt.

Edit 1 — [改动名称]: [具体怎么改].
Keep the exact same [字体/颜色/间距/位置/磨损程度]. The new [元素] must look like
it has been there for years — same level of fading and weathering as the original.
Do not change [周边元素1], [周边元素2], or [周边元素3].

Edit 2 — [改动名称]: [具体怎么改].
Keep them in the exact same positions, same number, same size, same slight tilt,
same color, and same lighting on them — but [具体修改].
```

**要点**：
- 开头一整句列举"保持不变"的东西，越具体越好
- 每个改动单独编号 `Edit 1 — / Edit 2 —`
- 每个改动后面跟一串 `Keep the exact same ...` 和 `Do not change ...`
- 修复模糊文字时描述**想要的最终状态**（"像刚打印在白纸上的粗黑无衬线体"）

### 灰模预演 previz（导演看构图用，非常实用）

把已有的写实图转成无材质灰模，用来检查构图和光线：

```
Edit this image. Convert this photographic shot into a SIMPLE LIT 3D CLAY RENDER
PREVIEW in the style of an untextured Unreal Engine viewport. The composition
stays exactly the same, all geometry stays exactly the same, only the appearance
is converted from photoreal textured to untextured grey clay shaded geometry.

THE LOOK:
- Convert all surfaces to a uniform matte grey clay material — same flat neutral
  grey shading on everything (walls, floor, columns, characters, props)
- NO textures, NO patterns, NO wood grain, NO fabric pattern, NO color of any kind,
  NO writing on any surface, all surface detail removed
- Geometry edges remain visible and crisp showing the form of each object
- Characters become smooth grey clay figures — same poses, same positions, same
  proportions, but featureless clay, no face detail, no skin tone
- Matte throughout, no specular highlights, no reflections

THE LIGHTING:
- Preserve the exact lighting setup — same light sources, same direction, same
  intensity, same shadows

THE COMPOSITION:
- Same camera angle, same framing, same aspect ratio, same depth of field
- Same positions of all elements

NOT photorealistic, NOT colorful, NOT textured, NOT cartoon, NOT toy.
```

**用途**：构图有问题时，灰模能让你一眼看出来（不被材质和光效干扰）。

---

## 生图参数（Hell Grind 实际用值）

| 模型 | 分辨率 | 宽高比 | batch | 备注 |
|---|---|---|---|---|
| `nano_banana_2` | 4k（5504×3072 / 6336×2688） | 16:9 主用，21:9 次之 | **4** | 图像编辑主力，1024 次 |
| `gpt_image_2` | 4k（3840×1648） | 21:9 | — | quality `high` |
| `imagegen_2_0` | 4k（3840×2160） | 16:9 | — | quality `high` |
| `soul_cinematic` | 2048×1152 | — | **4** | `enhance_prompt: true` |
| `seedream_v4_5 / v5` | 2560×1440 | 16:9 | 1 | 带 seed，可复现 |

> **batch_size 一律设 4**：一次出 4 张挑最好的，这是语料里的默认做法。
> **带 seed 的模型记下 seed 值**：同一个 seed + 微调提示词 = 可控迭代。

---

## 新手最容易犯的三个错

1. **跳过设定稿直接生关键帧** → 每个镜头的人都不一样。必须先做设定稿。
2. **关键帧和视频用不同宽高比** → 图生视频时会被裁切，构图全毁。
3. **一张图想解决所有问题** → 设定稿、关键帧、精修是三件事，分开做。
