import { useGSAP } from '@gsap/react';
import { gsap, REDUCED_MOTION_QUERY, EASE_OUT } from '../lib/motion';

export default function usePageTransition(ref, dependency) {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(REDUCED_MOTION_QUERY, () => {
      gsap.from(ref.current, { autoAlpha: 0, y: 10, duration: 0.32, ease: EASE_OUT });
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [dependency], revertOnUpdate: true });
}
