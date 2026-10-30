# v6.5 Master Director Pipeline

## 0. Source of Truth

The system has ONE source of truth:

DIRECTOR_GRAPH

Everything else is a compiled view:
- storyboard
- shot list
- prompt layers
- Seedance prompt
- voice prompt
- sound plan
- Hook patch

Never edit the final prompt as the primary artifact.

## 1. Master Pipeline

USER STORY
  ↓
STORY PARSER
  ↓
STORY / UNIT / BEAT
  ↓
ASSET GRAPH
  ↓
CAUSAL GRAPH
  ↓
BLOCKING GRAPH
  ↓
CAMERA DIRECTOR
  ↓
PERFORMANCE
  ↓
VOICE + SOUND
  ↓
SHOT CHAIN
  ↓
PROMPT LAYERING
  ↓
SEEDANCE COMPILER
  ↓
END-FRAME / CONTINUITY
  ↓
FINAL OUTPUT

## 2. Three Trees

### A. Narrative Tree
STORY → UNIT → BEAT → SHOT

### B. Director Tree
BEHAVIOR → BLOCKING → CAMERA → GAZE → PERFORMANCE → SOUND

### C. Prompt Tree
GLOBAL → SCENE → CAMERA → BLOCKING → ACTION → GAZE → PERFORMANCE → VOICE_SOUND → MICRO

The three trees are related but must not be collapsed into one text blob.

## 3. Shot as the Atomic Unit

A SHOT must answer:

1. What is happening?
2. Who is the primary subject?
3. Where is everyone?
4. What does the camera see?
5. Why does the camera move?
6. What does the subject do?
7. Where does the subject look?
8. How does the body/face respond?
9. What is heard?
10. What is the final frame?
11. How does the next shot begin?

## 4. Camera-First Director

Pretend a real camera is physically present.

Camera state:
- START_POSITION
- HEIGHT
- DISTANCE
- LENS/FOV
- ORIENTATION
- PRIMARY_SUBJECT
- ATTENTION
- PATH
- SPEED
- FINAL_COMPOSITION

Camera movement must have a reason.

Examples:
- discovery → camera discovers with character
- fear → camera may hold or move closer
- running → camera follows/reframes
- reveal → camera delays or exposes information
- reaction → camera protects the reaction long enough to read it

## 5. Blocking

Blocking precedes camera polish.

Define:
- entrance
- exit
- position
- path
- facing
- screen direction
- distance
- foreground/background
- interaction with props

Then choose camera placement that can actually observe the blocking.

## 6. Performance

Use:

EMOTION
→ PHYSIOLOGY
→ FACE
→ BODY
→ BREATH / ROBOT-SPECIFIC SUBSTITUTE
→ GESTURE
→ VOICE
→ SPEECH RHYTHM

For non-biological characters, do not invent breathing, heartbeat, sweat, or biological pain unless the story explicitly establishes them.

## 7. Voice

Four dimensions:

D1 Scene acoustics
D2 Character state
D3 Vocal delivery
D4 Dialogue

Voice must follow performance rather than being an isolated text-to-speech instruction.

## 8. Sound Causality

ACTION → SOUND
PROP → SOUND
ENVIRONMENT → AMBIENCE
VOICE → SPEECH SOUND

Avoid decorative sound that has no source.

## 9. Prompt Layering

Outer → inner:

GLOBAL
→ SCENE
→ CAMERA
→ BLOCKING
→ ACTION
→ GAZE
→ PERFORMANCE
→ VOICE_SOUND
→ MICRO

Outer layers are more stable.

## 10. Seedance Extension

Tutorial-oriented fields map as:

PHOTOGRAPHY → GLOBAL/CAMERA
OVERALL_EMOTION → GLOBAL/PERFORMANCE
CHARACTER_STATE → PERFORMANCE
SCENE → SCENE
CAMERA_MOVE → CAMERA
CONSTRAINTS → GLOBAL LOCK
SOUND → VOICE_SOUND
SEGMENTED_NARRATIVE → BEAT/ACTION

Complex camera:

CAMERA_START
→ PRIMARY_SUBJECT
→ CAMERA_PATH
→ SPEED_PROFILE
→ ATTENTION_CHANGE
→ FINAL_COMPOSITION

## 11. End Frame Chain

SHOT[n].END_FRAME
→ SHOT[n+1].START_STATE

Lock:
- character position
- body orientation
- gaze
- prop position
- screen direction
- camera side
- lighting state
- environment state

## 12. Hook System

A Hook edits a node, not prose.

Examples:
STYLE_CHANGE → GLOBAL
CAMERA_CHANGE → CAMERA
MOVE_CHARACTER → BLOCKING
CHANGE_ACTION → ACTION
CHANGE_LOOK → GAZE
CHANGE_EMOTION → PERFORMANCE
CHANGE_VOICE → VOICE_SOUND
ADD_DETAIL → MICRO

After a Hook:
UPDATE → PROPAGATE → RECOMPILE → CHECK → PATCH OUTPUT

## 13. Failure Prevention

Block generation when:
- no primary subject
- no camera start for a complex move
- camera has no target
- blocking contradicts camera
- action has no observable behavior
- chained shot lacks end frame
- transition has no destination
- prop changes position without cause
- gaze conflicts with discovery
- voice contradicts performance
- micro detail contradicts macro action
- local layer overrides a locked global rule

## 14. Output Package

Every generated sequence should contain:

01_story.md
02_director_graph.yaml
03_assets.yaml
04_blocking.yaml
05_camera.yaml
06_storyboard.yaml
07_shot_chain.yaml
08_prompt_layers.yaml
09_seedance_prompts.md
10_voice_sound.yaml
11_continuity.yaml
12_hook_map.yaml

The final video prompt is never the only output.
