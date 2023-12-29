import axios, { AxiosResponse } from 'axios';
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';

import httpApi from './client/http-api';

import { BASE_URL, DOWNLOAD_COVER, GAME_COVERS, GAME_PROFILE } from '../constants';
import { GameCoverMetadataParser, GameCoverParser } from '../parsers/game-covers';
import { GameCover, GameCoverMetadata, GetGameCoverOptions } from '../types';

const HOME_TITLE = 'The Cover Project > Home' as const;

export const getGameCoverMetadataBy = async (
  gameId: string,
  options?: GetGameCoverOptions,
): Promise<GameCoverMetadata> => {
  const { data: profile } = await httpApi.get<string>(GAME_PROFILE, {
    query: { game_id: gameId },
  });

  if (profile.includes(HOME_TITLE)) throw new Error('Invalid gameId given');

  return new GameCoverMetadataParser(profile).parse(Object.assign({}, options, { gameId }));
};

export const getAllGameCovers = async (drafts: GameCoverMetadata['drafts']): Promise<GameCover[]> => {
  const coverPromises = drafts.map(async ({ coverId }) => {
    const { data } = await httpApi.get<GameCover>(GAME_COVERS, {
      query: { cover_id: coverId },
      transformResponse: (html: string) => new GameCoverParser(html, false).parse(),
    });

    return data;
  });

  return await Promise.all(coverPromises);
};

export const createFullOutputPath = (outputPath: string): string => {
  const fullPath = path.resolve(__dirname, outputPath);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }

  return fullPath;
};

export const downloadFile = async (downloadUrl: string): Promise<AxiosResponse<fs.WriteStream, unknown>> => {
  return axios.get(downloadUrl, {
    responseType: 'stream',
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });
};

export const getFileStream = async (targetUrl: string | number, fullPath: string): Promise<void> => {
  let downloadUrl = targetUrl;
  if (typeof +targetUrl === 'number') {
    downloadUrl = `${BASE_URL}${DOWNLOAD_COVER}?src=cdn&cover_id=${targetUrl}`;
  }

  const response = await downloadFile(downloadUrl as string);
  const attachment = (response?.headers['content-disposition'] ?? '') as string;
  const [, filename] = attachment?.match(/filename=(.*);/) ?? [];
  const writeStream = fs.createWriteStream(`${fullPath}/${filename}`);

  response.data.pipe(writeStream);
};

export const createFileStreams = (chunkBlock: Array<string | number>, fullPath: string): Promise<void>[] => {
  return chunkBlock.map(async (targetUrl) => {
    try {
      await getFileStream(targetUrl, fullPath);
    } catch (e: unknown) {
      throw new Error("Can't download file: " + (e as Error).message);
    }
  });
};
