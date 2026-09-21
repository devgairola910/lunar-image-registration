// High-Fidelity Monochrome Lunar Surface Imagery Generator
// Generates realistic panchromatic optical orbiter imagery (ISRO OHRC / TMC-2 style)

export interface LunarFeatureConfig {
  seed: number;
  width: number;
  height: number;
  sunElevation: number; // 0 to 90 degrees
  sunAzimuth: number; // degrees
  resolutionScale: number; // 1.0 for normal, 0.5 or 2.0 for scale variations
  rotationDeg: number;
  offsetX: number;
  offsetY: number;
  craterPreset: 'shackleton' | 'tycho' | 'mare_imbrium' | 'aristarchus';
  sensorNoiseLevel: number;
  contrastBoost: number;
}

export function generateLunarCanvas(config: LunarFeatureConfig): string {
  const canvas = document.createElement('canvas');
  canvas.width = config.width;
  canvas.height = config.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const { width, height, sunElevation, sunAzimuth, rotationDeg, offsetX, offsetY, craterPreset } = config;

  // Base regolith albedo: stark monochrome grey
  const isMare = craterPreset === 'mare_imbrium';
  const baseRegolithTone = isMare ? 38 : 68; // Mare basalt is darker, highlands brighter
  ctx.fillStyle = `rgb(${baseRegolithTone}, ${baseRegolithTone}, ${baseRegolithTone})`;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(width / 2 + offsetX, height / 2 + offsetY);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.scale(config.resolutionScale, config.resolutionScale);
  ctx.translate(-width / 2, -height / 2);

  // Shadow length inversely proportional to sun elevation (real solar ray angle)
  const shadowLength = Math.max(0.08, (90 - sunElevation) / 28);
  const sunRad = (sunAzimuth * Math.PI) / 180;
  const sunDx = Math.cos(sunRad);
  const sunDy = Math.sin(sunRad);

  // Deterministic PRNG
  let s = config.seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  // Craters configuration
  let craters: { x: number; y: number; r: number; depth: number; hasPeak?: boolean; hasRays?: boolean }[] = [];

  if (craterPreset === 'shackleton') {
    // Polar complex rim with deep pitch black PSR shadows
    craters = [
      { x: width * 0.5, y: height * 0.5, r: width * 0.29, depth: 1.8, hasPeak: false },
      { x: width * 0.24, y: height * 0.28, r: width * 0.08, depth: 0.9 },
      { x: width * 0.74, y: height * 0.66, r: width * 0.065, depth: 0.8 },
      { x: width * 0.36, y: height * 0.76, r: width * 0.045, depth: 0.6 },
      { x: width * 0.68, y: height * 0.24, r: width * 0.05, depth: 0.7 },
      { x: width * 0.18, y: height * 0.62, r: width * 0.035, depth: 0.5 },
    ];
  } else if (craterPreset === 'tycho') {
    // Prominent central peak and bright radial ejecta rays
    craters = [
      { x: width * 0.48, y: height * 0.52, r: width * 0.33, depth: 1.7, hasPeak: true, hasRays: true },
      { x: width * 0.82, y: height * 0.34, r: width * 0.075, depth: 0.9 },
      { x: width * 0.18, y: height * 0.76, r: width * 0.085, depth: 0.8 },
      { x: width * 0.32, y: height * 0.18, r: width * 0.045, depth: 0.5 },
      { x: width * 0.78, y: height * 0.78, r: width * 0.05, depth: 0.6 },
    ];
  } else if (craterPreset === 'mare_imbrium') {
    // Basalt plain with small sharp impact craters and ejecta halos
    craters = [
      { x: width * 0.42, y: height * 0.45, r: width * 0.18, depth: 1.1, hasPeak: false, hasRays: true },
      { x: width * 0.72, y: height * 0.6, r: width * 0.12, depth: 0.85 },
      { x: width * 0.22, y: height * 0.32, r: width * 0.075, depth: 0.7 },
      { x: width * 0.62, y: height * 0.2, r: width * 0.055, depth: 0.5 },
      { x: width * 0.82, y: height * 0.8, r: width * 0.065, depth: 0.6 },
    ];
  } else {
    // Aristarchus high-albedo plateau
    craters = [
      { x: width * 0.52, y: height * 0.48, r: width * 0.26, depth: 1.6, hasPeak: true, hasRays: true },
      { x: width * 0.28, y: height * 0.66, r: width * 0.11, depth: 0.9 },
      { x: width * 0.76, y: height * 0.26, r: width * 0.085, depth: 0.75 },
    ];
  }

  // Draw authentic ejecta rays (monochrome high-albedo dust)
  craters.forEach(crater => {
    if (crater.hasRays) {
      const rayCount = 22;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + (rand() - 0.5) * 0.25;
        const length = crater.r * (2.4 + rand() * 2.0);
        const grad = ctx.createLinearGradient(
          crater.x, crater.y,
          crater.x + Math.cos(angle) * length,
          crater.y + Math.sin(angle) * length
        );
        grad.addColorStop(0, 'rgba(235, 235, 240, 0.45)');
        grad.addColorStop(0.4, 'rgba(200, 200, 205, 0.18)');
        grad.addColorStop(1, 'rgba(150, 150, 155, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2 + rand() * 5;
        ctx.beginPath();
        ctx.moveTo(crater.x + Math.cos(angle) * crater.r * 0.85, crater.y + Math.sin(angle) * crater.r * 0.85);
        ctx.lineTo(crater.x + Math.cos(angle) * length, crater.y + Math.sin(angle) * length);
        ctx.stroke();
      }
    }
  });

  // Draw realistic crater topography and deep pitch black shadow relief
  craters.forEach(crater => {
    // 1. Crater Outer Raised Rim (Illuminated Crest vs Ambient Falloff)
    const rimGrad = ctx.createLinearGradient(
      crater.x - sunDx * crater.r * 1.25,
      crater.y - sunDy * crater.r * 1.25,
      crater.x + sunDx * crater.r * 1.25,
      crater.y + sunDy * crater.r * 1.25
    );
    // Sunward outer wall is illuminated brightly, opposite outer flank falls off
    rimGrad.addColorStop(0, 'rgba(245, 245, 248, 0.95)');
    rimGrad.addColorStop(0.35, 'rgba(180, 180, 185, 0.7)');
    rimGrad.addColorStop(0.65, 'rgba(60, 60, 65, 0.85)');
    rimGrad.addColorStop(1, 'rgba(12, 12, 14, 0.98)');

    ctx.fillStyle = rimGrad;
    ctx.beginPath();
    ctx.arc(crater.x, crater.y, crater.r * 1.1, 0, Math.PI * 2);
    ctx.fill();

    // 2. Crater Floor
    const floorTone = Math.max(10, baseRegolithTone - 18);
    ctx.fillStyle = `rgb(${floorTone}, ${floorTone}, ${floorTone})`;
    ctx.beginPath();
    ctx.arc(crater.x, crater.y, crater.r * 0.9, 0, Math.PI * 2);
    ctx.fill();

    // 3. Deep Pitch-Black Crater Interior Cast Shadow
    const shadowGrad = ctx.createRadialGradient(
      crater.x - sunDx * crater.r * 0.45,
      crater.y - sunDy * crater.r * 0.45,
      crater.r * 0.05,
      crater.x - sunDx * crater.r * 0.25,
      crater.y - sunDy * crater.r * 0.25,
      crater.r * (0.85 + shadowLength * 0.28)
    );
    shadowGrad.addColorStop(0, '#000000');
    shadowGrad.addColorStop(0.6, '#020202');
    shadowGrad.addColorStop(0.85, 'rgba(15, 15, 18, 0.95)');
    shadowGrad.addColorStop(1, 'rgba(30, 30, 35, 0)');

    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(crater.x, crater.y, crater.r * 0.9, 0, Math.PI * 2);
    ctx.fill();

    // 4. Central Uplift Peak (if present)
    if (crater.hasPeak) {
      const peakR = crater.r * 0.22;
      const peakGrad = ctx.createLinearGradient(
        crater.x - sunDx * peakR,
        crater.y - sunDy * peakR,
        crater.x + sunDx * peakR * 2,
        crater.y + sunDy * peakR * 2
      );
      peakGrad.addColorStop(0, '#ffffff');
      peakGrad.addColorStop(0.4, 'rgba(190, 190, 195, 0.85)');
      peakGrad.addColorStop(0.7, '#08080a');
      peakGrad.addColorStop(1, '#000000');

      ctx.fillStyle = peakGrad;
      ctx.beginPath();
      ctx.arc(crater.x, crater.y, peakR, 0, Math.PI * 2);
      ctx.fill();
    }

    // Micro-craters along terraced rim walls
    for (let j = 0; j < 5; j++) {
      const mAngle = rand() * Math.PI * 2;
      const mDist = crater.r * (0.82 + rand() * 0.42);
      const mx = crater.x + Math.cos(mAngle) * mDist;
      const my = crater.y + Math.sin(mAngle) * mDist;
      const mr = crater.r * (0.04 + rand() * 0.06);

      ctx.fillStyle = '#050507';
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(230, 230, 235, 0.8)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(mx - sunDx * mr * 0.4, my - sunDy * mr * 0.4, mr * 0.9, 0, Math.PI);
      ctx.stroke();
    }
  });

  // Scattered background regolith micro-impacts
  for (let k = 0; k < 45; k++) {
    const rx = rand() * width;
    const ry = rand() * height;
    const rr = 2 + rand() * 5;

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(rx, ry, rr, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(220, 220, 225, 0.5)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(rx - sunDx * rr * 0.4, ry - sunDy * rr * 0.4, rr * 0.85, 0, Math.PI);
    ctx.stroke();
  }

  ctx.restore();

  // Fine detector line-scan calibration marks (ISRO OHRC / TMC-2 pushbroom detector raster)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.012)';
  for (let y = 0; y < height; y += 3) {
    ctx.fillRect(0, y, width, 1);
  }

  // Optical crosshair fiducial center mark
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  const fiducialLen = 10;
  ctx.beginPath();
  ctx.moveTo(width / 2 - fiducialLen, height / 2);
  ctx.lineTo(width / 2 + fiducialLen, height / 2);
  ctx.moveTo(width / 2, height / 2 - fiducialLen);
  ctx.lineTo(width / 2, height / 2 + fiducialLen);
  ctx.stroke();

  return canvas.toDataURL('image/png');
}
