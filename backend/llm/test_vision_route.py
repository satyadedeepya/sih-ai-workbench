# backend/llm/test_vision_route.py
import base64

try:
    from .router import route_and_generate
except ImportError:
    from router import route_and_generate

# Point this at any test image you have — a screenshot, a photo, etc.
IMAGE_PATH = "test_data/sample_drawing.png"

with open(IMAGE_PATH, "rb") as f:
    image_b64 = base64.b64encode(f.read()).decode("utf-8")

result = route_and_generate(
    prompt="Describe what this image shows.",
    file_info={"filename": "sample_drawing.png", "extension": ".png"},
    images=[image_b64],
)

print(f"Task type: {result['task_type']}")
print(f"Model used: {result['model_used']}")
print(f"Error: {result['error']}")
print(f"Response:\n{result['response']}")