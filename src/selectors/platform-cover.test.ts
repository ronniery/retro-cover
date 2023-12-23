import cheerio from 'cheerio';

import { PlatformCoversSelectors, platformCoversSelectors } from './platform-cover';

describe('platform-cover.selector', () => {
  it('should correctly return platform cover selectors', () => {
    const $ = cheerio.load(`<html><body></body></html>`);
    const selectors = platformCoversSelectors($);

    expect(selectors).toEqual<PlatformCoversSelectors>({
      pageBodyLines: expect.any(Object),
      newsHeader: expect.any(Object),
      spanArticleText: 'span.articleText',
    });
  });
});
