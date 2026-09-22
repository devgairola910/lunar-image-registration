export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/tiff',
  'image/geotiff',
  'image/x-tiff'
];

export const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff'];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeInMB} MB) exceeds maximum allowed limit of ${MAX_FILE_SIZE_MB} MB.`
    };
  }

  // Check MIME type or Extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isValidMime = ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) || file.type.startsWith('image/');
  const isValidExt = ALLOWED_EXTENSIONS.includes(extension);

  if (!isValidMime && !isValidExt) {
    return {
      valid: false,
      error: `Invalid file format "${extension || file.type}". Only image files (.png, .jpg, .tiff, .webp) are supported.`
    };
  }

  return { valid: true };
}

export function clampNumber(val: number, min: number, max: number): number {
  if (isNaN(val)) return min;
  return Math.min(Math.max(val, min), max);
}

export interface MetadataValidationResult {
  lat: { valid: boolean; message?: string };
  lon: { valid: boolean; message?: string };
  resolution: { valid: boolean; message?: string };
  sunElevation: { valid: boolean; message?: string };
  phaseAngle?: { valid: boolean; message?: string };
}

export function validateMetadataValues(
  lat: number,
  lon: number,
  resolution: number,
  sunElevation: number,
  phaseAngle?: number
): MetadataValidationResult {
  return {
    lat: {
      valid: !isNaN(lat) && lat >= -90 && lat <= 90,
      message: lat < -90 || lat > 90 ? 'Latitude must be between -90° and +90°' : undefined
    },
    lon: {
      valid: !isNaN(lon) && lon >= -180 && lon <= 180,
      message: lon < -180 || lon > 180 ? 'Longitude must be between -180° and +180°' : undefined
    },
    resolution: {
      valid: !isNaN(resolution) && resolution > 0 && resolution <= 500,
      message: resolution <= 0 ? 'Resolution must be > 0 m/px' : resolution > 500 ? 'Resolution exceeds max 500 m/px' : undefined
    },
    sunElevation: {
      valid: !isNaN(sunElevation) && sunElevation >= 0 && sunElevation <= 90,
      message: sunElevation < 0 || sunElevation > 90 ? 'Sun elevation must be 0° - 90°' : undefined
    },
    phaseAngle: phaseAngle !== undefined ? {
      valid: !isNaN(phaseAngle) && phaseAngle >= 0 && phaseAngle <= 180,
      message: phaseAngle < 0 || phaseAngle > 180 ? 'Phase angle must be 0° - 180°' : undefined
    } : undefined
  };
}
