import nock from 'nock';

import { searchOnline } from './search';
import { searches } from './search.mock';

import { BASE_URL, SEARCH_GAMES } from '../constants';
import { SearchResult } from '../types';

describe('integration:services/search.ts', () => {
  describe('searchOnline', () => {
    it('should search for online results', async () => {
      const scope = nock(BASE_URL).get(SEARCH_GAMES).query({ searchstring: 'mario' }).reply(200, searches.page1, {
        'Content-type': 'text/html',
      });

      const searchResult = await searchOnline('mario');

      const { pagination } = searchResult;
      expect(pagination).toBeObject();
      expect(pagination.current).toBe(1);

      const { results } = searchResult;
      expect(results).toBeArray();
      expect(results.length).toBe(30);
      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining<SearchResult>({
            gameId: expect.any(Number),
            name: expect.any(String),
            platform: expect.any(String),
            source: expect.any(String),
          }),
        ]),
      );

      expect(scope.isDone()).toBeTrue();
    });

    it('should search online and bring the second page', async () => {
      const scope = nock(BASE_URL)
        .get(SEARCH_GAMES)
        .query({ searchstring: 'mario', page: '2' })
        .reply(200, searches.page2, {
          'Content-type': 'text/html',
        });

      const searchResult = await searchOnline('mario', { page: '2' });

      const { pagination } = searchResult;
      expect(pagination).toBeObject();
      expect(pagination.current).toBe(2);

      const { results } = searchResult;
      expect(results).toBeArray();
      expect(results.length).toBe(30);
      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining<SearchResult>({
            gameId: expect.any(Number),
            name: expect.any(String),
            platform: expect.any(String),
            source: expect.any(String),
          }),
        ]),
      );

      expect(scope.isDone()).toBeTrue();
    });
  });
});
