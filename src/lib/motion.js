import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const EASE_OUT = 'power2.out';
export const EASE_ENTRANCE = 'power3.out';
export const EASE_POP = 'back.out(1.6)';
export const DUR_FAST = 0.2;
export const DUR_BASE = 0.4;
export const DUR_SLOW = 0.6;

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

export { gsap, ScrollTrigger };
