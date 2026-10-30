# v6.2 Architecture

The system has two separate concepts:

## Director Control Tree
What should happen:
STORY → BEHAVIOR → BLOCKING → CAMERA → PERFORMANCE → SOUND

## Prompt Layer Tree
How that decision is packaged:
GLOBAL → SCENE → CAMERA → BLOCKING → ACTION → GAZE → PERFORMANCE → VOICE_SOUND → MICRO

The first tree is the source of truth.
The second tree is the compilation representation.

This separation prevents a prompt rewrite from accidentally changing story logic.
