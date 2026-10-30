# 身份锚点：让同一个人在 100 个镜头里长得一样

这是整套方法**最值钱**的一环。AI 视频最大的失败不是画面难看，而是**第 3 个镜头和第 30 个镜头不是同一个人**。
解决办法不是"多写点形容词"，而是一套固定格式：**引用符 + 描述 + 显式锁定清单**。

以下格式提炼自 Hell Grind（90 分钟 AI 长片）实际使用的提示词。

---

## 1. 基本格式

### 角色锚点

```
<<<REF>>> — [性别/族裔] ~[年龄段], [身高/体型], [肤色].
[发型 —— 写细]. [面部记号].
[上装]. [下装]. [鞋]. [随身包/道具 + 挂件].
[伤痕/妆效].
Lock: [记号1] + [记号2] + [记号3] + [记号4].
```

**真实范例**（原文，可直接套用结构）：

```
<<<e92f3ea2-1332-4d0f-b95b-b99280a663f5>>> — man ~30s (~1.8m tall), mid-length
wet-disheveled black hair across forehead, faint upper-lip mustache, slim wiry
build, olive-tan skin. Multiple small bloodied cuts on face/shoulders/arms. Small
horizontal RED medical nose-tape across bridge of nose. Grey ribbed sleeveless
tank-top with blood spatter, dark crossbody sling-bag with diagonal strap, red
plush-bear keychain. RED COTTON WRIST WRAPS on both wrists. Dark crimson
distressed wide-leg jeans. White-grey low-top sneakers. Arm tattoos.
Lock: face + mustache + wet messy black hair + red nose-tape + tank-top +
sling-bag + red wrist wraps.
```

```
<<<2092a603-3c33-43af-adea-8d577d90a6bc>>> — woman ~20s, slim build, pale skin
with light freckles. Short dark brown chin-length bob with side-swept bangs.
Faint red scratch on right cheek. Black thick choker. Sleeveless blue denim
cropped halter top with orange waistband and black fishnet mesh at midriff.
Black canvas sling-bag with diagonal strap from left shoulder to right hip, blue
plush-bear keychain. Charcoal grey weathered baggy cargo pants. Black
fingerless gloves.
Lock: face + dark bob + choker + blue denim halter + orange waistband +
fishnet midriff + sling-bag.
```

### 场景锚点

```
<<<REF>>> — [空间类型 + 建筑风格 + 形状（大写强调）].
Anchors: [可数的固定物件1], [固定物件2], [固定物件3], [背景元素].
[色调]. [空气/氛围].
```

**真实范例**：

```
<<<59e83ebf-1a2b-...>>> — abandoned brutalist concrete OVAL/CIRCULAR rotunda hall.
Anchors: oval concrete tiled floor with debris (broken wooden chairs, dead trees
in planters, broken display cases with shattered glass), brutalist concrete walls,
distant out-of-focus doorways in BG, single central freestanding concrete column,
rounded mezzanine front wall overhead, two-level outer window wall.
Cool desaturated grey palette. Dust haze.
```

---

## 2. 四条铁律

### 铁律一：每个角色必须有 1 个"绝无仅有的视觉记号"

不是"黑头发"（满大街都是），而是：

- 鼻梁上一条**红色**医用胶布
- 书包上挂**红色**泰迪熊
- 银灰色在上、近黑色在下的**双色**波波头
- 双手腕上的**红棉布**腕带

模型抓住这个记号后，会顺带把整张脸也稳住。**没有怪记号的角色一定会漂。**

### 铁律二：`Lock:` 行必须写，且只列 4–7 项

`Lock:` 是给模型的显式优先级声明——"这几样不许变"。

- 少于 4 项：约束不够，会漂
- 多于 7 项：模型顾此失彼，反而全崩
- **第一项永远是 `face`**

### 铁律三：颜色词要用大写强调关键项

`RED medical nose-tape`、`RED COTTON WRIST WRAPS`、`OVAL/CIRCULAR rotunda`。
大写在这类模型里确实能提升该词权重。**但每条提示词里大写强调不超过 3 处**，全大写等于没强调。

### 铁律四：场景锚点要"可数"

写 `single central freestanding concrete column`（一根中央独立柱），
不写 `some columns`（几根柱子）——后者每次生成柱子数量都不同，剪起来完全不连戏。

同理：`two-level outer window wall`、`three broken display cases`。

---

## 3. 两种引用方言（按平台选）

| 方言 | 写法 | 适用 |
|---|---|---|
| **编号引用** | `<<<image_1>>>` `<<<image_2>>>` | 按你上传参考图的顺序对应。适合大多数图生视频平台 |
| **UUID 引用** | `<<<e92f3ea2-...>>>` | 平台有"参考元素库"功能时，锚点存成可复用资产 |
| **@命名** | `@ROKO` `@ROTUNDA` | 部分平台支持自定义命名，可读性最好 |

**编号引用的完整用法**：

```
CHARACTERS:
<<<image_2>>> = ROKO — [完整外观描述]. [性格与功能一句话].
<<<image_3>>> = GANDELFINA — 40s, black trenchcoat, silver-streaked hair.

ENVIRONMENT:
<<<image_1>>> — Narrow underground corridor, night. Sparse strip lights above.
Metal wall panels, heavy doors. Cold, utilitarian.
```

> 注意：**先环境后人物**还是**先人物后环境**都行，但**全片必须统一**。
> 编号和参考图的对应关系一旦定下，整部片子不要改。

---

## 4. 角色圣经模板（复制填空）

```markdown
### 角色代号：____

- 引用符：<<<image_N>>> / <<<uuid>>>
- 性别年龄体型：____
- 肤色：____
- 发型（写细，含长度/质感/走向）：____
- 面部记号（疤/痣/胡/贴布/雀斑）：____
- 独有视觉记号 ★：____
- 上装：____
- 下装：____
- 鞋：____
- 随身包 + 挂件：____
- 配饰（项圈/手套/腕带/纹身）：____
- 伤痕妆效（随剧情推进要更新）：____
- Lock: face + ____ + ____ + ____ + ____
- 性格/戏剧功能（一句话）：____
```

## 5. 场景圣经模板（复制填空）

```markdown
### 场景代号：____

- 引用符：<<<image_N>>> / <<<uuid>>>
- 空间类型 + 建筑风格 + 形状：____
- Anchors（3–6 个可数固定物）：____, ____, ____
- 背景元素：____
- 色调：____
- 空气/氛围（雾/尘/雨/烟）：____
- 光源（固定不变的光从哪来）：____
```

---

## 6. 随剧情更新锚点的正确做法

角色会受伤、换衣服、变脏。**不要重写整个锚点**，而是加一行状态覆盖：

```
<<<image_2>>> = ROKO — [原始锚点原文不动]
STATE (Scene 51+): fresh cut above left eyebrow, jacket torn at right shoulder,
soot on face. Everything else unchanged.
```

保持原文不动，是为了让**同一段文字在整片里反复出现**——重复本身就是稳定性的来源。
