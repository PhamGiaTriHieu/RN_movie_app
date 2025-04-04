export type TResponseSearchData = {
  seoOnPage: {
    og_type: string;
    titleHead: string;
    descriptionHead: string;
    og_image: Array<string>;
    og_url: string;
  };
  breadCrumb: Array<{
    name: string;
    isCurrent: boolean;
    position: number;
  }>;
  titlePage: string;
  items: TMoviesData[];
  params: {
    type_slug: string;
    keyword: string;
    filterCategory: Array<any>;
    filterCountry: Array<any>;
    filterYear: number;
    filterType: any;
    sortField: string;
    sortType: string;
    pagination: {
      totalItems: number;
      totalItemsPerPage: number;
      currentPage: number;
      totalPages: number;
    };
  };
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
