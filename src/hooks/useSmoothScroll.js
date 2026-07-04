import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, REDUCED_MOTION_QUERY } from '../lib/motion';

/** Smooths native window scrolling for the authenticated app shell. The sidebar is
 * position:fixed and the topbar position:sticky within normal document flow, so a
 * window-level Lenis instance (no custom wrapper) plays correctly with both.
 *
 * Scrolling inside a nested scrollable region (the sidebar's own `.nav-scroll` list,
 * modal cards, table wrappers, etc) must stay ordinary/native — otherwise Lenis's
 * global wheel listener hijacks it and smooth-scrolls the whole page instead of just
 * that region. `allowNestedScroll` lets Lenis detect those automatically, and the
 * explicit `.nav-scroll` check is a belt-and-suspenders guarantee for the sidebar. */
export default function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled || !window.matchMedia(REDUCED_MOTION_QUERY).matches) return undefined;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      allowNestedScroll: true,
      prevent: node => Boolean(node.closest?.('.nav-scroll')),
    });
    lenis.on('scroll', ScrollTrigger.update);
    const ticker = time => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, [enabled]);
}
