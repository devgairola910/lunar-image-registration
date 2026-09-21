import time
import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath("backend"))

from matching import match_lunar_images

def test_lunar_images():
    img1_path = "Test/sendImage.png"
    img2_path = "Test/sendImage (1).png"
    
    print(f"Loading test pair:\n  Reference: {img1_path}\n  Source: {img2_path}\n")
    
    with open(img1_path, "rb") as f1, open(img2_path, "rb") as f2:
        img1_bytes = f1.read()
        img2_bytes = f2.read()
        
    t0 = time.time()
    result = match_lunar_images(img1_bytes, img2_bytes)
    t1 = time.time()
    
    metrics = result["metrics"]
    
    print("=" * 60)
    print("           CHANDRADRISHTI PIPELINE TELEMETRY           ")
    print("=" * 60)
    print(f"Status:                   {result['status']}")
    print(f"Execution Time:           {result['execution_time_seconds']}s (Total: {t1-t0:.2f}s)")
    print(f"RMSE:                     {metrics['rmse']} px")
    print(f"X Residual Disparity:     {metrics['x_residual']} px")
    print(f"Y Residual Disparity:     {metrics['y_residual']} px")
    print(f"Inlier Ratio:             {metrics['inlier_ratio']}% ({metrics['inlier_count']} / {metrics['total_candidates']})")
    print(f"Mission Confidence Score: {metrics['confidence_score']}%")
    print(f"Spatial Coverage (8x8):   {metrics['spatial_coverage']}%")
    print("=" * 60)
    
    # Assertions based on required criteria
    rmse_pass = metrics['rmse'] < 2.0
    inlier_pass = metrics['inlier_ratio'] >= 85.0
    confidence_pass = metrics['confidence_score'] >= 88.0
    
    print("\nVERIFICATION RESULTS:")
    print(f"  [ {'PASS' if rmse_pass else 'FAIL'} ] RMSE < 2.0 px ({metrics['rmse']} px)")
    print(f"  [ {'PASS' if inlier_pass else 'FAIL'} ] Inlier Ratio >= 85.0% ({metrics['inlier_ratio']}%)")
    print(f"  [ {'PASS' if confidence_pass else 'FAIL'} ] Mission Confidence Score >= 88.0% ({metrics['confidence_score']}%)")
    
    if rmse_pass and inlier_pass and confidence_pass:
        print("\n>>> ALL CRITICAL TARGET METRICS SATISFIED SUCCESSFULLY! <<<")
    else:
        print("\n>>> TARGET METRICS NOT MET - THRESHOLD RE-TUNING REQUIRED <<<")

if __name__ == "__main__":
    test_lunar_images()
