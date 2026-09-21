# ChandraDrishti test images (from your Chandrayaan-2 OHRC scene)

The `.img` in your download is a raw 12000 x 79796 8-bit array (PDS4). It isn't an image
your app can upload, and ~70% of the strip is black (night side). These PNGs are crops
of the two sunlit, textured areas, all <= 1200 px on the long side so your backend's
resize guardrail doesn't touch them.

| pair | what it tests | how it was made |
|---|---|---|
| 01_shift_rotate | basic registration, 6 deg rotation + shift | two overlapping native crops of the real image |
| 02_illumination | different lighting/sensor look | as 01, source gets gamma/contrast change, gradient, noise, blur (synthetic) |
| 03_scale4x | resolution mismatch (like OHRC vs TMC) | reference = 4x downsampled wide area, source = native crop inside it |
| 04_browse | different product/stretch | source = native crop, reference = the mission's own browse PNG (very washed out; hardest) |

Upload `*_src.png` as **source** and `*_ref.png` as **reference**.

`ground_truth.json` holds, per pair, the exact 3x3 homography mapping source pixels -> reference pixels.
`score_against_truth.py` sends every pair to your running API and reports the real error,
not just the RMSE the app claims. `make_test_images.py` regenerates all of this from the .img
(and lets you cut new crops).

Caveat: these are synthetic pairs derived from one scene. They prove the pipeline recovers
a known transform; they are not real OHRC-vs-TMC/IIRS pairs.
