#!/usr/bin/env python3
"""
Run every pair through your running backend and compare with ground truth.

    pip install requests numpy
    uvicorn main:app --port 8000          # in another terminal, from backend/
    python score_against_truth.py [folder] [api_url]

For each pair it reports:
  - the RMSE your API claims (self-reported)
  - the REAL error: each returned match_point [src_x, src_y, ref_x, ref_y] is checked
    against the ground-truth homography, so wrong-but-confident matches show up.
"""
import json, os, sys
import numpy as np
import requests

folder = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
api = sys.argv[2] if len(sys.argv) > 2 else "http://localhost:8000/api/v1/register"
gt = json.load(open(os.path.join(folder, "ground_truth.json")))


def true_errors(match_points, H):
    """Pixel distance between each returned ref point and where ground truth says it should be."""
    m = np.asarray(match_points, dtype=float)
    if m.size == 0:
        return np.array([])
    src = np.c_[m[:, 0], m[:, 1], np.ones(len(m))]
    proj = (np.asarray(H) @ src.T).T
    proj = proj[:, :2] / proj[:, 2:3]
    return np.linalg.norm(proj - m[:, 2:4], axis=1)


print(f"{'pair':18} {'status':9} {'inliers':>7} {'claimed RMSE':>13} {'true median':>12} {'true RMSE':>10} {'<3px':>6}")
for name, H in gt.items():
    ref = os.path.join(folder, f"{name}_ref.png")
    src = os.path.join(folder, f"{name}_src.png")
    if not (os.path.exists(ref) and os.path.exists(src)):
        continue
    with open(src, "rb") as fs, open(ref, "rb") as fr:
        r = requests.post(api, files={"source_image": (os.path.basename(src), fs, "image/png"),
                                      "reference_image": (os.path.basename(ref), fr, "image/png")},
                          timeout=600).json()
    m = r.get("metrics", {})
    e = true_errors(r.get("match_points", []), H)
    if len(e):
        print(f"{name:18} {r.get('status','?')[:9]:9} {m.get('inlier_count', 0):>7} {m.get('rmse', 0):>11.2f}px "
              f"{np.median(e):>10.2f}px {np.sqrt((e**2).mean()):>8.2f}px {100*(e<3).mean():>5.0f}%")
    else:
        print(f"{name:18} {r.get('status','?')[:9]:9} {m.get('inlier_count', 0):>7} {'-':>13} {'-':>12} {'-':>10} {'-':>6}")
