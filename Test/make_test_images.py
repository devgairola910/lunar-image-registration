#!/usr/bin/env python3
"""
Turn a raw Chandrayaan-2 OHRC .img (PDS4) into test pairs for ChandraDrishti.

Usage:
    python make_test_images.py path/to/ch2_ohr_..._d_img_d18.img [out_dir]

The .xml label next to the .img is read for the image size. The .img is
memory-mapped, so the 950 MB file is never fully loaded into RAM.

Every pair is <= 1200 px on its long side, so your backend's
resize_with_aspect_ratio() guardrail leaves it untouched and the ground-truth
homography in ground_truth.json stays valid in the PNG's own pixel coordinates.

ground_truth.json: H maps a SOURCE pixel (x, y) to the matching REFERENCE pixel.
"""
import json, os, re, sys
import numpy as np
import cv2

rng = np.random.default_rng(7)


def open_ohrc(img_path):
    xml_path = os.path.splitext(img_path)[0] + ".xml"
    txt = open(xml_path, encoding="utf-8", errors="ignore").read()
    lines = int(re.search(r"<axis_name>Line</axis_name>\s*<elements>(\d+)", txt).group(1))
    samples = int(re.search(r"<axis_name>Sample</axis_name>\s*<elements>(\d+)", txt).group(1))
    return np.memmap(img_path, dtype=np.uint8, mode="r", shape=(lines, samples))


def lit_segments(a, band=1000, min_mean=20):
    """Row ranges that actually contain sunlit terrain (much of an OHRC strip is black)."""
    means = [float(np.asarray(a[r:r + band:8, ::8]).mean()) for r in range(0, a.shape[0], band)]
    segs, start = [], None
    for i, m in enumerate(means):
        if m >= min_mean and start is None:
            start = i * band
        if m < min_mean and start is not None:
            segs.append((start, i * band)); start = None
    if start is not None:
        segs.append((start, a.shape[0]))
    return segs


def crop(a, r, c, h, w):
    return np.ascontiguousarray(a[r:r + h, c:c + w])


def H_scale(s):
    return np.diag([s, s, 1.0])


def H_rot_about(angle_deg, cx, cy):
    M = cv2.getRotationMatrix2D((cx, cy), angle_deg, 1.0)
    return np.vstack([M, [0, 0, 1]])


def H_shift(tx, ty):
    return np.array([[1, 0, tx], [0, 1, ty], [0, 0, 1.0]])


def warp(img, H_src_to_big, out_size):
    """Render `img` (big native window) into an out_size image. H maps out px -> big px."""
    return cv2.warpPerspective(img, np.linalg.inv(H_src_to_big), (out_size, out_size),
                               flags=cv2.INTER_LINEAR)


def change_illumination(img):
    """Crude stand-in for a different sun angle/sensor: gamma, contrast, gradient, noise, blur."""
    f = (img.astype(np.float32) / 255.0) ** 0.55
    f = 0.25 + 0.6 * f
    h, w = f.shape
    grad = np.linspace(0.75, 1.2, w, dtype=np.float32)[None, :] * np.linspace(1.1, 0.85, h, dtype=np.float32)[:, None]
    f = f * grad + rng.normal(0, 0.02, f.shape).astype(np.float32)
    f = cv2.GaussianBlur(f, (0, 0), 1.2)
    return (np.clip(f, 0, 1) * 255).astype(np.uint8)


def save(path, img):
    cv2.imwrite(path, img, [cv2.IMWRITE_PNG_COMPRESSION, 6])


def main():
    img_path = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else "lunar_test_images"
    os.makedirs(out, exist_ok=True)
    a = open_ohrc(img_path)
    print("image", a.shape, "lit segments:", lit_segments(a))

    # Two well-textured, fully-lit spots found by inspection of this scene
    # (rows are along-track, cols across-track). Change these for other scenes.
    R, C = 35300, 2500
    gt = {}

    # ---- 01: same resolution, shift + 6 deg rotation --------------------------------
    S = 1200
    big = crop(a, R, C, 2600, 2600)               # native window
    ref = big[300:300 + S, 300:300 + S]
    H_src_to_big = H_shift(300 + 90, 300 + 60) @ H_rot_about(6, S / 2, S / 2)
    src = warp(big, H_src_to_big, S)
    save(f"{out}/01_shift_rotate_ref.png", ref); save(f"{out}/01_shift_rotate_src.png", src)
    gt["01_shift_rotate"] = (H_shift(-300, -300) @ H_src_to_big).tolist()

    # ---- 02: as 01 but different illumination / noise on the source ------------------
    H2 = H_shift(300 - 70, 300 + 110) @ H_rot_about(-4, S / 2, S / 2)
    src2 = change_illumination(warp(big, H2, S))
    save(f"{out}/02_illumination_ref.png", ref); save(f"{out}/02_illumination_src.png", src2)
    gt["02_illumination"] = (H_shift(-300, -300) @ H2).tolist()

    # ---- 03: scale change 4x (coarse reference vs fine source) -----------------------
    W = 4800
    wide = crop(a, 34000, 1500, W, W)
    ref3 = cv2.resize(wide, (1200, 1200), interpolation=cv2.INTER_AREA)   # 4 native px -> 1 px
    Hs = H_shift(1700, 1900) @ H_rot_about(3, 500, 500)                   # 1000px src inside wide window
    src3 = warp(wide, Hs, 1000)
    save(f"{out}/03_scale4x_ref.png", ref3); save(f"{out}/03_scale4x_src.png", src3)
    gt["03_scale4x"] = (H_scale(0.25) @ Hs).tolist()

    # ---- 04: native crop vs the mission's own 10x browse product (different stretch) --
    br = cv2.imread(os.path.join(os.path.dirname(img_path), "..", "..", "..", "browse", "calibrated",
                                 "20211228", "ch2_ohr_ncp_20211228T2209123959_b_brw_d18.png"), 0)
    if br is not None:
        r0, c0 = 3350, 50                        # browse px; native = x10
        ref4 = br[r0:r0 + 500, c0:c0 + 500]
        nat = crop(a, r0 * 10 + 500, c0 * 10 + 500, 4000, 4000)
        src4 = cv2.resize(nat, (1000, 1000), interpolation=cv2.INTER_AREA)  # 4 native px -> 1 px
        save(f"{out}/04_browse_ref.png", ref4); save(f"{out}/04_browse_src.png", src4)
        # src px -> native offset by (500,500) -> /10 -> browse crop coords
        gt["04_browse"] = (H_scale(0.1) @ H_shift(500, 500) @ H_scale(4)).tolist()
    else:
        print("browse PNG not found next to the data folder - skipped pair 04")

    json.dump(gt, open(f"{out}/ground_truth.json", "w"), indent=2)
    print("wrote", out)


if __name__ == "__main__":
    main()
