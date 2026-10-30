# Prompt Compiler

Input is structured YAML/JSON, not a raw prose prompt.

Compile in this order:

1. GLOBAL
2. SCENE
3. CAMERA
4. BLOCKING
5. ACTION
6. GAZE
7. PERFORMANCE
8. VOICE_SOUND
9. MICRO

Compiler rules:
- Preserve locked values.
- Do not repeat identical descriptors unnecessarily.
- Convert abstract emotion into observable performance.
- Keep camera motivation explicit.
- Keep action causality explicit.
- Keep sound attached to a source.
- Preserve character and prop IDs internally.
- Remove internal IDs only in the final model-facing prompt if the target model does not need them.
- If two layers conflict, report the conflict rather than silently inventing a compromise.

Output:
A. structured layers
B. normalized prompt
C. continuity warnings
D. hook targets
