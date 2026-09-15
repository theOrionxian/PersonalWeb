import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSectionReveals() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  document.querySelectorAll('main section:not(#hero)').forEach((section) => {
    const cards = section.querySelectorAll('.links-card, .grid-card, .ledger-row');
    const targets = cards.length
      ? Array.from(cards)
      : [section.querySelector('.sec-head'), section.querySelector('.about-lede')].filter(Boolean);

    gsap.set(targets, { opacity: 0, y: 20 });
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%'
      }
    });
  });
}
