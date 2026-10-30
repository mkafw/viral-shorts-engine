# 镜头语言速查表（中英对照）

写提示词时**一律用英文术语**（模型训练语料以英文为主，中文术语命中率低）。
本表左列是你脑子里想的中文，右列是应该写进提示词的英文。

---

## 1. 景别 Shot Size —— 决定"观众离角色多近"

| 中文 | 英文（写进提示词） | 画面内容 | 什么时候用 |
|---|---|---|---|
| 大远景 | `extreme wide shot` / `establishing shot` | 人只占画面一小块，环境为主 | 每场戏开头，交代地点 |
| 远景 | `wide shot` (WS) | 人全身 + 大量环境 | 交代人物与空间关系 |
| 全景 | `full shot` | 人全身顶天立地 | 展示动作、服装、姿态 |
| 中景 | `medium shot` (MS) | 腰部以上 | 对话戏的默认景别 |
| 中近景 | `medium close-up` (MCU) | 胸部以上 | 对话中情绪加强 |
| 近景 | `close-up` (CU) | 头肩 | 情绪高点、重要台词 |
| 特写 | `extreme close-up` (ECU) | 只有眼睛/嘴/手/物件 | 极端情绪、关键细节 |
| 双人镜头 | `two-shot` | 画面里两个人 | 对话建立关系 |
| 过肩镜头 | `over-the-shoulder` (OTS) | 从A的肩后拍B | 对话正反打 |
| 主观镜头 | `POV shot` | 角色眼睛看到的 | 代入感、恐怖片 |
| 插入镜头 | `insert shot` | 手部动作、道具特写 | 强调细节 |

> **新手最容易犯的错**：整场戏全用中景。正确做法是**景别要跳**——远景交代 → 中景对话 → 近景情绪爆点 → 特写落点。

---

## 2. 焦段 Lens —— 决定"画面的空间感和情绪"

| 焦段 | 英文写法 | 视觉效果 | 情绪含义 |
|---|---|---|---|
| 广角 | `18mm` / `24mm` | 空间被拉大，边缘变形，纵深夸张 | 压迫、混乱、孤独、宏大 |
| 微广 | `35mm` | 接近人眼稍宽，环境与人兼顾 | 纪实感、真实 |
| 标准 | `50mm` | 最接近人眼，无变形 | 中性、客观、默认选择 |
| 中长 | `85mm` | 背景虚化明显，人物被"抽离"出环境 | 亲密、聚焦情绪，**对话近景首选** |
| 长焦 | `135mm` / `200mm` | 空间被压缩，前后景挤在一起 | 窥视感、疏离、紧张 |

**实用组合**：交代空间用 `24-35mm` 广角，对话两人用 `50mm`，情绪近景切 `85mm`。这就是 Hell Grind 里反复出现的写法。

---

## 3. 运镜 Camera Movement —— 决定"镜头怎么动"

### 位移类（机器整体移动）

| 中文 | 英文 | 效果 |
|---|---|---|
| 推镜 | `slow push-in` / `dolly in` | 逼近角色，情绪收紧。**最好用的运镜** |
| 拉镜 | `pull-out` / `dolly out` | 抽离，揭示环境，常用于结尾 |
| 横移 | `dolly left` / `truck right` | 平行跟随，优雅 |
| 跟拍 | `tracking shot` / `follow shot` | 跟着角色走，代入感 |
| 环绕 | `orbit` / `arc shot` | 绕角色转圈，仪式感、力量感 |
| 升降 | `crane up` / `crane down` / `jib` | 上帝视角切入或抽离 |

### 转动类（机器不动，镜头转）

| 中文 | 英文 | 效果 |
|---|---|---|
| 摇镜 | `pan left` / `pan right` | 水平扫视，交代空间 |
| 俯仰 | `tilt up` / `tilt down` | 垂直扫视，展示高度 |
| 甩镜 | `whip pan` | 极快摇镜，转场/暴力感 |

### 特殊

| 中文 | 英文 | 效果 |
|---|---|---|
| 固定 | `static shot` / `locked-off` | 完全不动。**紧张对峙时比乱动更有力** |
| 手持 | `handheld` | 轻微晃动，纪实、慌乱 |
| 稳定器 | `steadicam` / `gimbal` | 平滑移动，长镜头 |
| 变焦 | `snap zoom` / `slow zoom` | 突然拉近，冲击感 |
| 移焦 | `rack focus` / `focus pull` | 焦点从A转到B，转移注意力 |
| 荷兰角 | `dutch angle` | 画面倾斜，失衡、疯狂 |

> **关键**：给 AI 写运镜要**量化**。不要写 "push in"，写 `slow push-in 3% over 6 seconds`。
> 不写幅度，模型会给你一个失控的猛推。

---

## 4. 机位角度 Camera Angle

| 中文 | 英文 | 心理效果 |
|---|---|---|
| 平视 | `eye level` | 平等、客观 |
| 仰拍 | `low angle` | 角色显得强大、威胁 |
| 俯拍 | `high angle` | 角色显得弱小、被压制 |
| 顶拍 | `top-down` / `overhead` / `bird's-eye` | 上帝视角、宿命感 |
| 贴地 | `ground level` / `worm's-eye` | 压迫、异样 |

---

## 5. 灯光 Lighting —— 决定"画面的质感和情绪"

