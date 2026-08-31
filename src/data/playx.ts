export interface PlayXExperience {
  slug: string;
  title: string;
  description: string;
  year: number;
  image: string;
  imageAlt: string;
  status: 'Original' | 'Archive' | 'Experiment' | 'Updated';
  relatedFieldNote?: string;
}

export const playXExperiences: PlayXExperience[] = [
  {
    slug: 'ber-calculator',
    title: 'The Ber Calculator',
    description: 'Estimate Philippine payroll deductions, Ber-month savings, 13th-month pay and a December Christmas budget.',
    year: 2026,
    image: '/images/playx/ber-calculator-christmas.jpg',
    imageAlt: 'Beer the bulldog resting beside a blue-lit Christmas tree',
    status: 'Experiment',
  },
  {
    slug: 'diwata-vs-kapre',
    title: 'Diwata vs. Kapre',
    description: 'A preserved 2023 AI-assisted browser game featuring a Diwata defending the forest against approaching Kapres.',
    year: 2023,
    image: '/images/playx/diwata-vs-kapre-preview.jpg',
    imageAlt: 'Pixel-art Diwata and Kapre facing each other in a forest',
    status: 'Archive',
    relatedFieldNote: 'creating-a-game-with-ai-and-html',
  },
];
