import omit from 'lodash.omit';
import chunk from 'lodash.chunk';

import { getGameCoverMetadataBy, getAllGameCovers, createFullOutputPath, createFileStreams } from './covers.helpers';

import { GameCoverMetadata, GetGameCoverOptions } from '../types';

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
    const filesToDownload = createFileStreams(chunkBlock, fullPath);

    await Promise.allSettled(filesToDownload);
  }
};
