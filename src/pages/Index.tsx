import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import FloatingHearts from '@/components/FloatingHearts';
import TypewriterText from '@/components/TypewriterText';

const Index = () => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);

  const loveMessage = `สวัสดีที่รัก...

วันนี้เป็นวันพิเศษที่ฉันอยากจะบอกความรู้สึกกับเธอ
ตลอดเวลาที่ผ่านมา เธอทำให้ทุกวันของฉันมีความหมาย
ขอบคุณที่อยู่เคียงข้างกันเสมอมา

💕`;

  return (
    <div className="min-h-screen bg-romantic flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <FloatingHearts />
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Love Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-rose-light/50 flex items-center justify-center animate-heartbeat">
            <Heart className="w-10 h-10 text-rose-dark fill-rose" />
          </div>
        </div>

        {/* Text Box */}
        <div className="glass-card p-8 mb-8">
          <TypewriterText 
            text={loveMessage} 
            speed={60}
            onComplete={() => setShowButton(true)}
          />
        </div>

        {/* Button */}
        <div 
          className={`flex justify-center transition-all duration-700 ${
            showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={() => navigate('/password')}
            className="love-button flex items-center gap-3 text-lg"
            disabled={!showButton}
          >
            <Heart className="w-5 h-5" />
            <span>ดูเรื่องราวของเรา</span>
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-rose-light/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-rose/10 rounded-full blur-3xl" />
    </div>
  );
};

export default Index;
