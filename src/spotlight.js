export function getSpotlightPosition(clientX, clientY, bounds) {
  const position = (coordinate, start, length) => {
    if (length <= 0) return 50;
    return Math.max(0, Math.min(100, Math.round(((coordinate - start) / length) * 1000) / 10));
  };

  return {
    x: position(clientX, bounds.left, bounds.width),
    y: position(clientY, bounds.top, bounds.height),
  };
}

export function initSpotlight() {
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!supportsHover || prefersReducedMotion) return;

  document.querySelectorAll('[data-spotlight]').forEach((target) => {
    target.addEventListener('pointermove', (event) => {
      const bounds = target.getBoundingClientRect();
      const { x, y } = getSpotlightPosition(event.clientX, event.clientY, bounds);
      target.style.setProperty('--spotlight-x', `${x}%`);
      target.style.setProperty('--spotlight-y', `${y}%`);
      target.style.setProperty('--pointer-shift-x', `${Math.round((x - 50) * 0.12)}px`);
      target.style.setProperty('--pointer-shift-y', `${Math.round((y - 50) * 0.12)}px`);
      target.setAttribute('data-spotlight-active', '');
    }, { passive: true });

    target.addEventListener('pointerleave', () => {
      target.style.removeProperty('--spotlight-x');
      target.style.removeProperty('--spotlight-y');
      target.style.removeProperty('--pointer-shift-x');
      target.style.removeProperty('--pointer-shift-y');
      target.removeAttribute('data-spotlight-active');
    }, { passive: true });
  });
}
