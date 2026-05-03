'use client';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Orb 1 - Orange — prominent */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #f97316 0%, transparent 70%)',
          top: '-15%',
          right: '-8%',
          animation: 'orb-float-1 22s ease-in-out infinite',
        }}
      />
      {/* Orb 2 - Amber — deep */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)',
          bottom: '5%',
          left: '-8%',
          animation: 'orb-float-2 28s ease-in-out infinite',
        }}
      />
      {/* Orb 3 - Emerald — subtle accent */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-[0.06] blur-[100px]"
        style={{
          background: 'radial-gradient(circle, #10b981 0%, transparent 70%)',
          top: '40%',
          right: '25%',
          animation: 'orb-float-3 24s ease-in-out infinite',
        }}
      />
      {/* Orb 4 - Deep orange — bottom right */}
      <div
        className="absolute w-[250px] h-[250px] rounded-full opacity-[0.05] blur-[80px]"
        style={{
          background: 'radial-gradient(circle, #f97316 0%, transparent 70%)',
          bottom: '-8%',
          right: '15%',
          animation: 'orb-float-2 20s ease-in-out infinite',
          animationDelay: '-5s',
        }}
      />
      {/* Grid overlay — subtle tech grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(249,115,22,0.15) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(249,115,22,0.15) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
      {/* Diagonal accent lines */}
      <div
        className="absolute inset-0 opacity-[0.008]"
        style={{
          backgroundImage: `linear-gradient(45deg, rgba(249,115,22,0.2) 1px, transparent 1px),
                           linear-gradient(-45deg, rgba(245,158,11,0.2) 1px, transparent 1px)`,
          backgroundSize: '120px 120px',
        }}
      />
      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.4) 100%)',
        }}
      />
    </div>
  );
}
