import React, { useCallback, useEffect, useRef, useState } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeCaption?: string;
  afterCaption?: string;
  initialPercent?: number; // 0..100
  className?: string;
  height?: string | number; // ex: "420px" or 420
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeSrc,
  afterSrc,
  beforeCaption = "Antes - Visão Manual",
  afterCaption = "Depois - IA em Ação",
  initialPercent = 50,
  className = "",
  height = "100%",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [percent, setPercent] = useState<number>(Math.max(0, Math.min(100, initialPercent)));
  const [isDragging, setIsDragging] = useState(false);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const animRef = useRef<number | null>(null);

  // calculate percent from clientX
  const updatePercentFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const p = (x / rect.width) * 100;
    setPercent(p);
  }, []);

  // pointer handlers (mouse + touch)
  useEffect(() => {
    const onPointerMove = (ev: PointerEvent) => {
      if (!containerRef.current) return;
      if (isDragging) {
        updatePercentFromClientX(ev.clientX);
      }
      // update pointerPos for zoom focus
      const r = containerRef.current.getBoundingClientRect();
      setPointerPos({ x: ev.clientX - r.left, y: ev.clientY - r.top });
    };
    const onPointerUp = () => setIsDragging(false);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging, updatePercentFromClientX]);

  // keyboard support (left/right arrows)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      if (e.key === "ArrowLeft") setPercent(p => Math.max(0, p - 5));
      if (e.key === "ArrowRight") setPercent(p => Math.min(100, p + 5));
      if (e.key === "Home") setPercent(0);
      if (e.key === "End") setPercent(100);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // smooth animation when clicking on the bar (click-to-set)
  const onBarClick = (e: React.MouseEvent) => {
    updatePercentFromClientX(e.clientX);
  };

  // start dragging when pressing the handle
  const onPointerDownHandle = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
  };

  // compute transform origin for zoom (mouse focus)
  const transformOrigin = pointerPos ? `${(pointerPos.x /  (containerRef.current?.clientWidth || 1)) * 100}% ${(pointerPos.y / (containerRef.current?.clientHeight || 1)) * 100}%` : "50% 50%";

  // cleanup animation frame
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative select-none touch-none ${className}`}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
      onClick={onBarClick}
      role="application"
      aria-label="Before and After Image Slider"
    >
      {/* after image (top) - clipped by width percent */}
      <div
        className="absolute inset-0 overflow-hidden rounded-lg"
        style={{
          transition: isDragging ? "none" : "width 320ms cubic-bezier(.2,.9,.2,1)",
          width: `${percent}%`,
          // ensure this top layer is left-aligned and clipped
          left: 0,
        }}
      >
        <div
          className="w-full h-full"
          style={{
            transform: isDragging ? undefined : undefined,
          }}
        >
          <img
            src={afterSrc}
            alt={afterCaption}
            className="w-full h-full object-cover"
            style={{
              transformOrigin,
              transition: "transform 200ms ease",
              transform: pointerPos ? "scale(1.08)" : "scale(1)",
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* before image (bottom) - full */}
      <div className="absolute inset-0 rounded-lg overflow-hidden border border-border">
        <img src={beforeSrc} alt={beforeCaption} className="w-full h-full object-cover" draggable={false} />
      </div>

      {/* dark overlay gradient for labels */}
      <div className="pointer-events-none absolute left-0 top-0 p-3 w-full flex justify-between items-start">
        <div className="bg-black/40 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {beforeCaption}
        </div>
        <div className="bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {afterCaption}
        </div>
      </div>

      {/* draggable handle */}
      <div
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        tabIndex={0}
        onPointerDown={onPointerDownHandle}
        className="absolute top-0 bottom-0 flex items-center justify-center"
        style={{
          left: `${percent}%`,
          transform: "translateX(-50%)",
          width: 28,
          cursor: "ew-resize",
          zIndex: 40,
        }}
      >
        {/* vertical line */}
        <div className="h-full w-[2px] bg-white/90 shadow-sm rounded" />
        {/* circular knob */}
        <div className="absolute -translate-x-1/2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
          <div className="w-3 h-3 rounded-full bg-gray-700" />
        </div>
      </div>

      {/* small caption with percent */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
        {Math.round(percent)}%
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
