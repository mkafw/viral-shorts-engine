# Prompt Layer Hooks

| User edit | Primary layer | Dependencies |
|---|---|---|
| change overall visual style | GLOBAL | all visual layers |
| change environment | SCENE | CAMERA, BLOCKING, MICRO |
| change camera movement | CAMERA | framing, blocking visibility |
| move character | BLOCKING | CAMERA, ACTION, GAZE |
| change action | ACTION | PERFORMANCE, SOUND, MICRO |
| change attention | GAZE | CAMERA, PERFORMANCE |
| change emotion/performance | PERFORMANCE | VOICE_SOUND, MICRO |
| change voice delivery | VOICE_SOUND | dialogue timing |
| add tiny detail | MICRO | no macro rewrite unless contradiction |

A Hook must report:
- target layer
- changed node
- propagated dependencies
- regenerated layers
- continuity warnings
