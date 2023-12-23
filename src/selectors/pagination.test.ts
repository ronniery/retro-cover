import cheerio from 'cheerio';

import { PaginatorSelectors, paginationSelector } from './pagination';

describe('pagination.selector', () => {
  it('should correctly return pagination selectors', () => {
    const $ = cheerio.load(`<html><body></body></html>`);
    const selectors = paginationSelector($);

     expect(selectors).toEqual<PaginatorSelectors>({
       paginator: expect.any(Object),
       paginatorChildren: expect.any(Object),
       spanThisPage: expect.any(Object),
     });
  });
});
