import nock from 'nock';

import { BASE_URL, Platforms } from '../constants';
import { Matcher, SearchResult, PlatformCover, ServiceResult, Pagination } from '../types';
import { GetPlatformCoverOptions, getCoversByPlatform, searchOnline } from '../services';

type MockRequestParams = { path: string; query: nock.DataMatcherMap; body: string | object };

type Expectation = { currentPage: number; totalOfResults: number; searchTerm?: string };

type ExpectBaseOptions<TResult> = {
  expectation: Expectation;
  baseExpect: { schema: TResult };
};

export const mockRequest = ({ path, query, body }: MockRequestParams): nock.Scope => {
  return nock(BASE_URL).get(path).query(query).reply(200, body, {
    'Content-type': 'text/html',
  });
};

type SearchOnlineServiceParams = {
  searchTerm: string;
  page?: number;
  expectation: Omit<Expectation, 'searchTerm' | 'currentPage'>;
};

export const expectSearchOnline = async ({
  searchTerm,
  page = 1,
  expectation,
}: SearchOnlineServiceParams): Promise<void> => {
  const searchResult = await searchOnline(searchTerm, { page: page.toString() });

  expectBaseIntegration<SearchResult>(searchResult, {
    baseExpect: {
      schema: {
        gameId: expect.any(Number),
        name: expect.any(String),
        platform: expect.any(String),
        source: expect.any(String),
      },
    },
    expectation: {
      ...expectation,
      currentPage: page,
      searchTerm,
    },
  });
};

type PlatformCoverServiceParams = {
  platform: Platforms;
  matcher?: Matcher;
  options?: GetPlatformCoverOptions;
  expectation: Omit<Expectation, 'searchTerm' | 'currentPage'>;
};

export const expectPlatformCovers = async ({
  platform,
  matcher,
  options,
  expectation,
}: PlatformCoverServiceParams): Promise<void> => {
  const gameCovers = await getCoversByPlatform(platform, matcher, options);

  expectBaseIntegration<PlatformCover>(gameCovers, {
    baseExpect: {
      schema: {
        covers: expect.any(Number),
        manuals: expect.any(Number),
        gameTitle: expect.any(String),
        source: expect.any(String),
      },
    },
    expectation: {
      ...expectation,
      currentPage: +(options?.page ?? 1),
      searchTerm: matcher,
    },
  });
};

const expectBaseIntegration = <TResult>(
  target: ServiceResult<TResult[]>,
  options: ExpectBaseOptions<TResult>,
): void => {
  const { expectation, baseExpect } = options;

  expect(target).toBeObject();

  const { searchTerm } = target;
  expect(searchTerm).toBeString();
  expect(searchTerm).toEqual(expectation.searchTerm);

  const { pagination } = target;
  expect(pagination).toBeObject();
  expect(pagination).toEqual(
    expect.objectContaining<Pagination>({
      current: expectation.currentPage,
      itemsPerPage: expect.toBeOneOf([expect.any(Number), null]),
      next: expect.toBeOneOf([expect.any(Number), null]),
      prev: expect.toBeOneOf([expect.any(Number), null]),
      totalPages: expect.toBeOneOf([expect.any(Number), null]),
    }),
  );

  const { results } = target;
  expect(results).toBeArray();
  expect(results.length).toBe(expectation.totalOfResults);
  expect(results).toEqual(expect.arrayContaining([expect.objectContaining<TResult>(baseExpect.schema as TResult)]));
};
