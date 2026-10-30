# AI Image Generation Framework v2

A structured system for writing cinematic image prompts. Works by briefing the model like a cinematographer — specific choices, full sentences, clear constraints. Every prompt is built across ten labelled dimensions.

---

## The Ten Parameters

Every prompt is composed of ten lines, one per dimension:

```
Subject:                     who or what is in the frame
Action & pose:               what they're doing, body position, gesture, weight distribution
Expression & gaze:           facial expression, eye direction, emotional read
Setting & environment:       location, time of day, season, weather, atmospheric conditions
Camera:                      shot size, lens, angle, depth of field, framing
Lighting:                    key light, quality, colour temperature, fill, shadows
Style & medium:              visual language — photorealistic, CGI, cel animation, etc.
Materiality & texture:       surface details on clothing, skin, objects, environment
Particle & atmospheric effects: volumetric elements, particles, environmental phenomena
Constraints:                 what should NOT appear
```

Each line should carry real visual information. Avoid vague filler. Treat every value as a note to a cinematographer: specific, intentional, evocative.

**Per-line length target:** 10–25 words. Long enough to be precise, short enough to stay scannable.

---

## Forced Cinematic Defaults

The following are always applied, regardless of what's specified. They are the non-negotiable cinematic baseline.

**Camera — always forced:**
- Lens between 35mm–85mm (the cinematic sweet spot — avoids wide-angle distortion and telephoto flatness)
- Shallow depth of field — subject sharp, background and foreground out of focus, bokeh on background elements
- Subject placed on a rule-of-thirds intersection, not centred — left or right based on gaze/action direction

**Composition — always forced:**
- At least one foreground element (partially out of focus) to create depth layers and frame the subject
- Intentional negative space — empty areas have a clear directional purpose (weight, tension, breath), never just empty

**What is NOT forced:**
- Lighting — fully user-controlled
- Style & medium — fully user-controlled
- Particle & atmospheric effects — suggested but not forced; some styles (flat illustration, clean editorial) don't suit volumetric effects

---

## Gap-Filling Heuristics

For every dimension not specified, make a deliberate creative choice that serves the scene. Choices should be internally consistent — lighting matches time of day, lens choice matches emotional register, textures match style.

- **Style default:** Infer from context. When genuinely ambiguous, default to cinematic photorealism.
- **Camera:** Within the forced defaults, match emotional beat for lens choice — intimate moments → 85mm, epic scale → 35mm, tension → low or Dutch angle, calm observation → eye-level.
- **Lighting:** Derive from time of day if given. Otherwise choose lighting that adds dimension — avoid flat front lighting.
- **Expression:** Match the action's emotion. If neutral, give a subtle readable expression — slight jaw tension, distant gaze, half-smile. Micro-expressions read better than exaggerated ones.
- **Pose:** Distribute weight naturally. Lean into contrapposto, mid-gesture captures, moments of transition — they feel alive.
- **Environment:** Always add at least one foreground and one background element for depth.
- **Texture:** Always include at least two texture callouts — the most prominent surface and one secondary surface.
- **Particles/atmosphere:** Always include at least one atmospheric element. Rain/mist for moody exteriors, dust motes/god rays for interiors, embers/sparks for fire-adjacent scenes. Match the language to the style — photorealistic uses photography language, CGI/3D uses render language.

---

## Style Adaptations

**Photorealistic / Cinematic**
- Emphasise lens specs, film stock or sensor look, naturalistic lighting
- Photography language: "shallow depth of field," "bokeh," "lens flare," "chromatic aberration"
- Hyper-specific textures: "visible skin pores," "individual fabric threads," "condensation droplets"
- Constraint: "No AI artifacts, no uncanny valley"

**CGI / 3D Render**
- Render quality cues: "ray-traced global illumination," "subsurface scattering on skin," "volumetric fog"
- Material properties: "PBR metallic finish," "anisotropic highlights on brushed steel," "translucent wax"

**Animation / Cel / Cartoon**
- Specify line weight, colour palette approach, shading model (cel-shaded, soft gradient, flat colour)
- Pose and expression can be more exaggerated — squash and stretch principles apply
- Constraint: "No photorealistic textures, maintain consistent line art style"

**Illustration / Concept Art / Painterly**
- Reference art-historical styles or aesthetic traditions (Art Nouveau, Frazetta, Moebius, ukiyo-e)
- Medium cues: "visible oil paint impasto," "watercolour bleed at edges," "charcoal texture grain"

**Editorial / Fashion / Commercial**
- Emphasise styling details: garment construction, fabric drape, accessory placement
- Lighting references professional setups: "beauty dish key with clamshell fill," "single strip softbox from camera left"
- Post-production cues: "high-fashion colour grade," "desaturated with crushed blacks"

---

## Character References

Uploading reference images is the single biggest quality lever. The model can take up to 14 reference images per prompt and has strong character consistency capabilities.

**What counts as a reference:**
- Turnaround sheets (front/side/back)
- Expression sheets
- Outfit/costume breakdowns
- Single reference portraits
- Mood boards or style frames

**When using references:**
- Open the Subject line with: *"Using the attached character reference —"* followed by a compact visual description. This activates the consistency engine.
- Extract character DNA: facial structure, skin tone, hair, distinguishing marks, build, clothing, accessories, signature elements
- Aim for 80–150 words of identifying detail in the subject description

---

## Constraints Baseline

Always include unless the style contradicts:
- No text, no watermarks
- No extra limbs, no deformed hands

Add style-specific constraints as needed:
- Animation: "No photorealistic textures, maintain consistent line art style"
- Architecture: "No lens distortion"
- Character work: "Maintain [specific feature] accurately"

---

## Example Outputs

### Example 1 — Minimal input, photorealistic default

**Input:** "a samurai in the rain"

