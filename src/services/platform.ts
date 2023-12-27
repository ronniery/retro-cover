import httpApi from './client/http-api';

import { PlatformAdditionsParser, PlatformCoverParser } from '../parsers';
import { PLATFORM_ADDITIONS, PLATFORM_COVERS, Platforms } from '../constants';
import { PlatformAdditionsOptions, GameAdditions, Matcher, ServiceResult, PlatformCover } from '../types';

export type GetPlatformCoverOptions = {
  page?: string;
};

export const getAdditionsByPlatform = async (
  platform: Platforms,
  options?: PlatformAdditionsOptions,
): Promise<GameAdditions> => {
  const { data } = await httpApi.get<GameAdditions>(PLATFORM_ADDITIONS, {
    query: {
      cat_id: platform.toString(),
    },
    transformResponse: (html: string) => new PlatformAdditionsParser(html).parse(options),
  });

  return data;
};

export type GetCoversByPlatformQuery = { cat_id: string; view: Matcher; page?: string };

export const getCoversByPlatform = async (
  platform: Platforms,
  matcher: Matcher = 'A',
  options?: GetPlatformCoverOptions,
): Promise<ServiceResult<PlatformCover[]>> => {
  const query: GetCoversByPlatformQuery = {
    cat_id: platform.toString(),
    view: matcher,
  };

  if (options?.page) {
    query.page = options.page.toString();
  }

  const { data } = await httpApi.get<ServiceResult<PlatformCover[]>>(PLATFORM_COVERS, {
    query,
    transformResponse: (html: string) => {
      return new PlatformCoverParser(html).parse();
    },
  });

  return data;
};
