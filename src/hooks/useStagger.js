import { useGSAP } from '@gsap/react';
import { gsap, REDUCED_MOTION_QUERY, EASE_OUT } from '../lib/motion';

export default function useStagger(ref, selector, { dependency, y = 12, duration = 0.4 } = {}) {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(REDUCED_MOTION_QUERY, () => {
      const targets = ref.current?.querySelectorAll(selector);
      if (!targets?.length) return;
      gsap.from(targets, { autoAlpha: 0, y, duration, ease: EASE_OUT, stagger: { each: 0.05, from: 'start', amount: 0.4 } });
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [dependency], revertOnUpdate: true });
}
