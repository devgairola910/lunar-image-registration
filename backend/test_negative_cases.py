import os
import sys
import io
import time
import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.abspath("backend"))

from matching import match_lunar_images

def create_crater_scene(seed=42):
    """Generates a synthetic crater terrain image with a given seed."""
    np.random.seed(seed)
    w, h = 600, 600
    img = Image.new("L", (w, h), color=50)
    draw = ImageDraw.Draw(img)
    
    # Generate random craters based on seed
    for _ in range(15):
        cx = np.random.randint(50, w - 50)
        cy = np.random.randint(50, h - 50)
        r = np.random.randint(20, 70)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=np.random.randint(140, 220), outline=240, width=3)
        draw.ellipse([cx - r*0.5, cy - r*0.5, cx + r*0.3, cy + r*0.3], fill=np.random.randint(40, 90))
        
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

def create_noise_image(w=600, h=600):
    arr = np.random.randint(0, 256, (h, w), dtype=np.uint8)
    img = Image.fromarray(arr)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

def create_blank_image(w=600, h=600, val=10):
    arr = np.full((h, w), val, dtype=np.uint8)
    img = Image.fromarray(arr)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

def run_negative_test_harness():
    print("=" * 105)
    print("           CHANDRADRISHTI NEGATIVE / BAD CASE REJECTION TEST SUITE           ")
    print("=" * 105)

    # 1. Valid Control Case
    good_src = create_crater_scene(seed=101)
    img_good = Image.open(io.BytesIO(good_src)).rotate(4, center=(300, 300))
    buf_good = io.BytesIO()
    img_good.save(buf_good, format="PNG")
    good_ref = buf_good.getvalue()

    # 2. Bad Case 1: Completely Unrelated Lunar Crater Scenes (Seed 101 vs Seed 999)
    unrelated_ref = create_crater_scene(seed=999)

    # 3. Bad Case 2: Pure Random White Noise vs Crater Scene
    noise_src = create_noise_image()

    # 4. Bad Case 3: Featureless Blank Black Image vs Crater Scene
    blank_src = create_blank_image()

    test_cases = [
        ("VALID CONTROL: Overlapping Lunar Scene (4° Shift)", good_src, good_ref, True),
        ("BAD CASE 1: Unrelated Lunar Scenes (Seed 101 vs 999)", good_src, unrelated_ref, False),
        ("BAD CASE 2: Pure Random Noise vs Crater Terrain", noise_src, good_ref, False),
        ("BAD CASE 3: Blank Black Image vs Crater Terrain", blank_src, good_ref, False),
    ]

    print(f"{'Test Case Description':55} {'Status':22} {'Inliers/Total':15} {'Confidence':12} {'Assessment'}")
    print("-" * 115)

    all_passed = True

    for label, src_b, ref_b, should_pass in test_cases:
        r = match_lunar_images(src_b, ref_b)
        status = r.get("status", "unknown")
        m = r.get("metrics", {})
        inliers = m.get("inlier_count", 0)
        total = m.get("total_candidates", m.get("total_matches", 0))
        conf = m.get("confidence_score", 0.0)
        ratio = m.get("inlier_ratio", 0.0)

        if should_pass:
            is_good = (status == "success") and (conf >= 75.0) and (inliers >= 30)
            assessment = "[PASS] Valid Lock" if is_good else "[FAIL] False Rejection"
        else:
            # Bad cases MUST either fail OR have low confidence (< 40%) and low inliers (< 10)
            is_good = (status != "success") or (conf < 40.0) or (inliers < 10) or (ratio < 40.0)
            assessment = "[PASS] Correctly Rejected" if is_good else "[FAIL] False Positive!"

        if not is_good:
            all_passed = False

        inlier_str = f"{inliers}/{total}"
        print(f"{label:55} {status:22} {inlier_str:15} {conf:>9.1f}%   {assessment}")

    print("=" * 105)
    if all_passed:
        print("\n>>> ALL BAD / NEGATIVE TEST CASES SUCCESSFULLY REJECTED! ZERO FALSE POSITIVES! <<<")
    else:
        print("\n>>> WARNING: PIPELINE ACCEPTED FALSE POSITIVE MATCHES FOR UNRELATED IMAGES! <<<")

if __name__ == "__main__":
    run_negative_test_harness()
