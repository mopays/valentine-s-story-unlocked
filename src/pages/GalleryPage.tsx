import { useState, useRef } from 'react';
import { Heart, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import FloatingHearts from '@/components/FloatingHearts';

// Sample gallery images - replace with your own images
const galleryImages = [
  {
    id: 1,
    caption: 'ความทรงจำแรกของเรา',
    bgColor: 'from-rose-light to-blush',
  },
  {
    id: 2,
    caption: 'วันที่เราไปเที่ยวด้วยกัน',
    bgColor: 'from-blush to-rose-light',
  },
  {
    id: 3,
    caption: 'ช่วงเวลาพิเศษ',
    bgColor: 'from-rose to-rose-light',
  },
  {
    id: 4,
    caption: 'วันครบรอบของเรา',
    bgColor: 'from-rose-light via-blush to-rose-light',
  },
  {
    id: 5,
    caption: 'รักนะที่รัก 💕',
    bgColor: 'from-rose-dark to-rose',
  },
];

const GalleryPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < galleryImages.length - 1 ? prev + 1 : prev));
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (Math.abs(translateX) > 80) {
      if (translateX > 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (translateX < 0 && currentIndex < galleryImages.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }
    
    setTranslateX(0);
  };

  return (
    <div className="min-h-screen bg-romantic flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <FloatingHearts />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-serif text-2xl text-foreground mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-gold" />
            รูปภาพของเรา
            <Sparkles className="w-6 h-6 text-gold" />
          </h1>
          <p className="text-muted-foreground text-sm">
            เลื่อนเพื่อดูรูปถัดไป
          </p>
        </div>

        {/* Image Counter */}
        <div className="flex justify-center gap-2 mb-4">
          {galleryImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-rose-dark' 
                  : 'bg-rose-light'
              }`}
            />
          ))}
        </div>

        {/* Gallery Container */}
        <div 
          ref={containerRef}
          className="relative overflow-hidden rounded-2xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{ 
              transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            {galleryImages.map((image) => (
              <div 
                key={image.id} 
                className="w-full flex-shrink-0"
              >
                <div 
                  className={`aspect-[3/4] rounded-2xl bg-gradient-to-br ${image.bgColor} flex flex-col items-center justify-center p-8 shadow-xl`}
                >
                  {/* Placeholder for actual image */}
                  <div className="w-32 h-32 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mb-6">
                    <Heart className="w-16 h-16 text-rose-dark fill-rose animate-heartbeat" />
                  </div>
                  
                  <p className="font-serif text-xl text-foreground text-center">
                    {image.caption}
                  </p>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    รูปที่ {image.id} จาก {galleryImages.length}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              currentIndex === 0 
                ? 'bg-muted text-muted-foreground opacity-50' 
                : 'bg-rose-light hover:bg-rose text-rose-dark hover:text-white'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === galleryImages.length - 1}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              currentIndex === galleryImages.length - 1 
                ? 'bg-muted text-muted-foreground opacity-50' 
                : 'bg-rose-light hover:bg-rose text-rose-dark hover:text-white'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Final Message */}
        {currentIndex === galleryImages.length - 1 && (
          <div className="mt-8 text-center animate-fade-in-up">
            <div className="glass-card p-6">
              <Heart className="w-12 h-12 mx-auto mb-4 text-rose-dark fill-rose animate-heartbeat" />
              <p className="font-serif text-xl text-foreground mb-2">
                ขอบคุณที่อยู่ด้วยกัน
              </p>
              <p className="text-muted-foreground text-sm">
                รักเธอเสมอ ❤️
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Swipe Hint */}
      {currentIndex === 0 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground text-sm animate-pulse-soft">
          <ChevronLeft className="w-4 h-4" />
          <span>เลื่อนซ้ายขวา</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
