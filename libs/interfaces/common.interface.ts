import {
  IBreadCrumb,
  IParams,
  SeoOnPage,
  TMoviesData,
} from '@/libs/interfaces/search-movies.interface';

export type TResponseData = {
  seoOnPage: SeoOnPage;
  breadCrumb: IBreadCrumb[];
  titlePage: string;
  items: TMoviesData[];
  params: IParams;
  type_list: string;
  APP_DOMAIN_FRONTEND: string;
  APP_DOMAIN_CDN_IMAGE: string;
};