```
Subject: a weathered samurai, late 40s, battle-worn face, traditional armour
Action & pose: standing motionless on a stone bridge, katana held loosely at his side, weight settled, unhurried
Expression & gaze: jaw set, eyes narrowed against the downpour, gaze fixed on something beyond frame
Setting & environment: rain-slicked stone bridge over a river, grey-blue twilight, heavy downpour, mist rising from the water below
Camera: medium shot, 50mm lens, low angle, shallow depth of field, subject on left third, wet stone foreground out of focus, negative space to the right
Lighting: warm amber key from a distant paper lantern camera left, cool blue ambient fill, deep shadow on the right side of the face
Style & medium: cinematic photorealism, desaturated palette with isolated warm tones, film grain
Materiality & texture: lacquered armour plates catching faint lantern reflections, waterlogged indigo hakama fabric clinging to his legs, wet mossy stone underfoot
Particle & atmospheric effects: heavy rain in visible vertical streaks, shallow puddles on stone reflecting lantern light, wisps of mist rising from the river surface
Constraints: no text, no watermarks, no extra figures
```

---

### Example 2 — Stylised input

**Input:** "cute robot mechanic fixing a spaceship, Pixar style"

```
Subject: a small round-bodied robot mechanic with oversized expressive optical sensors, scuffed matte white body, teal accent panels
Action & pose: perched on the wing of a battered orange cargo spaceship, one stubby arm deep inside an open hull panel, other arm holding a comically large wrench
Expression & gaze: optical sensors squinted in concentration, tiny tongue-like antenna poking out from the side of its head
Setting & environment: cavernous industrial hangar, warm artificial overhead lighting, oil stains on concrete floor, scattered tools across the foreground
Camera: medium wide shot, 35mm lens, slightly low angle, shallow depth of field, subject on left third of frame, scattered tools in foreground out of focus, negative space above and right
Lighting: warm strip lights overhead as key, soft ambient fill from hangar walls, gentle rim light separating the robot from the background
Style & medium: Pixar-style 3D animation render, vibrant but not oversaturated colour palette, rounded forms, subsurface scattering on translucent chest panels
Materiality & texture: scuffed matte white chassis with visible rivet details, dented teal panel edges, rust-spotted orange spaceship hull plating
Particle & atmospheric effects: trailing sparks from the open hull panel, faint heat shimmer near the engine cowling, dust motes caught in overhead light shafts
Constraints: no text, no watermarks, no photorealistic textures
```

---

### Example 3 — With character reference uploaded

**Input:** Character sheet uploaded (woman, copper-red hair, freckles, olive bomber jacket, cargo trousers, scuffed boots) + "her walking through a cyberpunk market"

```
Subject: using the attached character reference — young woman, cropped copper-red hair, freckles across nose and cheeks, olive-green bomber jacket with mission patch on left shoulder
Action & pose: walking through a dense night market, mid-stride, jacket catching neon reflections as she turns slightly
Expression & gaze: alert but relaxed, eyes scanning the stalls ahead, lips slightly parted
Setting & environment: dense cyberpunk night market, holographic signage in Mandarin and Korean, crowded stalls, wet pavement reflecting neon
Camera: close-up tracking shot, 50mm lens, eye-level, subject on left third of frame, shallow depth of field compressing the crowd behind, hanging cables out of focus in foreground
Lighting: competing magenta and cyan from holographic signage, split-colour shadows across her face, no single key — ambient neon from all directions
Style & medium: cinematic photorealism, cyberpunk colour grade — heavy teals and magentas, lifted shadows, slight chromatic aberration at frame edges
Materiality & texture: worn nylon bomber jacket surface, mission patch embroidery visible, dark cargo trousers tucked into scuffed black boots with cracked leather at the toe caps
Particle & atmospheric effects: steam rising from a street food stall to her right catching neon light, bokeh dots of distant signage in background, hanging fibre-optic cables slightly out of focus in foreground
Constraints: no text overlays, no watermarks, no deformed hands
```

---

### Example 4 — Extreme environment, full body

**Input:** Character reference uploaded (male, late 20s, dark brown beard, olive backwards cap, gold wire-frame glasses) + "full body knelt next to erupting volcano"

```
Subject: using the attached character reference — male, late 20s, broad jaw, full dark brown beard, dark olive backwards baseball cap, gold wire-frame glasses with square-round hybrid lenses, fair skin, close-cropped dark hair at sides
Action & pose: crouched low on one knee at the edge of a lava flow, one hand braced on a volcanic rock, leaning slightly forward, body turned three-quarters toward camera
Expression & gaze: eyes wide, intense — awe mixed with adrenaline, gaze directed down toward the lava, brow furrowed behind glasses
Setting & environment: active volcano at night, erupting vent visible in the mid-ground, rivers of molten lava cutting across black basalt rock, ash and embers filling the air, no horizon — just rock and fire and darkness
Camera: full body shot, 35mm lens, low angle looking slightly up, subject on left third of frame, jagged volcanic rock in foreground out of focus, erupting vent glowing in background right
Lighting: intense orange-red practical from the lava below casting hard upward light across his face and body, deep shadow above, faint rim light from distant lava flow on right shoulder separating him from the dark background
Style & medium: cinematic photorealism, high contrast, rich blacks, orange and red tones against deep shadow, film grain
Materiality & texture: rough porous black basalt underfoot, heat-hazed air above the lava surface, heavy jacket fabric catching harsh uplight, gold glasses frames glowing warm from the lava light
Particle & atmospheric effects: glowing embers drifting upward through the frame, volcanic ash suspended in the air, heat shimmer rising from the lava flow, distant eruption plume lit orange against the black sky
Constraints: no text, no watermarks, no extra figures, no AI artifacts, maintain glasses and beard accurately
```
