import { SEARCH_GAMES } from '../constants';
import { SearchGameParser, SearchOfflineResult, SearchResult, ServiceResult } from '../parsers';
import coverProjectGames from '../project-games.json';

import httpApi from './client/http-api';

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
    page?: number;
  },
): Promise<ServiceResult<SearchResult[]>> => {
  const query = new URLSearchParams({
    searchstring: gameTitle,
  });

  if (options?.page) {
    query.append('page', options.page.toString());
  }

  const { data } = await httpApi.get<ServiceResult<SearchResult[]>>(`${SEARCH_GAMES}?${query.toString()}`, {
    transformResponse: (html: string) => new SearchGameParser(html).parse(),
  });

  return data;
};
