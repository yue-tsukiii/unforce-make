"use client";

/**
 * Pure CSS isometric 3D room — inspired by codepen.io/ricardoolivaalonso/pen/mdPzrpe.
 * Recreated as a React component with Tailwind utility colors.
 */
export function IsometricRoom() {
  return (
    <div className="flex items-center justify-center" style={{ perspective: 800 }}>
      <div
        className="relative"
        style={{
          width: 280,
          height: 280,
          transformStyle: "preserve-3d",
          transform: "rotateX(-30deg) rotateY(45deg)",
        }}
      >
        {/* Floor */}
        <div
          className="absolute"
          style={{
            width: 280,
            height: 280,
            background: "#f5f0eb",
            transform: "rotateX(90deg) translateZ(-140px)",
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.08)",
          }}
        >
          {/* Floor tiles */}
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "35px 35px",
          }} />
        </div>

        {/* Back wall */}
        <div
          className="absolute"
          style={{
            width: 280,
            height: 280,
            background: "linear-gradient(180deg, #fafaf8 0%, #f0ece7 100%)",
            transform: "translateZ(-140px)",
          }}
        >
          {/* Window */}
          <div
            className="absolute rounded-sm"
            style={{
              width: 80,
              height: 100,
              top: 40,
              left: 100,
              background: "linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%)",
              border: "3px solid #d4c5b0",
              boxShadow: "inset 0 0 20px rgba(147,197,253,0.3)",
            }}
          >
            {/* Window cross */}
            <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-[#d4c5b0]" />
            <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 bg-[#d4c5b0]" />
          </div>
        </div>

        {/* Left wall */}
        <div
          className="absolute"
          style={{
            width: 280,
            height: 280,
            background: "linear-gradient(180deg, #f0ece7 0%, #e8e2da 100%)",
            transform: "rotateY(90deg) translateZ(-140px)",
          }}
        >
          {/* Wall art */}
          <div
            className="absolute rounded-sm"
            style={{
              width: 60,
              height: 44,
              top: 50,
              left: 40,
              background: "#ff6c37",
              opacity: 0.15,
              border: "2px solid #d4c5b0",
            }}
          />
        </div>

        {/* Bed */}
        <div
          className="absolute"
          style={{
            width: 120,
            height: 20,
            transformStyle: "preserve-3d",
            transform: "translateX(10px) translateY(120px) translateZ(-120px)",
          }}
        >
          {/* Bed top (mattress) */}
          <div
            className="absolute"
            style={{
              width: 120,
              height: 80,
              background: "#fff5ee",
              transform: "rotateX(90deg) translateZ(-10px)",
              borderRadius: 4,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          />
          {/* Bed frame side */}
          <div
            className="absolute"
            style={{
              width: 120,
              height: 20,
              background: "#c4a882",
              borderRadius: "0 0 3px 3px",
            }}
          />
          {/* Pillow */}
          <div
            className="absolute"
            style={{
              width: 40,
              height: 30,
              background: "#ffffff",
              transform: "rotateX(90deg) translateZ(-8px) translateX(10px) translateY(-20px)",
              borderRadius: 6,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          />
        </div>

        {/* Desk */}
        <div
          className="absolute"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateX(160px) translateY(130px) translateZ(-60px)",
          }}
        >
          {/* Desk top */}
          <div
            className="absolute"
            style={{
              width: 90,
              height: 50,
              background: "#dbc4a0",
              transform: "rotateX(90deg)",
              borderRadius: 2,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          />
          {/* Monitor */}
          <div
            className="absolute"
            style={{
              width: 40,
              height: 30,
              background: "#1a1a1a",
              transform: "translateX(25px) translateY(-32px) translateZ(-20px)",
              borderRadius: 3,
              boxShadow: "0 0 0 2px #333",
            }}
          >
            <div className="absolute inset-[3px] rounded-[1px]" style={{ background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)" }} />
          </div>
        </div>

        {/* Small lamp on desk */}
        <div
          className="absolute"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateX(220px) translateY(110px) translateZ(-40px)",
          }}
        >
          {/* Lamp shade */}
          <div style={{
            width: 16,
            height: 16,
            background: "#ff6c37",
            borderRadius: "50% 50% 40% 40%",
            opacity: 0.7,
            boxShadow: "0 4px 16px rgba(255,108,55,0.3)",
          }} />
          {/* Lamp base */}
          <div style={{
            width: 6,
            height: 18,
            background: "#666",
            margin: "0 auto",
            borderRadius: 1,
          }} />
        </div>

        {/* Rug on floor */}
        <div
          className="absolute"
          style={{
            width: 100,
            height: 70,
            background: "rgba(255, 108, 55, 0.08)",
            border: "2px solid rgba(255, 108, 55, 0.15)",
            borderRadius: 8,
            transform: "rotateX(90deg) translateZ(-138px) translateX(90px) translateY(100px)",
          }}
        />
      </div>
    </div>
  );
}
