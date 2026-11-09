import { useEffect, useState } from 'react';

// Belirli aralıkla güncellenen saniye sayacı (menü animasyonları için)
export default function useTicker(fps = 30, active = true) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    let raf, last = 0, start = null;
    const loop = (ts) => {
      if (start === null) start = ts;
      if (ts - last >= 1000 / fps) {
        last = ts;
        setT((ts - start) / 1000);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fps, active]);
  return t;
}
