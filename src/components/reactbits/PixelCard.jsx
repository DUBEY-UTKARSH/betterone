import React, { useRef, useState, useEffect } from 'react';
import './PixelCard.css';

const PixelCard = ({
  children,
  variant = 'default',
  customColors = '#96D7C6,#7EC4B1,#D8D3CC',
  className = '',
  onClick
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const colors = customColors.split(',').map((c) => c.trim());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const pixelSize = 12;
    let gridPixels = [];

    const initPixels = () => {
      const cols = Math.ceil(canvas.width / pixelSize);
      const rows = Math.ceil(canvas.height / pixelSize);
      gridPixels = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          gridPixels.push({
            x: c * pixelSize,
            y: r * pixelSize,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.15
          });
        }
      }
    };

    initPixels();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gridPixels.forEach((p) => {
        if (isHovered) {
          p.alpha = Math.min(0.6, p.alpha + (Math.random() * 0.05 - 0.02));
        } else {
          p.alpha = Math.max(0.05, p.alpha - 0.02);
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, pixelSize - 1, pixelSize - 1);
      });
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, customColors]);

  return (
    <div
      ref={containerRef}
      className={`pixel-card-container ${className}`.trim()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <canvas ref={canvasRef} className="pixel-card-canvas" />
      <div className="pixel-card-content">{children}</div>
    </div>
  );
};

export default PixelCard;
