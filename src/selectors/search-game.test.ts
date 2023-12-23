import cheerio from 'cheerio';

import { SearchGameSelectors, searchGameSelectors } from './search-game';

describe('search-game.selector', () => {
  it('should correctly return search game selectors', () => {
    const $ = cheerio.load(`<html><body></body></html>`);
    const selectors = searchGameSelectors($);

    expect(selectors).toEqual<SearchGameSelectors>({
      pageBody: expect.any(Object),
      newsHeader: expect.any(Object)
    });
  });
});
