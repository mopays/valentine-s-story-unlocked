import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Delete, Lock } from 'lucide-react';
import FloatingHearts from '@/components/FloatingHearts';

// Hardcoded password - change this to your desired password
const CORRECT_PASSWORD = '1234';

const PasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleNumberClick = (num: string) => {
    if (password.length < 6) {
      const newPassword = password + num;
      setPassword(newPassword);
      setError(false);

      // Check password when it matches the length of correct password
      if (newPassword.length === CORRECT_PASSWORD.length) {
        if (newPassword === CORRECT_PASSWORD) {
          // Correct password - navigate after a short delay
          setTimeout(() => {
            navigate('/reveal');
          }, 500);
        } else {
          // Wrong password
          setError(true);
          setShake(true);
          setTimeout(() => {
            setShake(false);
            setPassword('');
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPassword(prev => prev.slice(0, -1));
    setError(false);
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];

  return (
    <div className="min-h-screen bg-romantic flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <FloatingHearts />

      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-light/50 flex items-center justify-center">
            <Lock className="w-8 h-8 text-rose-dark" />
          </div>
          <h1 className="font-serif text-2xl text-foreground mb-2">กรุณาใส่รหัสผ่าน</h1>
          <p className="text-muted-foreground text-sm">เพื่อดูเรื่องราวพิเศษของเรา</p>
        </div>

        {/* Password Dots */}
        <div 
          className={`flex justify-center gap-4 mb-10 ${shake ? 'animate-shake' : ''}`}
          style={{
            animation: shake ? 'shake 0.5s ease-in-out' : 'none',
          }}
        >
          {Array.from({ length: CORRECT_PASSWORD.length }).map((_, i) => (
            <div
              key={i}
              className={`password-dot ${i < password.length ? 'filled' : ''} ${
                error ? 'bg-destructive' : ''
              }`}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-center text-destructive text-sm mb-4 animate-fade-in-up">
            รหัสผ่านไม่ถูกต้อง ลองใหม่อีกครั้ง
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 px-4">
          {numbers.map((num, index) => {
            if (num === '') {
              return <div key={index} />;
            }
            if (num === 'delete') {
              return (
                <button
                  key={index}
                  onClick={handleDelete}
                  className="keypad-button bg-rose-light/30"
                >
                  <Delete className="w-6 h-6 text-rose-dark" />
                </button>
              );
            }
            return (
              <button
                key={index}
                onClick={() => handleNumberClick(num)}
                className="keypad-button"
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground text-sm">
          <Heart className="w-4 h-4 text-rose" />
          <span>ใส่รหัสที่เราตกลงกันไว้</span>
          <Heart className="w-4 h-4 text-rose" />
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default PasswordPage;
