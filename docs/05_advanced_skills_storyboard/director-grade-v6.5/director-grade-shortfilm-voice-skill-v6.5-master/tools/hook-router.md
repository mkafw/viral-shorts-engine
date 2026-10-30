# Hook Router v6.5

Input: natural-language edit.

1. classify requested change
2. choose smallest target node
3. update target
4. calculate dependencies
5. recompile affected layers
6. run continuity checks
7. return:
   - changed nodes
   - propagated nodes
   - unchanged locked nodes
   - warnings
   - regenerated prompt

Priority:
GLOBAL LOCK > SCENE > CAMERA > BLOCKING > ACTION > GAZE > PERFORMANCE > VOICE_SOUND > MICRO
