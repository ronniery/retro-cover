import omit from 'lodash.omit';
import chunk from 'lodash.chunk';
import axios, { AxiosResponse } from 'axios';
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';

import httpApi from './client/http-api';
import { BASE_URL, DOWNLOAD_COVER, GAME_COVERS, GAME_PROFILE } from '../constants';
import { GameCoverMetadataParser, GameCoverParser } from '../parsers/game-covers';
import { GameCover, GameCoverMetadata, GameCoverMetadataOptions } from '../parsers';

export type GameCoverCollection = {
  [gameId: string]: Omit<GameCoverMetadata, 'drafts'> | string;
};

export type GetGameCoverOptions = Omit<GameCoverMetadataOptions, 'gameId'>;

const HOME_TITLE = 'The Cover Project > Home' as const;

const getGameCoverMetadataBy = async (gameId: string, options?: GetGameCoverOptions): Promise<GameCoverMetadata> => {
  const { data: profile } = await httpApi.get<string>(GAME_PROFILE, {
    query: { game_id: gameId },
  });

  if (profile.includes(HOME_TITLE)) throw new Error('Invalid gameId given');

  return new GameCoverMetadataParser(profile).parse(Object.assign({}, options, { gameId }));
};

const getAllGameCovers = async (drafts: GameCoverMetadata['drafts']): Promise<GameCover[]> => {
  const coverPromises = drafts.map(async ({ coverId }) => {
    const { data } = await httpApi.get<GameCover>(GAME_COVERS, {
      query: { cover_id: coverId },
      transformResponse: (html: string) => new GameCoverParser(html, false).parse(),
    });

    return data;
  });

  return await Promise.all(coverPromises);
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

const createFullOutputPath = (outputPath: string): string => {
  const fullPath = path.resolve(__dirname, outputPath);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  return fullPath;
};

const downloadFile = async (downloadUrl: string): Promise<AxiosResponse<fs.WriteStream, unknown>> => {
  return axios.get(downloadUrl, {
    responseType: 'stream',
    onDownloadProgress(progressEvent) {
      progressEvent.progress;
      console.log(`Total size: ${progressEvent.total}`);
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });
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
        console.log("Can't download file: ", e);
      }
    });

    await Promise.all(filesToDownload);
  }
};
