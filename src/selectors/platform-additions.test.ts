import cheerio from 'cheerio';

import { PlatformAdditionsSelectors, platformAdditionsSelectors } from './platform-additions';

describe('platform-additions.selector', () => {
  it('should correctly return platform additions selectors', () => {
    const $ = cheerio.load(`<html><body></body></html>`);
    const selectors = platformAdditionsSelectors($);

    expect(selectors).toEqual<PlatformAdditionsSelectors>({
      smallArticleText: '.articleTextSmall',
      articleText: '.articleText',
      gameRows: expect.any(Object),
      newsTable: expect.any(Object),
      newsHeader: expect.any(Object),
    });
  });
});
