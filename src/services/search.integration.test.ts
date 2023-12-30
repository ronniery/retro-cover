import { searches } from './search.mock';

import { SEARCH_GAMES } from '../constants';
import { expectSearchOnline, mockRequest } from '../utils';

describe('integration:services/search.ts', () => {
  describe('searchOnline', () => {
    it('should search for online results', async () => {
      const scope = mockRequest({
        path: SEARCH_GAMES,
        query: { searchstring: 'mario', page: '1' },
        body: searches.page1,
      });

      await expectSearchOnline({
        searchTerm: 'mario',
        page: 1, // Page is optional inside search online service
        expectation: {
          totalOfResults: 30,
        },
      });

      expect(scope.isDone()).toBeTrue();
    });

    it('should search online and bring the second page', async () => {
      const scope = mockRequest({
        path: SEARCH_GAMES,
        query: { searchstring: 'mario', page: '2' },
        body: searches.page2,
      });

      await expectSearchOnline({
        searchTerm: 'mario',
        page: 2,
        expectation: {
          totalOfResults: 30,
        },
      });

      expect(scope.isDone()).toBeTrue();
    });
  });
});
