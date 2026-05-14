// Real Yomies menu — the AI-generated drink names map to one of these actual products,
// so operations stay sane while every customer gets a one-of-one name.

export const YOMIES_MENU = [
  { id: 'espresso', name: 'Double Espresso', category: 'coffee', vibe: 'sharp / urgent / no-nonsense' },
  { id: 'americano', name: 'Americano', category: 'coffee', vibe: 'classic / steady / unfussy' },
  { id: 'cortado', name: 'Cortado', category: 'coffee', vibe: 'balanced / smooth / European' },
  { id: 'flat-white', name: 'Flat White', category: 'coffee', vibe: 'silky / understated / confident' },
  { id: 'iced-latte', name: 'Iced Oat Latte', category: 'coffee', vibe: 'breezy / cool / dependable' },
  { id: 'cold-brew', name: 'Cold Brew', category: 'coffee', vibe: 'slow / deep / unbothered' },
  { id: 'manuka-cold-brew', name: 'Manuka Honey Cold Brew', category: 'functional', vibe: 'golden / restorative / luxurious' },
  { id: 'lions-mane-latte', name: "Lion's Mane Latte", category: 'functional', vibe: 'focused / cerebral / quiet power' },
  { id: 'ashwagandha-latte', name: 'Ashwagandha Latte', category: 'functional', vibe: 'grounding / softening / wind-down' },
  { id: 'matcha', name: 'Iced Matcha', category: 'matcha', vibe: 'green / refreshing / clean' },
  { id: 'strawberry-matcha', name: 'Strawberry Matcha', category: 'matcha', vibe: 'pink / sweet / playful' },
  { id: 'green-smoothie', name: 'Green Power Smoothie + Collagen', category: 'smoothie', vibe: 'leafy / virtuous / fresh start' },
  { id: 'berry-smoothie', name: 'Berry Wellness Smoothie + Protein', category: 'smoothie', vibe: 'fruit-forward / fueling / loud' },
  { id: 'tropical-smoothie', name: 'Tropical Sunrise + Lion\'s Mane', category: 'smoothie', vibe: 'sunny / clarity / golden hour' },
  { id: 'mocha', name: 'Iced Mocha', category: 'coffee', vibe: 'indulgent / cozy / treat' },
];

export function findDrink(id) {
  return YOMIES_MENU.find((d) => d.id === id) || YOMIES_MENU[0];
}
