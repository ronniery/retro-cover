jest.mock('node:fs', () => {
  const originalFs = jest.requireActual('node:fs');

  return {
    ...originalFs,
    createWriteStream: jest.fn(),
  };
});

import { type WriteStream } from 'fs';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import isEmpty from 'lodash.isempty';

import * as helpers from './covers.helpers';
import { getGameCovers, downloadCovers } from './covers';

import { GameCover, GameCoverMetadata } from '../types';

describe('unit:services/covers.ts', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('getGameCovers', () => {
    it('should get the game covers correctly', async () => {
      jest.spyOn(helpers, 'getAllGameCovers').mockResolvedValueOnce(Promise.resolve([]));
      jest.spyOn(helpers, 'getGameCoverMetadataBy').mockResolvedValueOnce(
        Promise.resolve({
          covers: [],
          drafts: [],
          gameTitle: '',
          manuals: [],
          platform: '',
          source: '',
        }),
      );

      const gameCovers = await getGameCovers('jestGame');
      expect(gameCovers).toBeObject();
      expect(gameCovers).toHaveProperty('jestGame');

      const { jestGame } = gameCovers as { jestGame: Omit<GameCoverMetadata, 'drafts'> };
      expect(jestGame).toBeObject();
      expect(jestGame).toHaveProperty('covers');

      const { covers } = jestGame as { covers: Array<GameCover> };
      expect(covers).toBeArray();
      expect(isEmpty(covers)).toBeTrue();
    });

    it('should throw error for one of the searches', async () => {
      const error = 'Invalid gameId';
      jest.spyOn(helpers, 'getGameCoverMetadataBy').mockRejectedValueOnce({ message: error });

      const gameCovers = await getGameCovers('jestGame');
      expect(gameCovers).toBeObject();
    });
  });

  describe('downloadCovers', () => {
    it('should download covers successfully', async () => {
      const response = {
        headers: { 'content-disposition': 'filename=test.jpg;' },
        data: { pipe: jest.fn() } as unknown as WriteStream,
        config: {} as InternalAxiosRequestConfig<unknown>,
        status: 200,
        statusText: '',
      } as AxiosResponse<WriteStream, unknown>;

      jest.spyOn(helpers, 'createFullOutputPath').mockReturnValueOnce('/path/to/output');
      jest.spyOn(helpers, 'downloadFile').mockResolvedValueOnce(response);

      await downloadCovers([1, 2, 3], '/output');

      expect(helpers.createFullOutputPath).toHaveBeenCalledWith('/output');
      expect(helpers.downloadFile).toHaveBeenCalledTimes(3);
    }, 15000);

    it('should handle errors during download', async () => {
      jest.spyOn(helpers, 'createFullOutputPath').mockReturnValueOnce('/path/to/output');
      jest.spyOn(helpers, 'downloadFile').mockRejectedValue('Download failed');

      await downloadCovers([1], '/output');

      expect(helpers.createFullOutputPath).toHaveBeenCalledWith('/output');
      expect(helpers.downloadFile).toHaveBeenCalledTimes(1);
    }, 10000);
  });
});
