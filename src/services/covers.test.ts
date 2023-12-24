jest.mock('node:fs', () => {
  const originalFs = jest.requireActual('node:fs');

  return {
    ...originalFs,
    createWriteStream: jest.fn(),
  };
});

jest.mock('./covers.helpers.ts', () => {
  return {
    getGameCoverMetadataBy: jest.fn(),
    getAllGameCovers: jest.fn(),
    createFullOutputPath: jest.fn(),
    downloadFile: jest.fn(),
  };
});

import { getGameCovers, downloadCovers } from './covers';
import { GameCoverMetadata } from '../types';

import isEmpty from 'lodash.isempty';

import { getGameCoverMetadataBy, getAllGameCovers, createFullOutputPath, downloadFile } from './covers.helpers';

describe('unit:services/covers.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGameCovers', () => {
    it('should get the game covers correctly', async () => {
      (getGameCoverMetadataBy as jest.Mock).mockResolvedValue(Promise.resolve({ drafts: [], covers: [] }));
      (getAllGameCovers as jest.Mock).mockResolvedValue(Promise.resolve({}));

      const gameCovers = await getGameCovers('jestGame');
      expect(gameCovers).toBeObject();
      expect(gameCovers).toHaveProperty('jestGame');

      const { jestGame } = gameCovers as { jestGame: Omit<GameCoverMetadata, 'drafts'> };
      expect(jestGame).toBeObject();
      expect(jestGame).toHaveProperty('covers');

      const { covers } = jestGame as { covers: object };
      expect(covers).toBeObject();
      expect(isEmpty(covers)).toBeTrue();
    });

    it('should throw error for one of the searches', async () => {
      const error = 'Invalid gameId';
      (getGameCoverMetadataBy as jest.Mock).mockRejectedValue({ message: error });

      const gameCovers = await getGameCovers('jestGame');
      expect(gameCovers).toBeObject();
    });
  });

  describe('downloadCovers', () => {
      let consoleSpy: jest.SpyInstance;

     beforeEach(() => {
       consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
     });

     afterEach(() => {
       consoleSpy.mockRestore();
     });

    it('should download covers successfully', async () => {
      (createFullOutputPath as jest.Mock).mockReturnValue('/path/to/output');
      (downloadFile as jest.Mock).mockResolvedValue({
        headers: { 'content-disposition': 'filename=test.jpg;' },
        data: { pipe: jest.fn() },
      });

      await downloadCovers([1, 2, 3], '/output');

      expect(createFullOutputPath).toHaveBeenCalledWith('/output');
      expect(downloadFile).toHaveBeenCalledTimes(3);
    });

    it('should handle errors during download', async () => {
      (createFullOutputPath as jest.Mock).mockReturnValue('/path/to/output');
      (downloadFile as jest.Mock).mockRejectedValue(new Error('Download failed'));

      await downloadCovers([1, 2, 3], '/output');

      expect(createFullOutputPath).toHaveBeenCalledWith('/output');
      expect(downloadFile).toHaveBeenCalledTimes(3);

      // Check if the error was thrown
      expect(consoleSpy).toHaveBeenCalledWith("Can't download file: ", expect.any(Error));
      expect(consoleSpy).toHaveBeenCalledTimes(3);
    });
  });

  // it('should get the game covers correctly', async () => {
  //   const { marioGolf: { cover1, cover2} } = mockGameCovers();
  //   const gameId = 'jestGame';

  //   nock(BASE_URL).get(GAME_PROFILE).query({ game_id: gameId }).reply(200, cover1.html, {
  //     'Content-type': 'text/html',
  //   });

  //   nock(BASE_URL).get(GAME_PROFILE).query({ cover: cover1.coverId }).reply(200, cover1.html, {
  //     'Content-type': 'text/html',
  //   });

  //   nock(BASE_URL).get(GAME_PROFILE).query({ cover: cover2.coverId }).reply(200, cover2.html, {
  //     'Content-type': 'text/html',
  //   });

  //   const gameCovers = await getGameCovers(gameId);
  //   expect(gameCovers).toBeObject();
  //   expect(gameCovers).toHaveProperty('jestGames');

  //   const { jestGame } = gameCovers as { jestGame: Omit<GameCoverMetadata, 'drafts'> };
  //   expect(jestGame).toBeObject();
  //   expect(jestGame).toHaveProperty('manuals', []);
  //   expect(jestGame).toHaveProperty('platform', 'GameCube');

  //   expect(jestGame).toHaveProperty('covers');
  //   e
  // })
});