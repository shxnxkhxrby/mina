import { useState, useEffect } from 'react';

export default function OrientationGuard({ children }: { children: React.ReactNode }) {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const check = () => {
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 900;
      setIsPortrait(portrait);
    };
    check();
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  if (isPortrait) {
    return (
      <div className="rotate-overlay">
        <div style={{ fontSize:'clamp(3rem,10vw,6rem)', animation:'rotate-hint 2s ease-in-out infinite' }}>📱</div>
        <div style={{
          fontFamily:'var(--font-title)',
          fontSize:'clamp(1.2rem,4vw,2rem)',
          color:'var(--golden)',
          textAlign:'center',
          textShadow:'2px 3px 0 var(--olive-brown)',
        }}>Rotate Your Device</div>
        <div style={{
          fontFamily:'var(--font-body)',
          fontSize:'clamp(0.75rem,2.5vw,1rem)',
          color:'rgba(255,248,231,0.7)',
          textAlign:'center',
          maxWidth:'280px', lineHeight:1.6,
        }}>
          Please rotate your device to <strong style={{ color:'var(--golden)' }}>landscape mode</strong> for the best Minasa Quest experience!
        </div>
        <button className="btn btn-primary" style={{ marginTop:'8px' }}
          onClick={() => document.documentElement.requestFullscreen?.()}>
          Go Fullscreen
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
