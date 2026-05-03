'use client';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Orb 1 - Cyan */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)',
          top: '-10%',
          right: '-5%',
          animation: 'orb-float-1 20s ease-in-out infinite',
        }}
      />
      {/* Orb 2 - Purple */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
          bottom: '10%',
          left: '-5%',
          animation: 'orb-float-2 25s ease-in-out infinite',
        }}
      />
      {/* Orb 3 - Emerald */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full opacity-10 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, #10b981 0%, transparent 70%)',
          top: '40%',
          right: '30%',
          animation: 'orb-float-3 22s ease-in-out infinite',
        }}
      />
      {/* Orb 4 - Dim cyan accent */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-8 blur-[80px]"
        style={{
          background: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)',
          bottom: '-5%',
          right: '20%',
          animation: 'orb-float-2 18s ease-in-out infinite',
          animationDelay: '-5s',
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}
