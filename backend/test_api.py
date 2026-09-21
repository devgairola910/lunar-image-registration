import io
import time
import numpy as np
from PIL import Image, ImageDraw
from matching import match_lunar_images

def generate_synthetic_lunar_pair():
    """Generates a pair of synthetic crater-like test images with geometric shift."""
    w, h = 600, 600
    
    # Base image with synthetic craters
    img1 = Image.new("L", (w, h), color=50)
    draw1 = ImageDraw.Draw(img1)
    
    # Draw craters & features
    craters = [
        (150, 150, 80), (350, 200, 120), (200, 400, 100), (450, 450, 90), (100, 300, 60)
    ]
    for cx, cy, r in craters:
        draw1.ellipse([cx - r, cy - r, cx + r, cy + r], fill=180, outline=230, width=4)
        draw1.ellipse([cx - r*0.6, cy - r*0.6, cx + r*0.4, cy + r*0.4], fill=80)

    # Convert to bytes
    buf1 = io.BytesIO()
    img1.save(buf1, format="PNG")
    src_bytes = buf1.getvalue()
    
    # Shift and rotate slightly for reference image
    img2 = img1.rotate(3, center=(w//2, h//2), fillcolor=50)
    buf2 = io.BytesIO()
    img2.save(buf2, format="PNG")
    ref_bytes = buf2.getvalue()
    
    return src_bytes, ref_bytes


def main():
    print("Generating synthetic lunar test image pair...")
    src_bytes, ref_bytes = generate_synthetic_lunar_pair()
    
    print("Executing match_lunar_images pipeline...")
    t0 = time.time()
    result = match_lunar_images(src_bytes, ref_bytes)
    t1 = time.time()
    
    print(f"Status: {result['status']}")
    print(f"Execution time: {result['execution_time_seconds']} seconds (measured: {t1-t0:.3f}s)")
    print(f"Inlier count: {result['metrics']['inlier_count']}")
    print(f"Total matches: {result['metrics']['total_matches']}")
    print(f"Inlier ratio: {result['metrics']['inlier_ratio']}")
    print(f"RMSE: {result['metrics']['rmse']} px")
    print(f"Confidence Score: {result['metrics']['confidence_score']}")
    print(f"Match points extracted: {len(result['match_points'])}")
    print(f"Keypoints array count: {len(result['keypoints'])}")
    print(f"Spatial coverage: {result['metrics']['spatial_coverage']}%")
    
    assert "status" in result
    assert "metrics" in result
    assert "match_points" in result
    print("\n[SUCCESS] BACKEND PIPELINE TEST PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
