import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { ViewMode } from './ViewerControls';
import type { KeypointMatch, TileHeatmapCell, ImageMetadata } from '../../types/registration';
import { Crosshair, Move } from 'lucide-react';

interface LunarCanvasViewerProps {
  sourceMeta: ImageMetadata;
  referenceMeta: ImageMetadata;
  keypoints: KeypointMatch[];
  tileHeatmap: TileHeatmapCell[][];
  viewMode: ViewMode;
  zoom: number;
  showKeypoints: boolean;
  keypointFilter: 'all' | 'inliers' | 'outliers';
  showTileGrid: boolean;
  showHeatmap: boolean;
  blendOpacity: number;
  splitPosition: number;
  onSplitPositionChange: (pos: number) => void;
  selectedKeypointId?: number;
  onSelectKeypoint?: (id?: number) => void;
  onZoomChange?: (zoom: number) => void;
}

export const LunarCanvasViewer: React.FC<LunarCanvasViewerProps> = ({
  sourceMeta,
  referenceMeta,
  keypoints,
  tileHeatmap,
  viewMode,
  zoom,
  showKeypoints,
  keypointFilter,
  showTileGrid,
  showHeatmap,
  blendOpacity,
  splitPosition,
  onSplitPositionChange,
  selectedKeypointId,
  onSelectKeypoint,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingPan, setIsDraggingPan] = useState(false);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursorCoord, setCursorCoord] = useState<{ x: number; y: number } | null>(null);
  const [hoveredKeypoint, setHoveredKeypoint] = useState<KeypointMatch | null>(null);

  const sourceImgRef = useRef<HTMLImageElement | null>(null);
  const refImgRef = useRef<HTMLImageElement | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Load images
  useEffect(() => {
    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount >= 2) setImagesLoaded(true);
    };

    if (sourceMeta.previewUrl) {
      const srcImg = new Image();
      srcImg.crossOrigin = 'anonymous';
      srcImg.src = sourceMeta.previewUrl;
      srcImg.onload = () => {
        sourceImgRef.current = srcImg;
        checkLoaded();
      };
    }

    if (referenceMeta.previewUrl) {
      const refImg = new Image();
      refImg.crossOrigin = 'anonymous';
      refImg.src = referenceMeta.previewUrl;
      refImg.onload = () => {
        refImgRef.current = refImg;
        checkLoaded();
      };
    }
  }, [sourceMeta.previewUrl, referenceMeta.previewUrl]);

  // Calculate aspect ratio & dimensions helper
  const getImageDimensions = useCallback((canvasWidth: number, canvasHeight: number) => {
    const srcImg = sourceImgRef.current;
    const refImg = refImgRef.current;
    const naturalW = refImg?.naturalWidth || srcImg?.naturalWidth || 600;
    const naturalH = refImg?.naturalHeight || srcImg?.naturalHeight || 600;
    const imgAspectRatio = naturalW / naturalH;

    let imgW = canvasWidth * 0.94;
    let imgH = imgW / imgAspectRatio;
    if (imgH > canvasHeight * 0.90) {
      imgH = canvasHeight * 0.90;
      imgW = imgH * imgAspectRatio;
    }
    const imgX = (canvasWidth - imgW) / 2;
    const imgY = (canvasHeight - imgH) / 2;

    return { imgX, imgY, imgW, imgH, imgAspectRatio };
  }, []);

  // Main Canvas Render Loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Deep black space background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const srcImg = sourceImgRef.current;
    const refImg = refImgRef.current;

    if (!imagesLoaded || !srcImg || !refImg) {
      ctx.fillStyle = '#71717a';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Loading Lunar Telemetry Frames...', width / 2, height / 2);
      return;
    }

    // High quality interpolation for real lunar sensor imagery
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.save();
    // Apply pan & zoom
    ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    const { imgX, imgY, imgW, imgH, imgAspectRatio } = getImageDimensions(width, height);

    if (viewMode === 'sideBySide') {
      // Side by Side Mode
      const maxHalfW = (width - 32) / 2;
      let halfW = maxHalfW;
      let halfH = halfW / imgAspectRatio;
      if (halfH > height * 0.88) {
        halfH = height * 0.88;
        halfW = halfH * imgAspectRatio;
      }
      const leftX = width / 2 - halfW - 8;
      const rightX = width / 2 + 8;
      const y = (height - halfH) / 2;

      // Source Left
      ctx.drawImage(srcImg, leftX, y, halfW, halfH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(leftX, y, halfW, halfH);

      // Label Left
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(leftX + 6, y + 6, 130, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`SRC: ${sourceMeta.sensorType}`, leftX + 10, y + 20);

      // Reference Right
      ctx.drawImage(refImg, rightX, y, halfW, halfH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(rightX, y, halfW, halfH);

      // Label Right
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(rightX + 6, y + 6, 130, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`REF: ${referenceMeta.sensorType}`, rightX + 10, y + 20);

    } else if (viewMode === 'split') {
      // Split Wipe Slider Mode
      // Draw reference base image
      ctx.drawImage(refImg, imgX, imgY, imgW, imgH);

      // Clip and draw source registered image on the left portion
      const splitX = imgX + imgW * splitPosition;

      ctx.save();
      ctx.beginPath();
      ctx.rect(imgX, imgY, imgW * splitPosition, imgH);
      ctx.clip();
      ctx.drawImage(srcImg, imgX, imgY, imgW, imgH);
      ctx.restore();

      // Draw Split line (Crisp white hairline)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(splitX, imgY);
      ctx.lineTo(splitX, imgY + imgH);
      ctx.stroke();

      // Draw Split handle circle
      ctx.fillStyle = '#09090b';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(splitX, imgY + imgH / 2, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(splitX, imgY + imgH / 2, 3, 0, Math.PI * 2);
      ctx.fill();

      // Badges
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(imgX + 8, imgY + 8, 100, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`SRC (CH-2)`, imgX + 12, imgY + 22);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(imgX + imgW - 100, imgY + 8, 92, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`REF (ISRO)`, imgX + imgW - 88, imgY + 22);

    } else if (viewMode === 'blend') {
      // Overlay Blend Mode
      ctx.drawImage(refImg, imgX, imgY, imgW, imgH);

      ctx.save();
      ctx.globalAlpha = blendOpacity;
      ctx.drawImage(srcImg, imgX, imgY, imgW, imgH);
      ctx.restore();

    } else if (viewMode === 'difference') {
      // Difference / Checkerboard Mask
      ctx.drawImage(refImg, imgX, imgY, imgW, imgH);

      // Overlay difference blend mode
      ctx.save();
      ctx.globalCompositeOperation = 'difference';
      ctx.drawImage(srcImg, imgX, imgY, imgW, imgH);
      ctx.restore();

    } else if (viewMode === 'vectors') {
      // Match Vectors Mode (Base Reference with Vector Overlay)
      ctx.drawImage(refImg, imgX, imgY, imgW, imgH);

      // Darken slightly for high contrast lines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(imgX, imgY, imgW, imgH);
    }

    // Outer HUD frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(imgX, imgY, imgW, imgH);

    // 8x8 Spatial Tile Grid Overlay
    if (showTileGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 3]);

      for (let i = 1; i < 8; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(imgX + (imgW / 8) * i, imgY);
        ctx.lineTo(imgX + (imgW / 8) * i, imgY + imgH);
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(imgX, imgY + (imgH / 8) * i);
        ctx.lineTo(imgX + imgW, imgY + (imgH / 8) * i);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Spatial Heatmap Overlay
    if (showHeatmap && tileHeatmap.length > 0) {
      const cellW = imgW / 8;
      const cellH = imgH / 8;

      tileHeatmap.forEach(row => {
        row.forEach(cell => {
          if (cell.matchCount > 0) {
            const alpha = Math.min(0.55, 0.08 + cell.densityScore * 0.45);
            ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
            ctx.fillRect(imgX + cell.col * cellW, imgY + cell.row * cellH, cellW, cellH);

            ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
            ctx.strokeRect(imgX + cell.col * cellW, imgY + cell.row * cellH, cellW, cellH);
          }
        });
      });
    }

    // Draw Vector Lines if in Vectors mode
    if (viewMode === 'vectors') {
      keypoints.forEach(kp => {
        if (keypointFilter === 'inliers' && !kp.isInlier) return;
        if (keypointFilter === 'outliers' && kp.isInlier) return;

        const sx = imgX + (kp.srcX / 600) * imgW;
        const sy = imgY + (kp.srcY / 600) * imgH;
        const rx = imgX + (kp.refX / 600) * imgW;
        const ry = imgY + (kp.refY / 600) * imgH;

        ctx.strokeStyle = kp.isInlier ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.6)';
        ctx.lineWidth = kp.isInlier ? 1.2 : 0.8;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(rx, ry);
        ctx.stroke();
      });
    }

    // Keypoints Points Overlay
    if (showKeypoints) {
      keypoints.forEach(kp => {
        if (keypointFilter === 'inliers' && !kp.isInlier) return;
        if (keypointFilter === 'outliers' && kp.isInlier) return;

        const px = imgX + (kp.refX / 600) * imgW;
        const py = imgY + (kp.refY / 600) * imgH;

        const isSelected = selectedKeypointId === kp.id;
        const isHovered = hoveredKeypoint?.id === kp.id;

        if (kp.isInlier) {
          // Inlier: Clean Emerald / White Point
          ctx.fillStyle = isSelected ? '#ffffff' : isHovered ? '#60a5fa' : '#22c55e';
          ctx.beginPath();
          ctx.arc(px, py, isSelected ? 3.5 : 2, 0, Math.PI * 2);
          ctx.fill();

          // Reticle ring if selected or hovered
          if (isSelected || isHovered) {
            ctx.strokeStyle = isSelected ? '#ffffff' : '#60a5fa';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(px, py, 8, 0, Math.PI * 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(px - 12, py);
            ctx.lineTo(px + 12, py);
            ctx.moveTo(px, py - 12);
            ctx.lineTo(px, py + 12);
            ctx.stroke();
          }
        } else {
          // Outlier: Subtle red circle
          ctx.strokeStyle = isSelected ? '#ffffff' : '#ef4444';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(px, py, isSelected ? 3.5 : 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    }

    ctx.restore();
  }, [
    imagesLoaded,
    getImageDimensions,
    viewMode,
    zoom,
    pan,
    splitPosition,
    blendOpacity,
    showKeypoints,
    keypointFilter,
    showTileGrid,
    showHeatmap,
    keypoints,
    tileHeatmap,
    selectedKeypointId,
    hoveredKeypoint,
    sourceMeta,
    referenceMeta
  ]);

  // Canvas Resize and Render
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      render();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  useEffect(() => {
    render();
  }, [render]);

  // Mouse Interaction (Pan, Split Slider Drag, Hover & Click Keypoint)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    // Check if clicking near the split slider line in 'split' mode
    if (viewMode === 'split') {
      const { imgX: baseImgX, imgW } = getImageDimensions(canvas.width, canvas.height);
      const imgX = baseImgX + pan.x;
      const splitX = imgX + imgW * splitPosition;

      if (Math.abs(mouseX - splitX) < 25) {
        setIsDraggingSplit(true);
        return;
      }
    }

    // Otherwise initiate pan drag
    setIsDraggingPan(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const { imgX: baseImgX, imgY: baseImgY, imgW, imgH } = getImageDimensions(canvas.width, canvas.height);
    const imgX = baseImgX + pan.x;
    const imgY = baseImgY + pan.y;

    // Calculate pixel coordinates relative to 600x600 image space
    const imagePixelX = Math.round(((mouseX - imgX) / (imgW * zoom)) * 600);
    const imagePixelY = Math.round(((mouseY - imgY) / (imgH * zoom)) * 600);

    if (imagePixelX >= 0 && imagePixelX <= 600 && imagePixelY >= 0 && imagePixelY <= 600) {
      setCursorCoord({ x: imagePixelX, y: imagePixelY });
    } else {
      setCursorCoord(null);
    }

    // Handle Split Slider Drag
    if (isDraggingSplit && viewMode === 'split') {
      const newPos = Math.max(0.02, Math.min(0.98, (mouseX - imgX) / imgW));
      onSplitPositionChange(newPos);
      return;
    }

    // Handle Pan Drag
    if (isDraggingPan) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      return;
    }

    // Check for hovered keypoint
    if (showKeypoints && keypoints.length > 0) {
      const hitRadius = 10;
      const found = keypoints.find(kp => {
        const px = imgX + (kp.refX / 600) * imgW * zoom;
        const py = imgY + (kp.refY / 600) * imgH * zoom;
        const dist = Math.hypot(mouseX - px, mouseY - py);
        return dist < hitRadius;
      });
      setHoveredKeypoint(found || null);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingPan(false);
    setIsDraggingSplit(false);
  };

  const handleClick = () => {
    if (hoveredKeypoint && onSelectKeypoint) {
      onSelectKeypoint(hoveredKeypoint.id);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[540px] sm:h-[620px] rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl group cursor-crosshair select-none"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          setCursorCoord(null);
          setHoveredKeypoint(null);
        }}
        onClick={handleClick}
        className="w-full h-full block"
      />

      {/* Floating Cursor Telemetry HUD Pill */}
      <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/90 border border-white/10 text-[11px] font-mono text-regolith-300 flex items-center space-x-3 pointer-events-none backdrop-blur-md">
        <div className="flex items-center space-x-1 text-regolith-100">
          <Crosshair className="w-3.5 h-3.5" />
          <span>CURSOR:</span>
        </div>
        {cursorCoord ? (
          <span className="text-white font-bold">
            X: {cursorCoord.x} px | Y: {cursorCoord.y} px
          </span>
        ) : (
          <span className="text-regolith-600">OFF TARGET</span>
        )}
        <span className="text-regolith-700">|</span>
        <span className="text-regolith-400">
          ZOOM: <strong className="text-white">{Math.round(zoom * 100)}%</strong>
        </span>
      </div>

      {/* Hovered Keypoint Telemetry Tooltip */}
      {hoveredKeypoint && (
        <div className="absolute top-4 right-4 p-3 rounded-lg mission-card border border-white/20 text-xs font-mono text-regolith-200 pointer-events-none z-30 shadow-2xl space-y-1">
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <span className="font-bold text-white">POINT #{hoveredKeypoint.id}</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                hoveredKeypoint.isInlier
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {hoveredKeypoint.isInlier ? 'INLIER' : 'OUTLIER'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 text-[11px]">
            <span className="text-regolith-400">Source:</span>
            <span className="text-white">({hoveredKeypoint.srcX}, {hoveredKeypoint.srcY})</span>
            <span className="text-regolith-400">Reference:</span>
            <span className="text-white">({hoveredKeypoint.refX}, {hoveredKeypoint.refY})</span>
            <span className="text-regolith-400">Residual:</span>
            <span className="text-white font-bold">{hoveredKeypoint.residualError} px</span>
            <span className="text-regolith-400">Confidence:</span>
            <span className="text-emerald-400 font-bold">{(hoveredKeypoint.confidence * 100).toFixed(1)}%</span>
          </div>
        </div>
      )}

      {/* Pan hint badge */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 border border-white/10 text-[10px] font-mono text-regolith-400 flex items-center space-x-1.5 pointer-events-none">
        <Move className="w-3 h-3 text-regolith-500" />
        <span>Drag to Pan • Click Point to Inspect</span>
      </div>
    </div>
  );
};
