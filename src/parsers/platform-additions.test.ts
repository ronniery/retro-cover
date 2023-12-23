import orderBy from 'lodash.orderby';
import { AddedGame } from '../types';
import { PlatformAdditionsParser } from './platform-additions';
import { newAdditions } from './platform-additions.mock';

describe('parser/platform-additions.ts PlatformAdditionsParser', () => {
  const { playstation2, playstation3, atariLynx, sega32x } = newAdditions;

  it('should parse Playstation 2 additions', () => {
    const platformAdditions = new PlatformAdditionsParser(playstation2).parse();

    expect(platformAdditions).toBeObject();
    expect(platformAdditions).toHaveProperty('addedGames');
    expect(platformAdditions).toHaveProperty('platformInfo');

    const { addedGames } = platformAdditions;
    expect(addedGames).toBeArray();
    expect(addedGames.length).toBe(30);
    expect(addedGames).toEqual(
      expect.arrayContaining([
        expect.objectContaining<AddedGame>({
          country: expect.toBeOneOf([expect.any(String), null]),
          dateAdded: expect.any(Date),
          format: expect.toBeOneOf([expect.any(String), null]),
          gameTitle: expect.toBeOneOf([expect.any(String), null]),
        }),
      ]),
    );

    const { platformInfo } = platformAdditions;
    expect(platformInfo).toBeObject();
    expect(platformInfo).toHaveProperty('platform', 'Playstation 2');
    expect(platformInfo).toHaveProperty('availableCovers', 2003);
  });

  it('should parse Playstation 3 additions', () => {
    const platformAdditions = new PlatformAdditionsParser(playstation3).parse();

    expect(platformAdditions).toBeObject();
    expect(platformAdditions).toHaveProperty('addedGames');
    expect(platformAdditions).toHaveProperty('platformInfo');

    const { addedGames } = platformAdditions;
    expect(addedGames).toBeArray();
    expect(addedGames.length).toBe(30);
    expect(addedGames).toEqual(
      expect.arrayContaining([
        expect.objectContaining<AddedGame>({
          country: expect.toBeOneOf([expect.any(String), null]),
          dateAdded: expect.any(Date),
          format: expect.toBeOneOf([expect.any(String), null]),
          gameTitle: expect.toBeOneOf([expect.any(String), null]),
        }),
      ]),
    );

    const { platformInfo } = platformAdditions;
    expect(platformInfo).toBeObject();
    expect(platformInfo).toHaveProperty('platform', 'Playstation 3');
    expect(platformInfo).toHaveProperty('availableCovers', 1275);
  })

  it('should parse Atari Lynx additions', () => {
    const platformAdditions = new PlatformAdditionsParser(atariLynx).parse();

    expect(platformAdditions).toBeObject();
    expect(platformAdditions).toHaveProperty('addedGames');
    expect(platformAdditions).toHaveProperty('platformInfo');

    const { addedGames } = platformAdditions;
    expect(addedGames).toBeArray();
    expect(addedGames.length).toBe(30);
    expect(addedGames).toEqual(
      expect.arrayContaining([
        expect.objectContaining<AddedGame>({
          country: expect.toBeOneOf([expect.any(String), null]),
          dateAdded: expect.any(Date),
          format: expect.toBeOneOf([expect.any(String), null]),
          gameTitle: expect.toBeOneOf([expect.any(String), null]),
        }),
      ]),
    );

    const { platformInfo } = platformAdditions;
    expect(platformInfo).toBeObject();
    expect(platformInfo).toHaveProperty('platform', 'Atari Lynx');
    expect(platformInfo).toHaveProperty('availableCovers', 66);
  });

  it('should parse Sega 32X additions', () => {
    const platformAdditions = new PlatformAdditionsParser(sega32x).parse();

    expect(platformAdditions).toBeObject();
    expect(platformAdditions).toHaveProperty('addedGames');
    expect(platformAdditions).toHaveProperty('platformInfo');

    const { addedGames } = platformAdditions;
    expect(addedGames).toBeArray();
    expect(addedGames.length).toBe(30);
    expect(addedGames).toEqual(
      expect.arrayContaining([
        expect.objectContaining<AddedGame>({
          country: expect.toBeOneOf([expect.any(String), null]),
          dateAdded: expect.any(Date),
          format: expect.toBeOneOf([expect.any(String), null]),
          gameTitle: expect.toBeOneOf([expect.any(String), null]),
        }),
      ]),
    );

    const { platformInfo } = platformAdditions;
    expect(platformInfo).toBeObject();
    expect(platformInfo).toHaveProperty('platform', 'Sega 32X');
    expect(platformInfo).toHaveProperty('availableCovers', 57);
  });

  it('should parse the game additions ignoring empty items', () => {
    const platformAdditions = new PlatformAdditionsParser(playstation3).parse({
      ignoreEmpty: true
    });

    expect(platformAdditions).toBeObject();
    expect(platformAdditions).toHaveProperty('addedGames');
    expect(platformAdditions).toHaveProperty('platformInfo');

    const { addedGames } = platformAdditions;
    expect(addedGames).toBeArray();
    expect(addedGames.length).toBe(21);
    expect(addedGames).toEqual(
      expect.arrayContaining([
        expect.objectContaining<AddedGame>({
          country: expect.toBeOneOf([expect.any(String), null]),
          dateAdded: expect.any(Date),
          format: expect.toBeOneOf([expect.any(String), null]),
          gameTitle: expect.toBeOneOf([expect.any(String), null]),
        }),
      ]),
    );

    const { platformInfo } = platformAdditions;
    expect(platformInfo).toBeObject();
    expect(platformInfo).toHaveProperty('platform', 'Playstation 3');
    expect(platformInfo).toHaveProperty('availableCovers', 1275);
  });

  it('should parse the game additions ordering the result', () => {
    const unordered = new PlatformAdditionsParser(playstation3).parse();
    const ordered = new PlatformAdditionsParser(playstation3).parse({
      order: {
        country: 'asc'
      }
    });

    expect(ordered.addedGames).toBeArray();
    expect(ordered.addedGames.length).toEqual(unordered.addedGames.length);
    expect(ordered.addedGames).not.toEqual(unordered.addedGames);
    expect(orderBy(unordered.addedGames, ['country'], ['asc'])).toEqual(ordered.addedGames);
    expect(ordered.addedGames).toEqual(
      expect.arrayContaining([
        expect.objectContaining<AddedGame>({
          country: expect.toBeOneOf([expect.any(String), null]),
          dateAdded: expect.any(Date),
          format: expect.toBeOneOf([expect.any(String), null]),
          gameTitle: expect.toBeOneOf([expect.any(String), null]),
        }),
      ]),
    );
  });

  it('should parse the game additions filtering by given date', () => {
    const platformAdditions = new PlatformAdditionsParser(playstation3).parse({
      startingAt: new Date('2023-09-30T23:00:00.000Z'), // october
    });

    expect(platformAdditions).toBeObject();
    expect(platformAdditions).toHaveProperty('addedGames');
    expect(platformAdditions).toHaveProperty('platformInfo');

    const { addedGames } = platformAdditions;
    expect(addedGames).toBeArray();
    expect(addedGames.length).toBe(16);
    expect(addedGames).toEqual(
      expect.arrayContaining([
        expect.objectContaining<AddedGame>({
          country: expect.toBeOneOf([expect.any(String), null]),
          dateAdded: expect.any(Date),
          format: expect.toBeOneOf([expect.any(String), null]),
          gameTitle: expect.toBeOneOf([expect.any(String), null]),
        }),
      ]),
    );

    const { platformInfo } = platformAdditions;
    expect(platformInfo).toBeObject();
    expect(platformInfo).toHaveProperty('platform', 'Playstation 3');
    expect(platformInfo).toHaveProperty('availableCovers', 1275);
  });
});
