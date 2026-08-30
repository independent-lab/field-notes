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
