import { searches } from './search.mock';

import { SEARCH_GAMES } from '../constants';
import { expectSearchOnline, mockHttp } from '../utils';

describe('integration:services/search.ts', () => {
  describe('searchOnline', () => {
    it('should search for online results', async () => {
      const scope = mockHttp({
        path: SEARCH_GAMES,
        query: { searchstring: 'mario', page: '1' },
        body: searches.page1,
      });

      await expectSearchOnline({
        params: {
          searchTerm: 'mario',
          page: 1,
        },
        assertion: { expect, totalOfResults: 30 },
      });

      expect(scope.isDone()).toBeTrue();
    });

    it('should search online and bring the second page', async () => {
      const scope = mockHttp({
        path: SEARCH_GAMES,
        query: { searchstring: 'mario', page: '2' },
        body: searches.page2,
      });

      await expectSearchOnline({
        params: {
          searchTerm: 'mario',
          page: 2,
        },
        assertion: {
          expect,
          totalOfResults: 30,
        },
      });

      expect(scope.isDone()).toBeTrue();
    });
  });
});
