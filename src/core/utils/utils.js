/**
 * Combine classnames conditionnellement
 * Utilitaire pour fusionner les classes Tailwind CSS
 */
export function cn(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
