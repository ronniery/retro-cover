import nock from 'nock';

import { GetCoversByPlatformQuery, getAdditionsByPlatform, getCoversByPlatform } from '.';
import { platforms } from './platform.mock';

import { BASE_URL, Consoles, GAME_PROFILE } from '../constants';
import { AddedGame, Matcher, PlatformCover } from '../types';

describe('integration:services/platform.ts', () => {
  const { playstation3 } = platforms;
  const platform = Consoles.amigaCD32;

  describe('getCoversByPlatform', () => {
    const matcher: Matcher = 'A';
    const query: GetCoversByPlatformQuery = { cat_id: `${platform}`, view: matcher };

    it('should parse covers by platform', async () => {
      const scope = nock(BASE_URL).get(GAME_PROFILE).query(query).reply(200, playstation3.covers[matcher].page1, {
        'Content-type': 'text/html',
      });

      const gameCovers = await getCoversByPlatform(platform, matcher);
      expect(gameCovers).toBeObject();

      const { searchTerm } = gameCovers;
      expect(searchTerm).toBeString();
      expect(searchTerm).toEqual(matcher);

      const { pagination } = gameCovers;
      expect(pagination).toBeObject();
      expect(pagination.current).toBe(1);

      const { results } = gameCovers;
      expect(results).toBeArray();
      expect(results.length).toBe(14);
      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining<PlatformCover>({
            covers: expect.any(Number),
            manuals: expect.any(Number),
            gameTitle: expect.any(String),
            source: expect.any(String),
          }),
        ]),
      );

      expect(scope.isDone()).toBeTrue();
    });

    it('should parse the second page', async () => {
      const scope = nock(BASE_URL)
        .get(GAME_PROFILE)
        .query({ ...query, page: '2' })
        .reply(200, playstation3.covers[matcher].page2, {
          'Content-type': 'text/html',
        });

      const gameCovers = await getCoversByPlatform(platform, matcher, { page: '2' });
      expect(gameCovers).toBeObject();

      const { pagination } = gameCovers;
      expect(pagination).toBeObject();
      expect(pagination.current).toBe(2);

      const { results } = gameCovers;
      expect(results).toBeArray();
      expect(results.length).toBe(15);
      expect(results).toEqual(
        expect.arrayContaining([
          expect.objectContaining<PlatformCover>({
            covers: expect.any(Number),
            manuals: expect.any(Number),
            gameTitle: expect.any(String),
            source: expect.any(String),
          }),
        ]),
      );

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
