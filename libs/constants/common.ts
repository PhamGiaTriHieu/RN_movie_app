interface IType {
  name: string;
  value: string;
  key: string;
}

export const MOVIE_TYPES: IType[] = [
  {
    name: 'Phim bộ',
    value: 'phim-bo',
    key: 'series',
  },
  {
    name: 'Phim lẻ',
    value: 'phim-le',
    key: 'single',
  },
  {
    name: 'TV Shows',
    value: 'tv-shows',
    key: 'tvshows',
  },
  {
    name: 'Hoạt hình',
    value: 'hoat-hinh',
    key: 'hoathinh',
  },
];
