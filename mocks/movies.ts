export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  imageUrl: string;
  rating?: number;
  year?: number;
  genres?: string[];
  isVip?: boolean;
  episodes?: number;
  currentEpisode?: number;
}

export const featuredMovies: Movie[] = [
  {
    id: '1',
    title: 'Dominion and Devotion',
    originalTitle: 'Quyền Sủng',
    imageUrl:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.8,
    year: 2023,
    genres: ['Drama', 'Romance', 'Historical'],
  },
  {
    id: '2',
    title: 'Eternal Love',
    imageUrl:
      'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.7,
    year: 2022,
    genres: ['Romance', 'Fantasy'],
  },
  {
    id: '3',
    title: 'Dragon Heart',
    imageUrl:
      'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.5,
    year: 2023,
    genres: ['Action', 'Fantasy'],
  },
  {
    id: '4',
    title: 'Midnight Scholar',
    imageUrl:
      'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.3,
    year: 2022,
    genres: ['Mystery', 'Historical'],
  },
  {
    id: '5',
    title: 'Celestial Gardens',
    imageUrl:
      'https://images.unsplash.com/photo-1490131784822-b4626a8ec96a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.6,
    year: 2023,
    genres: ['Romance', 'Fantasy'],
  },
  {
    id: '6',
    title: 'Warrior Dynasty',
    imageUrl:
      'https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.9,
    year: 2021,
    genres: ['Action', 'Historical'],
  },
  {
    id: '7',
    title: 'Crimson Palace',
    imageUrl:
      'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.4,
    year: 2022,
    genres: ['Drama', 'Historical'],
  },
  {
    id: '8',
    title: 'Moonlight Serenade',
    imageUrl:
      'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    rating: 4.2,
    year: 2023,
    genres: ['Romance', 'Musical'],
  },
];

export const recommendedMovies: Movie[] = [
  {
    id: '10',
    title: 'Fights Break Sphere S5',
    imageUrl:
      'https://images.unsplash.com/photo-1535443274868-756b0f070b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isVip: true,
    episodes: 143,
  },
  {
    id: '11',
    title: 'Mermaid Bound',
    imageUrl:
      'https://images.unsplash.com/photo-1551085254-e96b210db58a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    episodes: 36,
  },
  {
    id: '12',
    title: 'Phoenix Rising',
    imageUrl:
      'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isVip: true,
    episodes: 50,
  },
  {
    id: '13',
    title: 'Jade Dynasty',
    imageUrl:
      'https://images.unsplash.com/photo-1490131784822-b4626a8ec96a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    episodes: 24,
  },
];

export const continueWatchingMovies: Movie[] = [
  {
    id: '20',
    title: 'Cherry Blossom Love',
    imageUrl:
      'https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    currentEpisode: 15,
    episodes: 24,
    isVip: true,
  },
  {
    id: '21',
    title: 'Modern Romance',
    imageUrl:
      'https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    currentEpisode: 8,
    episodes: 16,
    isVip: true,
  },
  {
    id: '22',
    title: 'Eternal Flame',
    imageUrl:
      'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    currentEpisode: 22,
    episodes: 40,
  },
];
