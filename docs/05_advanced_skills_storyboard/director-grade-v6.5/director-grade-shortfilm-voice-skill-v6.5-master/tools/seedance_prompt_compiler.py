"""
v6.4 Seedance layered prompt compiler.

This is a dependency-free reference compiler. It accepts a dict with canonical
layers and returns:
- normalized ordered layers
- a model-facing prompt
- warnings
- continuity state

It intentionally does not call an external model/API.
"""

ORDER = [
    "GLOBAL", "SCENE", "CAMERA", "BLOCKING", "ACTION",
    "GAZE", "PERFORMANCE", "VOICE_SOUND", "MICRO"
]

SEEDANCE_MAP = {
    "PHOTOGRAPHY": ["GLOBAL", "CAMERA"],
    "OVERALL_EMOTION": ["GLOBAL", "PERFORMANCE"],
    "CHARACTER_STATE": ["PERFORMANCE"],
    "SCENE": ["SCENE"],
    "CAMERA_MOVE": ["CAMERA"],
    "CONSTRAINTS": ["GLOBAL"],
    "SOUND": ["VOICE_SOUND"],
    "SEGMENTED_NARRATIVE": ["ACTION"],
    "END_FRAME_LOCK": ["CAMERA", "BLOCKING", "GAZE"],
}

def _flat(v):
    if v is None:
        return ""
    if isinstance(v, str):
        return v.strip()
    if isinstance(v, (list, tuple)):
        return "; ".join(_flat(x) for x in v if _flat(x))
    if isinstance(v, dict):
        return "; ".join(f"{k}: {_flat(val)}" for k, val in v.items() if _flat(val))
    return str(v)

def validate_shot(shot):
    warnings = []
    layers = shot.get("prompt_layers", {})

    if "GLOBAL" not in layers:
        warnings.append("GLOBAL missing: film/sequence consistency may drift.")
    if "CAMERA" not in layers:
        warnings.append("CAMERA missing: camera-first mode cannot be compiled.")
    if "BLOCKING" not in layers:
        warnings.append("BLOCKING missing: spatial choreography is underspecified.")
    if "ACTION" not in layers:
        warnings.append("ACTION missing: observable behavior is underspecified.")

    cam = layers.get("CAMERA", {})
    if isinstance(cam, dict):
        if not cam.get("position") and not cam.get("start"):
            warnings.append("CAMERA has no explicit start/position.")
        if not cam.get("attention") and not cam.get("target") and not cam.get("primary_subject"):
            warnings.append("CAMERA has no explicit observation target.")

    end = shot.get("end_frame_lock") or layers.get("END_FRAME_LOCK")
    if shot.get("chain_to_next") and not end:
        warnings.append("Shot is chained but has no END_FRAME_LOCK.")

    transition = shot.get("editing_transition")
    if transition and not transition.get("to"):
        warnings.append("EDITING_TRANSITION has no destination shot.")

    return warnings

def normalize(shot):
    layers = shot.get("prompt_layers", {})
    ordered = {}
    for key in ORDER:
        if key in layers and layers[key]:
            ordered[key] = layers[key]

    # Tutorial-derived fields can coexist without changing source-of-truth layers.
    meta = {}
    for key in ("end_frame_lock", "editing_transition", "segmented_narrative"):
        if key in shot:
            meta[key] = shot[key]

    return {"layers": ordered, "meta": meta}

def compile_prompt(shot):
    warnings = validate_shot(shot)
    normalized = normalize(shot)

    chunks = []
    labels = {
        "GLOBAL": "Overall visual language",
        "SCENE": "Scene",
        "CAMERA": "Camera",
        "BLOCKING": "Blocking",
        "ACTION": "Action",
        "GAZE": "Gaze",
        "PERFORMANCE": "Performance",
        "VOICE_SOUND": "Voice and sound",
        "MICRO": "Micro details",
    }

    for key, value in normalized["layers"].items():
        text = _flat(value)
        if text:
            chunks.append(f"{labels[key]}: {text}")

    meta = normalized["meta"]
    if meta.get("end_frame_lock"):
        chunks.append("End frame lock: " + _flat(meta["end_frame_lock"]))
    if meta.get("editing_transition"):
        chunks.append("Editing transition: " + _flat(meta["editing_transition"]))

    return {
        "shot_id": shot.get("shot_id"),
        "ordered_layers": list(normalized["layers"].keys()),
        "prompt": " | ".join(chunks),
        "warnings": warnings,
        "continuity": {
            "end_frame_lock": bool(meta.get("end_frame_lock")),
            "transition": bool(meta.get("editing_transition")),
        }
    }

if __name__ == "__main__":
    example = {
        "shot_id": "S01",
        "prompt_layers": {
            "GLOBAL": {"style": "realistic cinematic"},
            "SCENE": {"location": "industrial corridor"},
            "CAMERA": {"start": "behind subject", "attention": "subject"},
            "BLOCKING": {"subject": "walks from left to right"},
            "ACTION": {"sequence": ["walk", "stop", "look"]},
            "GAZE": {"change": "locks onto object"},
            "PERFORMANCE": {"state": "restrained alertness"},
            "VOICE_SOUND": {"ambience": "low machinery hum"},
        },
        "end_frame_lock": {"gaze": "object", "screen_direction": "left_to_right"},
    }
    print(json.dumps(compile_prompt(example), ensure_ascii=False, indent=2))
