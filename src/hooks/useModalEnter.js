import { useGSAP } from '@gsap/react';
import { gsap, REDUCED_MOTION_QUERY, EASE_POP } from '../lib/motion';

/** Shared entrance animation for every modal/dialog card (Connect's modals, ApiKeys' secret
 * reveal, History's QR modal, UiProvider's confirm dialog) so they share one motion idiom
 * instead of five separate ad hoc implementations. `cardSelector` targets the card element
 * inside the backdrop that was just mounted (e.g. '.modal-card', '.global-dialog'). */
export default function useModalEnter(ref, cardSelector, dependency) {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(REDUCED_MOTION_QUERY, () => {
      const card = ref.current?.querySelector(cardSelector) || ref.current;
      if (!card) return;
      gsap.from(card, { autoAlpha: 0, scale: 0.94, duration: 0.28, ease: EASE_POP });
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [dependency], revertOnUpdate: true });
}
