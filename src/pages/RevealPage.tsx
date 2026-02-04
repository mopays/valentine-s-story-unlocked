import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import FloatingHearts from '@/components/FloatingHearts';

const RevealPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealPercentage, setRevealPercentage] = useState(0);
  const isDrawingRef = useRef(false);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create romantic gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#e8b4b8');
    gradient.addColorStop(0.5, '#d4a5a5');
    gradient.addColorStop(1, '#c9979a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some decorative hearts
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 10 + Math.random() * 20;
      drawHeart(ctx, x, y, size);
    }

    // Add hint text
    ctx.font = 'bold 18px "Noto Sans Thai"';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.textAlign = 'center';
    ctx.fillText('✨ ลากนิ้วเพื่อเปิดดู ✨', canvas.width / 2, canvas.height / 2);
  }, []);

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
    ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size);
    ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
    ctx.fill();
  };

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, [initCanvas]);

  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    
    // Create soft circular brush
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // Calculate reveal percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 128) {
        transparentPixels++;
      }
    }
    const percentage = (transparentPixels / (canvas.width * canvas.height)) * 100;
    setRevealPercentage(percentage);

    if (percentage > 60 && !isRevealed) {
      setIsRevealed(true);
    }
  }, [isRevealed]);

  const getPosition = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDrawingRef.current = true;
    const pos = getPosition(e);
    scratch(pos.x, pos.y);
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const pos = getPosition(e);
    scratch(pos.x, pos.y);
  };

  const handleEnd = () => {
    isDrawingRef.current = false;
  };

  return (
    <div className="min-h-screen bg-romantic flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <FloatingHearts />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-serif text-2xl text-foreground mb-2">
            {isRevealed ? '💕 เซอร์ไพรส์! 💕' : '✨ ขูดเพื่อเปิดเผย ✨'}
          </h1>
          {!isRevealed && (
            <p className="text-muted-foreground text-sm">
              ลากนิ้วบนรูปภาพเพื่อดูสิ่งที่ซ่อนอยู่
            </p>
          )}
        </div>

        {/* Scratch Area */}
        <div 
          ref={containerRef}
          className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Hidden Image */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-light via-blush to-rose-light flex items-center justify-center">
            <div className="text-center p-6">
              <Heart className="w-24 h-24 mx-auto mb-4 text-rose-dark fill-rose animate-heartbeat" />
              <p className="font-serif text-2xl text-foreground mb-2">รักนะ ❤️</p>
              <p className="text-muted-foreground">เธอคือคนพิเศษของฉัน</p>
            </div>
          </div>

          {/* Scratch Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 touch-none cursor-crosshair"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          />
        </div>

        {/* Progress */}
        {!isRevealed && (
          <div className="mt-4">
            <div className="h-2 bg-rose-light/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose to-rose-dark transition-all duration-300"
                style={{ width: `${Math.min(revealPercentage * 1.5, 100)}%` }}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              {Math.round(Math.min(revealPercentage * 1.5, 100))}% เปิดเผยแล้ว
            </p>
          </div>
        )}

        {/* Continue Button */}
        {isRevealed && (
          <div className="mt-8 animate-fade-in-up">
            <button
              onClick={() => navigate('/gallery')}
              className="love-button w-full flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              <span>ดูรูปภาพของเรา</span>
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevealPage;
