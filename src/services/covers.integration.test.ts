import nock from 'nock';
import path from 'node:path';
import os from 'node:os';
import { promises as fs } from 'node:fs';
import { randomUUID, createHash } from 'node:crypto';

import { mockGameCovers } from './covers.mock';

import { BASE_URL, DOWNLOAD_COVER, GAME_PROFILE } from '../constants';
import { GameCover, GameCoverMetadata } from '../types';
import { downloadCovers, getGameCovers } from './covers';

type TemporaryFile = {
  base64: string;
  type: string;
  size: number;
  getFullPath: () => string;
  getFileName: () => string;
  relativePath: string;
  sha256?: string;
};

describe('integration:services/covers.ts', () => {
  describe('getGameCovers', () => {
    it('should get the game covers correctly', async () => {
      const {
        marioGolf: { cover1, cover2 },
      } = mockGameCovers();

      const gameId = 'jestGame';

      nock(BASE_URL).get(GAME_PROFILE).query({ game_id: gameId }).reply(200, cover1.html, {
        'Content-type': 'text/html',
      });

      nock(BASE_URL).get(GAME_PROFILE).query({ cover_id: cover1.coverId }).reply(200, cover1.html, {
        'Content-type': 'text/html',
      });

      nock(BASE_URL).get(GAME_PROFILE).query({ cover_id: cover2.coverId }).reply(200, cover2.html, {
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

      const { covers } = jestGame as { covers: Array<GameCover> };
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
          format: 'PAL',
          createdBy: 'Grumbleduke',
          region: 'Great Britain',
          caseType: 'DVD Case - Standard',
          downloadedTimes: 1525,
          downloadUrl: 'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=9745',
        },
      ].forEach((cover, coverIndex) => {
        expect(covers[coverIndex]).toStrictEqual(cover);
      });
    });
  });

  describe('downloadCovers', () => {
    let coverImage: TemporaryFile;
    let filename: string;

    beforeEach(async () => {
      filename = randomUUID();
      coverImage = {
        type: 'png',
        size: 228,
        base64:
          'iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsSAAALEgHS3X78AAAAAXNSR0IArs4c6QAAAIlJREFUKFNjZCARMJKonmHgNYBc8B/Z2SABXhER4UVfv37s/v+f5TkfH8+CDx8+5f7//59DUJC/8dWrN7EcHCyavLx8ha9fv4sB+4GXl7f08+fP3RwcHIp8fLwLPnz4mMvIyPidj49vyocPH8p+//59kZeXt+zz589dhDyN1UkkhSwhGzAMo70GAFOFLRfAXuAeAAAAAElFTkSuQmCC',
        sha256: 'b4ae0a8683bbd68e24e442f7191d9743eaeb8ba45e4464ab0507e690f840a6fb',
        relativePath: await fs.realpath(os.tmpdir()),
        getFileName: function (): string {
          return `${filename}.${this.type}`;
        },
        getFullPath: function (): string {
          return path.join(this.relativePath, `${this.getFileName()}`);
        },
      };

      await fs.writeFile(coverImage.getFullPath(), Buffer.from(coverImage.base64, 'base64'));
    });

    afterEach(async () => {
      try {
        await fs.rm(coverImage.getFullPath());
      } catch (e: unknown) {
        console.error("Can't remove file ", e);
      }
    });

    it('should download file correctly in the temp path', async () => {
      const testPath = path.join(coverImage.relativePath, randomUUID());

      nock(BASE_URL)
        .get(DOWNLOAD_COVER)
        .query({ cover_id: 'jest-game', src: 'cdn' })
        .reply(200, await fs.readFile(coverImage.getFullPath(), 'binary'), {
          'content-type': `image/${coverImage.type}`,
          'content-length': coverImage.size.toString(),
          'content-disposition': `attachment; filename=${coverImage.getFileName()}`,
        });

      try {
        await downloadCovers(['jest-game'], testPath);

        const hashSum = createHash('sha256');
        hashSum.update(await fs.readFile(coverImage.getFullPath(), { encoding: 'binary' }));

        const fileStat = await fs.stat(coverImage.getFullPath());
        expect(fileStat.isFile()).toBeTrue();
        expect(fileStat.size).toBe(coverImage.size);
        expect(hashSum.digest('hex')).toBe(coverImage.sha256);
      } finally {
        await fs.rm(testPath, { recursive: true, force: true });
      }
    });
  });
});