| 中文 | 英文 | 效果 |
|---|---|---|
| 逆光 | `contre-jour` / `backlight` | 轮廓发光，人物成剪影，**高级感最强** |
| 轮廓光 | `rim light` | 勾边，人物从背景中脱出 |
| 主光 | `key light` | 主要照明方向 |
| 补光 | `fill light` | 减弱阴影。写 `no ambient fill` 会让画面对比强烈、更电影感 |
| 实用光源 | `practical light` | 画面内可见的灯（台灯、霓虹、火） |
| 动机光 | `motivated lighting` | 光有合理来源，最真实 |
| 硬光 | `hard light` | 阴影边缘锐利，硬朗、危险 |
| 柔光 | `soft light` | 阴影柔和，温柔、梦幻 |
| 高调 | `high-key` | 整体亮，明快 |
| 低调 | `low-key` | 整体暗，悬疑、压抑 |
| 明暗对照 | `chiaroscuro` | 极端明暗，油画感 |
| 黄金时刻 | `golden hour` | 日出日落暖光，最讨好 |
| 蓝调时刻 | `blue hour` | 日落后冷蓝，忧郁 |
| 体积光 | `volumetric light` / `god rays` | 光柱可见，神圣/尘埃感 |
| 雾霾 | `atmospheric haze` | 空气有颗粒，纵深层次 |

---

## 6. 时间与速度

| 中文 | 英文 | 备注 |
|---|---|---|
| 正常速度 | `real-time` / `normal speed` | **必须显式声明**，否则模型爱给慢动作 |
| 慢动作 | `slow motion` | 只在真正需要时用 |
| 变速 | `speed ramp` | 从正常突然变慢 |
| 快门角度 | `180° shutter motion blur` | 电影标准运动模糊，写上更像电影 |
| 帧率 | `24fps` | 电影感；`60fps` 会像监控/手机 |

---

## 7. 构图

| 中文 | 英文 |
|---|---|
| 三分法 | `rule of thirds` |
| 黄金比例 | `golden ratio` |
| 对称构图 | `symmetrical composition` |
| 中心构图 | `centered composition` |
| 前景遮挡 | `foreground occlusion` / `shooting through` |
| 框中框 | `frame within a frame` |
| 引导线 | `leading lines` |
| 留白 | `negative space` |

---

## 8. 一句话组装公式

把上面拼起来就是一条合格的镜头描述：

```
[景别] [焦段], [机位角度], [运镜 + 量化幅度].
Lighting: [光线类型] from [光源方向/来源].
```

**例**：
```
Medium close-up 85mm, eye level, slow push-in 3% over 6 seconds.
Lighting: contre-jour backlight from window, camera on shadow side, no ambient fill.
```

对应中文就是：「85mm 中近景，平视，6 秒内缓慢推近 3%。窗户逆光，摄影机在暗面，不补光。」

---

## 9. Hell Grind 实测高频词（14,553 条语料统计）

不知道该用什么时，优先用高频的——它们是被 90 分钟成片验证过的：

| 词 | 出现次数 | 说明 |
|---|---|---|
| `handheld` | 33,053 | 手持是这部片的主基调 |
| `silhouette` | 24,758 | 剪影，配合逆光 |
| `haze` | 22,196 | 空气雾霾，几乎每镜都有 |
| `close-up` | 19,504 | |
| `35mm` | 11,387 | **最常用焦段** |
| `static` | 10,889 | 固定镜头比想象中用得多 |
| `ECU`（extreme close-up） | 10,398 | |
| `practical`（实用光源） | 9,953 | |
| `85mm` | 9,722 | 情绪近景 |
| `50mm` | 9,046 | 对话 |
| `establishing` | 7,933 | |
| `slow motion` | 7,263 | |
| `180° shutter` | 6,434 | |
| `contre-jour` / `backlight` | 5,635 / 5,601 | 逆光 |
| `push-in` | 5,034 | |
| `low-key` | 4,913 | 低调布光 |
| `dolly` | 4,499 | |
| `orbit` | 3,803 | |
| `low angle` | 3,697 | |
| `dutch` | 3,395 | 荷兰角 |
| `neon` | 3,550 | |
| `locked-off` | 2,930 | |
| `rim light` | 2,444 | |
| `chiaroscuro` | 2,388 | |
| `24mm` | 2,574 | 广角交代 |
| `100mm` | 2,292 | |
| `volumetric` | 2,188 | 体积光 |

**读出来的风格倾向**：手持 + 逆光剪影 + 雾霾 + 低调布光 + 35/50/85 三档焦段。
这套组合是"看起来像电影"的最短路径。

---

## 10. 新手速用组合包

不知道用什么的时候，直接抄：

| 场景类型 | 直接复制 |
|---|---|
| 开场交代地点 | `Extreme wide establishing shot 24mm, slow crane down. Atmospheric haze. Golden hour backlight.` |
| 两人对话 | `Medium two-shot 50mm, static. CUT — alternating medium close-ups 85mm, slow push-in 3% on the speaker.` |
| 情绪爆发 | `Close-up 85mm, static, no camera movement. Low-key lighting, hard key from one side, no ambient fill.` |
| 紧张对峙 | `Medium shot 50mm, locked-off static. Rim light only. Deep shadow.` |
| 角色登场 | `Low angle full shot 35mm, slow push-in. Contre-jour backlight, rim light on silhouette.` |
| 追逐/混乱 | `Handheld tracking shot 35mm, following subject. Real-time, no slow motion.` |
| 揭示真相 | `Slow pull-out from close-up to wide, 50mm. Rack focus from foreground to background.` |
| 结尾收束 | `Slow crane up to high angle wide shot 35mm. Character small in frame. Negative space.` |
