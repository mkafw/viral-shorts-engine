# 卡片：AI 视频运镜万能公式与 50 组核心运镜库
来源：books/cinematography/准备分镜图 · prompt-cards/70套AI视频运镜提示词，我做成一套能复用的 skill.md
适用：分镜运镜 | 镜头调度 | 动态节奏 | 避免撞款

## 可执行规则

### 1. 运镜万能公式（6 要素）
```
Prompt = 镜头运动 + 摄影机角度 + 人物动作 + 环境变化 + 光影氛围 + 画面质感 [+ 反向提示词]
```
任何 AI 运镜如果没有写全这 6 要素，生成的画面就会退化为 PPT 幻灯片平移。

### 2. 镜头调度四大铁律
1. **情绪越强，镜头越近**：愤怒/流泪/震惊 → 特写 (Close-up) + 快速/缓慢推镜 (Push-in)。
2. **场面越大，机位越开**：战场/云海/宫殿/废墟 → 全景 (Wide/Aerial) + 升降 (Crane) + 俯冲 (Dive)。
3. **动作越快，镜头越有轨迹**：冲刺/挥剑/翻滚 → 镜头锁定运动轴线同向跟拍 (Tracking/Orbit)。
4. **同场硬切，跨场动切**：同一场景机位直接硬切；跨时空跨场景用穿越 (Fly-through)、甩镜 (Whip pan) 或叠化。

### 3. “视觉同源不撞款”轮换法则
整部短剧必须**锁死画风、光影、画面质感**，只轮换以下四个维度：
- **镜头运动**（推/拉/摇/移/升降/环绕/穿越）
- **机位角度**（平视/俯拍/仰拍/荷兰角/过肩/POV）
- **物理节奏**（慢推/快推/升格慢动作/子弹时间/瞬间冻结）
- **环境交互**（风动/雨幕/雪落/尘埃/火焰）

---

## 提示词片段（可粘贴）

### 常用核心运镜预设（中英双语）

#### A. 人物出场与情绪推进
- **缓慢推镜 (Slow Push-in)**：
  - 中文：镜头缓慢向前推进，平视靠近人物，突出微表情与情绪变化，浅景深虚化背景，电影级人物特写。
  - 英文：slow push-in to character, eye-level, shallow depth of field, subtle facial micro-expression, cinematic close-up, 4k, smooth motion.
  - 反向：static camera, no movement, wide shot, flat lighting.
- **环绕运镜 (Orbit Shot)**：
  - 中文：摄影机围绕人物 360 度缓慢环绕旋转，发丝与衣摆随风轻摆，展现人物气场与服饰细节。
  - 英文：slow 360 orbit around character, clothes and hair fluttering in the wind, powerful aura, dynamic lighting, 4k.
  - 反向：static front view, locked frame, no rotation.

#### B. 空间展开与大片开场
- **希区柯克变焦 (Dolly Zoom / Vertigo)**：
  - 中文：摄影机前推同时镜头焦段拉远，人物主体比例锁定稳定，背景急剧拉伸变形，呈现剧烈心理震颤与失衡感。
  - 英文：Hitchcock dolly zoom, vertigo effect, subject stable in center, background dynamically warping and expanding, psychological tension, cinematic.
  - 反向：normal zoom, flat perspective, static background.
- **穿越缝隙镜头 (Fly-through Reveal)**：
  - 中文：摄影机平滑穿过门窗遮挡/树林枝叶/建筑缝隙进入场景，焦点由前景过渡聚焦于深处人物。
  - 英文：camera smoothly flies through door frame / forest leaves obstacle into scene, foreground rack focus transitioning to character, immersive depth.

#### C. 高潮爆发与时间定格
- **子弹时间 (Bullet Time)**：
  - 中文：动作在击发瞬间骤然凝滞冻结，摄影机高速弧形环绕半周，悬浮粒子与破碎飞屑静止，光影锐利。
  - 英文：bullet time freeze frame, action frozen at peak impact, high-speed camera arc orbit, suspended floating dust particles, sharp directional light.
- **甩镜转场 (Whip Pan Transition)**：
  - 中文：摄影机极速水平甩动产生强烈运动模糊，在甩动极速点无缝连接下一场景。
  - 英文：rapid whip pan transition, intentional directional motion blur, seamless spatial cut.

---

## 禁忌
- 严禁空泛描述：「电影级运镜」「炫酷运镜」（模型无法解析，必出抽搐）。
- 严禁前后机位跳轴：10 秒片段内硬切机位不得跨越 180 度假想关系线。
- 严禁静态机位长发呆：片段时长超过 3 秒必须有微弱缓推 (Slow Dolly) 或手持微晃呼吸感。
