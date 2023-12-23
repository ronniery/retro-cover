import {
  GameAdditions,
  PlatformAdditionsParser,
  PlatformAdditionsOptions,
  PlatformCoverParser,
  Matcher,
} from '../parsers';
import { PLATFORM_ADDITIONS, PLATFORM_COVERS, Platforms } from '../constants';

import httpApi from './client/http-api';

export type GetPlatformCoverOptions = {
  page?: number;
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

export const getCoversByPlatform = async (
  platform: Platforms,
  matcher: Matcher = 'A',
  options?: GetPlatformCoverOptions,
): Promise<GameAdditions> => {
  const query: { cat_id: string; view: Matcher; page?: string } = {
    cat_id: platform.toString(),
    view: matcher,
  };

  if (options?.page) {
    query.page = options.page.toString();
  }

  const { data } = await httpApi.get<GameAdditions>(PLATFORM_COVERS, {
    query,
    transformResponse: (html: string) => new PlatformCoverParser(html).parse(),
  });

  return data;
};
