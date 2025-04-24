export type TResponseSearchData = {
  seoOnPage: SeoOnPage;
  breadCrumb: IBreadCrumb[];
  titlePage: string;
  items: TMoviesData[];
  params: IParams;
  type_list: string;
  APP_DOMAIN_FRONTEND: string;
  APP_DOMAIN_CDN_IMAGE: string;
};

export type TMoviesData = {
  modified: {
    time: string;
  };
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  type: string;
  poster_url: string;
  thumb_url: string;
  sub_docquyen: boolean;
  chieurap: boolean;
  time: string;
  episode_current: string;
  quality: string;
  lang: string;
  year: number;

  category: ICategory[];
  country: ICountry[];
};

export interface ICategory {
  id: string;
  name: string;
  slug: string;
}

export interface ICountry {
  id: string;
  name: string;
  slug: string;
}

export interface IBreadCrumb {
  name: string;
  slug?: string;
  isCurrent: boolean;
  position: number;
}

export interface SeoOnPage {
  og_type: string;
  titleHead: string;
  descriptionHead: string;
  og_image: string[];
  og_url: string;
}

export interface IParams {
  type_slug: string;
  filterCategory: string[];
  filterCountry: string[];
  filterYear: string[];
  filterType: string[];
  sortField: string;
  sortType: string;
  pagination: IPagination;
}
export interface IPagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}
