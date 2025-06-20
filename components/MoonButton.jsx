"use client";

import { useRef, useState } from "react";

export default function MoonButton() {
  const moonRef = useRef();
  const [isFlying, setIsFlying] = useState(false);

  const handleClick = () => {
    const moon = moonRef.current;
    if (!moon || isFlying) return;

    setIsFlying(true);

    moon.style.transition = "transform 1s cubic-bezier(0.4, 0, 0.2, 1)";
    moon.style.transform = "translateY(-200%) scale(1.2)";

    setTimeout(() => {
      moon.style.transform = "translateY(0) scale(1)";
      setIsFlying(false);
    }, 1000);
  };

  return (
    <div className="hidden md:block fixed right-4 bottom-20 md:right-[20%] md:top-[20%] md:bottom-auto z-[9999]">
      <button
        ref={moonRef}
        onClick={handleClick}
        className="
          relative w-20 h-20 rounded-full
          border border-yellow-100/40
          shadow-[0_0_80px_rgba(255,255,150,0.7)]
          backdrop-blur-2xl
          transition-transform
          overflow-visible
        "
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(255, 255, 150, 0.8), rgba(255, 220, 0, 0.6))
          `,
        }}
      >
        {/* Liquid Glass Inner Glow */}
        <div className="
          absolute inset-0 rounded-full
          bg-white/30 blur-2xl pointer-events-none
        "></div>

        {/* Floating Stars */}
        <span className="absolute w-2 h-2 bg-white rounded-full animate-starOrbit1"></span>
        <span className="absolute w-1.5 h-1.5 bg-white rounded-full animate-starOrbit2"></span>
        <span className="absolute w-1 h-1 bg-white rounded-full animate-starOrbit3"></span>
      </button>

      {/* Keyframes for stars */}
      <style jsx>{`
        @keyframes starOrbit1 {
          0% { transform: rotate(0deg) translateX(40px) rotate(0deg); opacity: 1; }
          50% { opacity: 0.3; }
          100% { transform: rotate(360deg) translateX(40px) rotate(-360deg); opacity: 1; }
        }

        @keyframes starOrbit2 {
          0% { transform: rotate(0deg) translateX(50px) rotate(0deg); opacity: 0.8; }
          50% { opacity: 0.2; }
          100% { transform: rotate(-360deg) translateX(50px) rotate(360deg); opacity: 0.8; }
        }

        @keyframes starOrbit3 {
          0% { transform: rotate(0deg) translateX(30px) rotate(0deg); opacity: 1; }
          50% { opacity: 0.5; }
          100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); opacity: 1; }
        }

        .animate-starOrbit1 {
          animation: starOrbit1 8s linear infinite;
          transform-origin: center;
        }

        .animate-starOrbit2 {
          animation: starOrbit2 12s linear infinite;
          transform-origin: center;
        }

        .animate-starOrbit3 {
          animation: starOrbit3 10s linear infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}
