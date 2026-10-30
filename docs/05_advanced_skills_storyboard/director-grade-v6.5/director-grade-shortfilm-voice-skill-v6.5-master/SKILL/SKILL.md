# v6.5 Master Director Skill

## The system is one tree, not separate tricks

```text
USER STORY
  ↓
STORY / UNIT / BEAT
  ↓
ASSET + CAUSAL GRAPH
  ↓
BLOCKING / STAGING
  ↓
CAMERA DIRECTOR
  ↓
PERFORMANCE
  ↓
VOICE
  ↓
SOUND
  ↓
PROMPT LAYERING
  ↓
CONTINUITY / END-FRAME
  ↓
EDITING / TRANSITION
  ↓
MODEL PROMPT
```

## Three representations

### A. Director Source Tree
What is actually happening.

### B. Shot Control Tree
How the scene is observed and performed.

### C. Prompt Compilation Tree
How the decisions are serialized for Seedance or another video model.

Never treat the final prompt as the source of truth.

## Global → Local nesting

GLOBAL
→ SCENE
→ CAMERA
→ BLOCKING
→ ACTION
→ GAZE
→ PERFORMANCE
→ VOICE_SOUND
→ MICRO

The more outer the layer, the more stable it should be.

## Director modules

### Story
- story intent
- unit
- beat
- dramatic purpose

### Asset
C / P / A / E / S / L / K

### Blocking
- position
- entrance
- exit
- movement path
- screen direction
- spatial relation

### Camera
- camera as physical observer
- start position
- primary subject
- camera path
- speed profile
- attention shift
- final composition
- end-frame lock

### Performance
emotion
→ physiology
→ face
→ body
→ breath or robot-equivalent mechanical state
→ gesture
→ voice

### Voice
D1 scene acoustics
D2 character state
D3 vocal delivery
D4 dialogue

### Prompt
Seedance-specific layers are mapped into the canonical tree.

## Local edit principle

A user change should target the smallest node that can represent it.

Examples:

"镜头更近" → CAMERA
"人物走到窗边" → BLOCKING
"改成拔刀" → ACTION
"看向门口" → GAZE
"从害怕变成压怒" → PERFORMANCE
"说话更慢更低" → VOICE_SOUND
"加手指颤动" → MICRO

Do not rewrite the whole prompt for a local edit.

## Propagation

A change propagates only through actual dependencies.

Example:

P01 replaced
→ A01 compatibility check
→ E01 recalculation
→ S01 recalculation
→ CAMERA may change only if visibility changes

Example:

GLOBAL style changed
→ visual layers recompile
→ story/causal semantics remain unchanged

## Shot chaining

SHOT[n].END_FRAME
→ SHOT[n+1].START_STATE

Lock:
- subject position
- orientation
- gaze
- prop position
- camera side
- screen direction
- lighting/environment state

## Editing

CAMERA_LANGUAGE = within one shot

EDITING_TRANSITION = between shots

Supported:
DOLLY_IN
RACK_FOCUS
L_CUT
HARD_CUT
J_CUT
MATCH_CUT
SMASH_CUT
HIDDEN_CUT

## Tutorial ingestion

Every new tutorial is converted into:

1. CLAIMS — what the tutorial explicitly teaches
2. PATTERNS — reusable structures
3. CONTROLS — editable variables
4. EXAMPLES — concrete demonstrations
5. FAILURE_MODES — what it warns against
6. HOOKS — where the user can change it
7. MAPPINGS — which existing node it belongs to

Never create a parallel skill if an existing node can absorb the method.

## Final generation contract

Before generating a shot prompt:

1. Identify primary subject.
2. Define scene.
3. Define camera start and observation target.
4. Define blocking.
5. Define observable action.
6. Define gaze.
7. Define performance.
8. Define voice/sound.
9. Define end frame if chained.
10. Define transition if needed.
11. Compile outside → inside.
12. Validate.
13. Output model-specific prompt.
