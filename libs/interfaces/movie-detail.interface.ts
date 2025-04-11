import {ICategory, ICountry} from '@/libs/interfaces/search-movies.interface';

export interface IMovieDetailResponse {
  status: boolean;
  msg: string;
  movie: IMovie;
  episodes: IEpisode[];
}

export interface IMovieDetail {
  movie: IMovie;
  episodes: IEpisode[];
}
export interface IMovie {
  tmdb: ITmdb;
  imdb: IImdb;
  created: ICreated;
  modified: IModified;
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  poster_url: string;
  thumb_url: string;
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: ICategory[];
  country: ICountry[];
}

export interface ITmdb {
  type: string;
  id: string;
  season: number;
  vote_average: number;
  vote_count: number;
}

export interface IImdb {
  id: any;
}

export interface ICreated {
  time: string;
}

export interface IModified {
  time: string;
}

export interface IEpisode {
  server_name: string;
  server_data: IServerDetail[];
}

export interface IServerDetail {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}
