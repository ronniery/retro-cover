import omit from 'lodash.omit';
import chunk from 'lodash.chunk';
import fs from 'node:fs';

import { BASE_URL, DOWNLOAD_COVER } from '../constants';
import { GameCoverMetadata, GetGameCoverOptions } from '../types';
import { getGameCoverMetadataBy, getAllGameCovers, createFullOutputPath, downloadFile } from './covers.helpers';

export type GameCoverCollection = {
  [gameId: string]: Omit<GameCoverMetadata, 'drafts'> | string;
};

export const getGameCovers = async (
  gameIds: string | string[],
  options?: GetGameCoverOptions,
): Promise<GameCoverCollection> => {
  const games = Array.isArray(gameIds) ? gameIds : [gameIds];

  const allCovers: GameCoverCollection = {};
  for (const gameId of games) {
    try {
      const metadata = await getGameCoverMetadataBy(gameId, options);
      metadata.covers = await getAllGameCovers(metadata.drafts);

      allCovers[gameId] = omit(metadata, 'drafts');
    } catch (e) {
      allCovers[gameId] = (e as Error).message;
    }
  }

  return allCovers;
};

export const downloadCovers = async (
  targets: Array<string | number>,
  outputPath: string,
  parallelDownload = 3,
): Promise<void> => {
  const maxParallelDownloads = Math.min(5, parallelDownload);
  const fullPath = createFullOutputPath(outputPath);

  for (const chunkBlock of chunk(targets, maxParallelDownloads)) {
    const filesToDownload = chunkBlock.map(async (targetUrl) => {
      try {
        let downloadUrl = targetUrl;
        if (typeof +targetUrl === 'number') {
          downloadUrl = `${BASE_URL}${DOWNLOAD_COVER}?src=cdn&cover_id=${targetUrl}`;
        }

        const response = await downloadFile(downloadUrl as string);
        const attachment = (response?.headers['content-disposition'] ?? '') as string;
        const [, filename] = attachment?.match(/filename=(.*);/) ?? [];
        const writeStream = fs.createWriteStream(`${fullPath}/${filename}`);

        response.data.pipe(writeStream);
      } catch (e) {
        console.error("Can't download file: ", e);
      }
    });

    await Promise.all(filesToDownload);
  }
};
