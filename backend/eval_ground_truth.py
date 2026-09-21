import os
import sys
import json
import numpy as np

sys.path.insert(0, os.path.abspath("backend"))
from matching import match_lunar_images

def true_errors(match_points, H):
    m = np.asarray(match_points, dtype=float)
    if m.size == 0:
        return np.array([])
    src = np.c_[m[:, 0], m[:, 1], np.ones(len(m))]
    proj = (np.asarray(H) @ src.T).T
    proj = proj[:, :2] / proj[:, 2:3]
    return np.linalg.norm(proj - m[:, 2:4], axis=1)

def run_detailed_eval():
    folder = "Test"
    gt_path = os.path.join(folder, "ground_truth.json")
    with open(gt_path, "r") as f:
        gt = json.load(f)

    print("=" * 100)
    print(f"{'Test Pair':18} {'Status':8} {'Inliers':>8} {'Claimed RMSE':>13} {'True Med':>9} {'True 90%':>9} {'<1px %':>7} {'<3px %':>7}")
    print("=" * 100)

    for name, H in gt.items():
        ref_path = os.path.join(folder, f"{name}_ref.png")
        src_path = os.path.join(folder, f"{name}_src.png")
        with open(src_path, "rb") as fs, open(ref_path, "rb") as fr:
            r = match_lunar_images(fs.read(), fr.read())
        m = r.get("metrics", {})
        pts = r.get("match_points", [])
        e = true_errors(pts, H)

        status = r.get("status", "failed")
        inlier_cnt = m.get("inlier_count", 0)
        total_cnt = m.get("total_matches", len(pts))
        claimed_rmse = m.get("rmse", 0.0)
        
        if len(e) > 0:
            true_med = float(np.median(e))
            p90 = float(np.percentile(e, 90))
            acc_1px = float(100.0 * (e < 1.0).mean())
            acc_3px = float(100.0 * (e < 3.0).mean())
            
            print(f"{name:18} {status[:8]:8} {inlier_cnt:>4}/{total_cnt:<3} {claimed_rmse:>11.2f}px "
                  f"{true_med:>8.2f}px {p90:>8.2f}px {acc_1px:>6.1f}% {acc_3px:>6.1f}%")
        else:
            print(f"{name:18} {status[:8]:8} {inlier_cnt:>4}/{total_cnt:<3} {'-':>11} {'-':>8} {'-':>8} {'-':>6} {'-':>6}")

    print("=" * 100)

if __name__ == "__main__":
    run_detailed_eval()
