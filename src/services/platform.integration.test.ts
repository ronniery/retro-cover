import nock from 'nock';

import { getAdditionsByPlatform } from '.';
import { platforms } from './platform.mock';

import { BASE_URL, Consoles, GAME_PROFILE } from '../constants';
import { AddedGame, Matcher } from '../types';
import { expectPlatformCovers, mockRequest } from '../utils';

describe('integration:services/platform.ts', () => {
  const { playstation3 } = platforms;
  const platform = Consoles.amigaCD32;

  describe('getCoversByPlatform', () => {
    const matcher: Matcher = 'A';

    it('should parse covers by platform', async () => {
      const scope = mockRequest({
        path: GAME_PROFILE,
        query: { cat_id: `${platform}`, view: matcher },
        body: playstation3.covers[matcher].page1,
      });

      await expectPlatformCovers({
        params: {
          platform,
          matcher,
        },
        assertion: {
          expect,
          totalOfResults: 14,
        },
      });

      expect(scope.isDone()).toBeTrue();
    });

    it('should parse the second page', async () => {
      const scope = mockRequest({
        path: GAME_PROFILE,
        query: { cat_id: `${platform}`, view: matcher, page: '2' },
        body: playstation3.covers[matcher].page2,
      });

      await expectPlatformCovers({
        params: {
          platform,
          matcher,
          options: { page: '2' },
        },
        assertion: {
          expect,
          totalOfResults: 15,
        },
      });

      expect(scope.isDone()).toBeTrue();
    });
  });

  describe('getAdditionsByPlatform', () => {
    it('should fetch additions by platform', async () => {
      const scope = nock(BASE_URL).get(GAME_PROFILE).query({ cat_id: platform }).reply(200, playstation3.additions, {
        'Content-type': 'text/html',
      });

      const gameAdditions = await getAdditionsByPlatform(Consoles.amigaCD32);
      expect(gameAdditions).toBeObject();

      const { platformInfo } = gameAdditions;
      expect(platformInfo).toBeObject();
      expect(platformInfo).toHaveProperty('platform', 'Playstation 3');
      expect(platformInfo).toHaveProperty('availableCovers', 1275);

      const { addedGames } = gameAdditions;
      expect(addedGames).toBeArray();
      expect(addedGames.length).toBe(30);
      expect(addedGames).toEqual(
        expect.arrayContaining([
          expect.objectContaining<AddedGame>({
            format: expect.any(String),
            country: expect.any(String),
            dateAdded: expect.any(Date),
            gameTitle: expect.any(String),
          }),
        ]),
      );

      expect(scope.isDone()).toBeTrue();
    });

    it('should fetch additions by platform, ignoring empty', async () => {
      const scope = nock(BASE_URL).get(GAME_PROFILE).query({ cat_id: platform }).reply(200, playstation3.additions, {
        'Content-type': 'text/html',
      });

      const gameAdditions = await getAdditionsByPlatform(Consoles.amigaCD32, {
        ignoreEmpty: true,
      });

      expect(gameAdditions.addedGames).toBeArray();
      expect(gameAdditions.addedGames.length).toBe(21);
      expect(scope.isDone()).toBeTrue();
    });

    it('should fetch additions by platform, filtering by date', async () => {
      const startingAt = new Date('2023-09-30T23:00:00.000Z'); // october
      const scope = nock(BASE_URL).get(GAME_PROFILE).query({ cat_id: platform }).reply(200, playstation3.additions, {
        'Content-type': 'text/html',
      });

      const gameAdditions = await getAdditionsByPlatform(Consoles.amigaCD32, {
        startingAt,
      });

      expect(gameAdditions.addedGames).toBeArray();
      expect(gameAdditions.addedGames.length).toBe(16);

      gameAdditions.addedGames.forEach((addedGame) => {
        expect(addedGame.dateAdded >= startingAt).toBeTrue();
      });

      expect(scope.isDone()).toBeTrue();
    });

    it('should fetch additions by platform, ordering by country', async () => {
      const scope = nock(BASE_URL).get(GAME_PROFILE).query({ cat_id: platform }).reply(200, playstation3.additions, {
        'Content-type': 'text/html',
      });

      const gameAdditions = await getAdditionsByPlatform(Consoles.amigaCD32, {
        order: {
          country: 'asc',
        },
      });

      const { addedGames } = gameAdditions;
      expect(addedGames).toBeArray();
      expect(addedGames.length).toBe(30);
      expect(addedGames[0]).toStrictEqual<AddedGame>({
        country: 'Japan',
        dateAdded: new Date('2023-09-27T00:00:00.000Z'),
        format: 'NTSC',
        gameTitle: 'Resident Evil 6',
      });

      expect(scope.isDone()).toBeTrue();
    });
  });
});
