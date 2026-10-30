import sys
from pathlib import Path

ORDER = [
    "GLOBAL", "SCENE", "CAMERA", "BLOCKING", "ACTION",
    "GAZE", "PERFORMANCE", "VOICE_SOUND", "MICRO"
]

def validate(data):
    errors = []
    layers = data.get("prompt_layers", {})
    present = [k for k in ORDER if k in layers]
    if present != sorted(present, key=ORDER.index):
        errors.append("Prompt layers are out of order.")
    if "GLOBAL" not in layers:
        errors.append("GLOBAL layer is required.")
    if "CAMERA" not in layers:
        errors.append("CAMERA layer is required for camera-first mode.")
    if "BLOCKING" not in layers:
        errors.append("BLOCKING layer is required.")
    if "ACTION" not in layers:
        errors.append("ACTION layer is required.")
    return errors

if __name__ == "__main__":
    print("v6.2 validator loaded.")
    print("Expected order:", " -> ".join(ORDER))
    print("Pass a parsed mapping to validate(data) from your integration layer.")
