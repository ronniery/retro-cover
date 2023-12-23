import nock from 'nock';
import { BASE_URL, GAME_PROFILE } from '../constants';
import { GameCover, GameCoverMetadata } from '../types';
import { getGameCovers } from './covers';
import { mockGameCovers } from './covers.mock';

describe('integration:services/covers.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGameCovers', () => {
    it('should get the game covers correctly', async () => {
      const {
        marioGolf: { cover1, cover2 },
      } = mockGameCovers();

      const gameId = 'jestGame';

      nock(BASE_URL).get(GAME_PROFILE).query({ game_id: gameId }).reply(200, cover1.html, {
        'Content-type': 'text/html',
      });

      nock(BASE_URL).get(GAME_PROFILE).query({ cover: cover1.coverId }).reply(200, cover1.html, {
        'Content-type': 'text/html',
      });

      nock(BASE_URL).get(GAME_PROFILE).query({ cover: cover2.coverId }).reply(200, cover2.html, {
        'Content-type': 'text/html',
      });

      const gameCovers = await getGameCovers(gameId);
      expect(gameCovers).toBeObject();
      expect(gameCovers).toHaveProperty(gameId);

      const { jestGame } = gameCovers as { jestGame: Omit<GameCoverMetadata, 'drafts'> };
      expect(jestGame).toBeObject();
      expect(jestGame).toHaveProperty('manuals', []);
      expect(jestGame).toHaveProperty('platform', 'GameCube');
      expect(jestGame).toHaveProperty('covers');
      expect(jestGame).toHaveProperty('gameTitle', 'Mario Golf: Toadstool Tour');
      expect(jestGame).toHaveProperty('source', 'http://www.thecoverproject.net/view.php?cover_id=jestGame');

      const { covers } = jestGame as { covers:Array<GameCover>};
      expect(covers).toBeArray();
      expect(covers.length).toBe(2);

      [
        {
          description: 'Retail Cover',
          format: 'NTSC',
          createdBy: 'wshbrngr',
          region: 'United States',
          caseType: 'Gamecube Case',
          downloadedTimes: 40808,
          downloadUrl: 'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=8285',
        },
        {
          description: 'Retail Cover',
          format: 'NTSC',
          createdBy: 'wshbrngr',
          region: 'United States',
          caseType: 'Gamecube Case',
          downloadedTimes: 40808,
          downloadUrl: 'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=8285',
        },
      ].forEach((cover, coverIndex) => {
        expect(covers[coverIndex]).toStrictEqual(cover);
      });
    });
  });

  describe('downloadCovers', () => {
    // TODO
  });
});