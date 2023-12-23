import cheerio from 'cheerio'

import { GameCoverSelectors, gameCoverSelector } from './game-covers'

describe('selectors/game-covers.ts | gameCoverSelector', () => {
  it('should correctly return game cover selectors', () => {
    const $ = cheerio.load(`<html><body></body></html>`);
    const selectors = gameCoverSelector($);

    expect(selectors).toEqual<GameCoverSelectors>({
      firstCover: '#covers ul li.tabSelected',
      allCovers: '#covers ul li:not(.tabHeader)',
      newsTableGamePlatform: expect.toBeOneOf([Object, undefined]),
      newsTableGameTitle: expect.any(Object),
    });
  });
});
