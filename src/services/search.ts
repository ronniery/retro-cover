import httpApi from './client/http-api';

import { ServiceResult, SearchResult } from '../types';
import { SEARCH_GAMES } from '../constants';
import { SearchGameParser } from '../parsers';
import coverProjectGames from '../project-games.json';

export type OfflineResult = {
  gameId: string;
  gameName: string;
};

export type SearchOfflineResult = Array<OfflineResult>;

export const searchOffline = async (gameTitle: string): Promise<SearchOfflineResult> => {
  const { games } = coverProjectGames;

  const matches = Object.entries(games)
    .filter(([, gameName]) => new RegExp(gameTitle, 'i').test(gameName))
    .map(([gameId, gameName]) => ({ gameId, gameName }));

  return matches;
};

export const searchOnline = async (
  gameTitle: string,
  options?: {
    page?: string;
  },
): Promise<ServiceResult<SearchResult[]>> => {
  const query: { searchstring: string; page?: string } = {
    searchstring: gameTitle,
  };

  if (options?.page) {
    query.page = options.page;
  }

  const { data } = await httpApi.get<ServiceResult<SearchResult[]>>(SEARCH_GAMES, {
    query,
    transformResponse: (html: string) => {
      return new SearchGameParser(html).parse();
    },
  });

  return data;
};
