'use client';

import { useEffect, useRef } from 'react';

interface VantaEffect {
  destroy: () => void;
}

type VantaEffectType = 'HALO' | 'NET' | 'WAVES' | 'FOG';

interface VantaHeroProps {
  effect?: VantaEffectType;
}

export default function VantaHero({ effect = 'HALO' }: VantaHeroProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<VantaEffect | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadVanta = async () => {
      if (!vantaRef.current || !mounted) return;

      try {
        // Vanta requires THREE to be on window
        const THREE = await import('three');
        (window as any).THREE = THREE;

        let VANTA: any;

        if (effect === 'HALO') {
          VANTA = (await import('vanta/dist/vanta.halo.min.js')).default;
          vantaEffect.current = VANTA({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            baseColor: 0x001730,
            backgroundColor: 0x000c1a,
            amplitudeFactor: 2.0,
            size: 1.8,
            speed: 1.4,
          });
        } else if (effect === 'NET') {
          VANTA = (await import('vanta/dist/vanta.net.min.js')).default;
          vantaEffect.current = VANTA({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            color: 0x30D5C8,
            backgroundColor: 0x001020,
            points: 14,
            maxDistance: 22,
            spacing: 17,
            showDots: true,
            speed: 1.6,
          });
        } else if (effect === 'WAVES') {
          VANTA = (await import('vanta/dist/vanta.waves.min.js')).default;
          vantaEffect.current = VANTA({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            color: 0x001e35,
            shininess: 70,
            waveHeight: 24,
            waveSpeed: 1.0,
            zoom: 0.8,
          });
        } else if (effect === 'FOG') {
          VANTA = (await import('vanta/dist/vanta.fog.min.js')).default;
          vantaEffect.current = VANTA({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            highlightColor: 0x30D5C8,
            midtoneColor: 0x003153,
            lowlightColor: 0x000d1a,
            baseColor: 0x000814,
            blurFactor: 0.55,
            speed: 1.3,
            zoom: 0.9,
          });
        }
      } catch (err) {
        console.warn('Vanta load error:', err);
      }
    };

    loadVanta();

    return () => {
      mounted = false;
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, [effect]);

  return (
    <div
      ref={vantaRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}
