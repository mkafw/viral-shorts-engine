# v6.4 Execution Rules

## One source of truth

The structured shot is the source of truth. The final Seedance prompt is compiled output.

## Required before generation

For every chained shot:
- PRIMARY_SUBJECT
- CAMERA_START
- CAMERA_TARGET
- ACTION
- END_FRAME_LOCK

For complex camera movement additionally:
- CAMERA_PATH
- SPEED_PROFILE
- FINAL_COMPOSITION

## Outside → inside

Do not start with micro details. Compile:

GLOBAL → SCENE → CAMERA → BLOCKING → ACTION → GAZE → PERFORMANCE → VOICE_SOUND → MICRO

## Tutorial layer mapping

Seedance tutorial labels are mapped into the canonical tree:

PHOTOGRAPHY → GLOBAL/CAMERA
OVERALL_EMOTION → GLOBAL/PERFORMANCE
CHARACTER_STATE → PERFORMANCE
SCENE → SCENE
CAMERA_MOVE → CAMERA
CONSTRAINTS → GLOBAL LOCK
SOUND → VOICE_SOUND
SEGMENTED_NARRATIVE → ACTION/BEAT
END_FRAME_LOCK → CAMERA/BLOCKING/GAZE
EDITING_TRANSITION → SHOT↔SHOT relation

## Generation loop

1. Parse story.
2. Choose primary subject.
3. Establish scene.
4. Establish camera start.
5. Define blocking.
6. Define action.
7. Define gaze and performance.
8. Define sound.
9. Define end frame.
10. Choose transition to next shot.
11. Compile.
12. Validate.
13. Only then send to the video model.
