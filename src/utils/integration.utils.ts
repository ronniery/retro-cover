import nock from 'nock';

import { BASE_URL, Platforms } from '../constants';
import { Matcher, SearchResult, PlatformCover, ServiceResult, Pagination } from '../types';
import { GetPlatformCoverOptions, getCoversByPlatform, searchOnline } from '../services';

type MockRequestParams = { path: string; query: nock.DataMatcherMap; body: string | object };

type Expectation = Pick<AssertionConfig, 'totalOfResults'> & { expect: jest.Expect };

type AssertionConfig = { currentPage: number | string; totalOfResults: number; searchTerm?: string };

type ExpectBaseOptions<TResult> = {
  expectation: AssertionConfig;
  baseExpect: { schema: TResult; expect: jest.Expect };
};

export const createMockHttp = (path: string) => {
  return ({ query, body }: Omit<MockRequestParams, 'path'>): nock.Scope => mockHttp({ path, query, body });
};

export const mockHttp = ({ path, query, body }: MockRequestParams): nock.Scope => {
  return nock(BASE_URL).get(path).query(query).reply(200, body, {
    'Content-type': 'text/html',
  });
};

type SearchOnlineServiceParams = { searchTerm: string; page?: string | number };

export const expectSearchOnline = async (config: {
  params: SearchOnlineServiceParams;
  assertion: Expectation;
}): Promise<void> => {
  const { searchTerm, page = 1 } = config.params;
  const { expect, ...rest } = config.assertion;
  const searchResult = await searchOnline(searchTerm, { page: page.toString() });

  expectBaseIntegration<SearchResult>(searchResult, {
    baseExpect: {
      expect,
      schema: {
        gameId: expect.any(Number),
        name: expect.any(String),
        platform: expect.any(String),
        source: expect.any(String),
      },
    },
    expectation: {
      ...rest,
      currentPage: page,
      searchTerm,
    },
  });
};

type PlatformCoverServiceParams = {
  platform: Platforms;
  matcher?: Matcher;
  options?: GetPlatformCoverOptions;
};

export const expectPlatformCovers = async (config: {
  params: PlatformCoverServiceParams;
  assertion: Expectation;
}): Promise<void> => {
  const { platform, matcher, options } = config.params;
  const { expect, ...rest } = config.assertion;
  const gameCovers = await getCoversByPlatform(platform, matcher, options);

  expectBaseIntegration<PlatformCover>(gameCovers, {
    baseExpect: {
      expect,
      schema: {
        covers: expect.any(Number),
        manuals: expect.any(Number),
        gameTitle: expect.any(String),
        source: expect.any(String),
      },
    },
    expectation: {
      ...rest,
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
      current: +expectation.currentPage,
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
