import orderBy from 'lodash.orderby';

import { PlatformAdditionsParser } from './platform-additions';
import { newAdditions } from './platform-additions.mock';

import { AddedGame, GameAdditions, PlatformAdditionsOptions } from '../types';

type ExpectPlatformOptions = Partial<{
  parserOptions?: PlatformAdditionsOptions;
  expectation: {
    totalOfGames: number;
    platform: GameAdditions['platformInfo']['platform'];
    availableCovers: GameAdditions['platformInfo']['availableCovers'];
  };
}>;

describe('parser/platform-additions.ts PlatformAdditionsParser', () => {
  const { playstation2, playstation3, atariLynx, sega32x } = newAdditions;

  const expectPlatformParse = (html: string, options: ExpectPlatformOptions): GameAdditions => {
    const { parserOptions, expectation } = options;
    const additions = new PlatformAdditionsParser(html).parse(parserOptions);

    expect(additions).toBeObject();
    expect(additions).toHaveProperty('addedGames');
    expect(additions).toHaveProperty('platformInfo');

    const { addedGames } = additions;
    expect(addedGames).toBeArray();
    expect(addedGames.length).toBe(expectation?.totalOfGames);
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

    const { platformInfo } = additions;
    expect(platformInfo).toBeObject();
    expect(platformInfo).toHaveProperty('platform', expectation?.platform);
    expect(platformInfo).toHaveProperty('availableCovers', expectation?.availableCovers);

    return additions;
  };

  // Parsing a bunch of different platform pages, to check if the parser is not biased
  it('should parse Playstation 2 additions', () => {
    expectPlatformParse(playstation2, {
      expectation: {
        totalOfGames: 30,
        platform: 'Playstation 2',
        availableCovers: 2003,
      },
    });
  });

  it('should parse Playstation 3 additions', () => {
    expectPlatformParse(playstation3, {
      expectation: {
        totalOfGames: 30,
        platform: 'Playstation 3',
        availableCovers: 1275,
      },
    });
  });

  it('should parse Atari Lynx additions', () => {
    expectPlatformParse(atariLynx, {
      expectation: {
        totalOfGames: 30,
        platform: 'Atari Lynx',
        availableCovers: 66,
      },
    });
  });

  it('should parse Sega 32X additions', () => {
    expectPlatformParse(sega32x, {
      expectation: {
        totalOfGames: 30,
        platform: 'Sega 32X',
        availableCovers: 57,
      },
    });
  });

  it('should parse the game additions ignoring empty items', () => {
    expectPlatformParse(playstation3, {
      parserOptions: { ignoreEmpty: true },
      expectation: {
        totalOfGames: 21,
        platform: 'Playstation 3',
        availableCovers: 1275,
      },
    });
  });

  it('should parse the game additions ordering the result', () => {
    const unordered = new PlatformAdditionsParser(playstation3).parse();
    const ordered = expectPlatformParse(playstation3, {
      parserOptions: {
        order: {
          country: 'asc',
        },
      },
      expectation: {
        totalOfGames: 30,
        platform: 'Playstation 3',
        availableCovers: 1275,
      },
    });

    expect(ordered.addedGames.length).toEqual(unordered.addedGames.length);
    expect(ordered.addedGames).not.toEqual(unordered.addedGames);
    expect(orderBy(unordered.addedGames, ['country'], ['asc'])).toEqual(ordered.addedGames);
  });

  it('should parse the game additions filtering by given date', () => {
    expectPlatformParse(playstation3, {
      parserOptions: {
        startingAt: new Date('2023-09-30T23:00:00.000Z'), // october
      },
      expectation: {
        totalOfGames: 16,
        platform: 'Playstation 3',
        availableCovers: 1275,
      },
    });
  });
});
