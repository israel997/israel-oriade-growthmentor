"use client";

const cubes = [
  { size: 44, top: "6%",  left: "4%",   dur: 28, delay: 0,   rx: 1,  ry: 1,  rz: 0.4 },
  { size: 62, top: "12%", left: "88%",  dur: 38, delay: -7,  rx: 0.6,ry: 1,  rz: 0.8 },
  { size: 32, top: "38%", left: "2%",   dur: 22, delay: -3,  rx: 1,  ry: 0.5,rz: 1   },
  { size: 54, top: "55%", left: "92%",  dur: 32, delay: -14, rx: 0.8,ry: 1,  rz: 0.3 },
  { size: 28, top: "72%", left: "6%",   dur: 20, delay: -9,  rx: 1,  ry: 0.7,rz: 0.9 },
  { size: 50, top: "80%", left: "85%",  dur: 36, delay: -4,  rx: 0.5,ry: 1,  rz: 1   },
  { size: 36, top: "28%", left: "50%",  dur: 45, delay: -18, rx: 1,  ry: 1,  rz: 0.6 },
  { size: 24, top: "62%", left: "45%",  dur: 18, delay: -2,  rx: 0.9,ry: 0.6,rz: 1   },
  { size: 58, top: "20%", left: "72%",  dur: 42, delay: -11, rx: 0.7,ry: 1,  rz: 0.5 },
  { size: 30, top: "88%", left: "30%",  dur: 24, delay: -6,  rx: 1,  ry: 0.8,rz: 0.7 },
];

function Cube({ size, top, left, dur, delay, rx, ry, rz }: typeof cubes[0]) {
  const h = size / 2;
  const face: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    background: "rgba(59,130,246,0.04)",
    border: "1px solid rgba(96,165,250,0.12)",
    backdropFilter: "blur(2px)",
  };

  const animName = `cube-rot-${size}-${dur}`;

  return (
    <>
      <style>{`
        @keyframes ${animName} {
          0%   { transform: rotateX(0deg)   rotateY(0deg)   rotateZ(0deg); }
          100% { transform: rotateX(${rx * 360}deg) rotateY(${ry * 360}deg) rotateZ(${rz * 360}deg); }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          top,
          left,
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          animation: `${animName} ${dur}s linear ${delay}s infinite`,
        }}
      >
        {/* front */}
        <div style={{ ...face, transform: `rotateY(0deg) translateZ(${h}px)` }} />
        {/* back */}
        <div style={{ ...face, transform: `rotateY(180deg) translateZ(${h}px)` }} />
        {/* left */}
        <div style={{ ...face, transform: `rotateY(-90deg) translateZ(${h}px)` }} />
        {/* right */}
        <div style={{ ...face, transform: `rotateY(90deg) translateZ(${h}px)` }} />
        {/* top */}
        <div style={{ ...face, transform: `rotateX(90deg) translateZ(${h}px)` }} />
        {/* bottom */}
        <div style={{ ...face, transform: `rotateX(-90deg) translateZ(${h}px)` }} />
      </div>
    </>
  );
}

export default function Cubes3DBg() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        perspective: "800px",
        overflow: "hidden",
      }}
    >
      {cubes.map((c, i) => (
        <Cube key={i} {...c} />
      ))}
    </div>
  );
}
