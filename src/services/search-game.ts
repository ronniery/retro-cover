import omit from "lodash.omit";
import { distance } from 'fastest-levenshtein';
import { SEARCH_GAMES } from "../constants/server-paths";
import { SearchOfflineResult, SearchOnlineResult } from "../parsers";
import { SearchGameParser } from "../parsers/search-game.parser";
import httpApi from "./client/http-api";
import coverProjectGames from '../cover-project-games.json';

import { SearchOfflineOptions, SearchOnlineOptions } from "./search-game.types";

export const searchOffline = async (gameTitle: string, options: SearchOfflineOptions = { minLevenshteinDistance: 17 }): Promise<SearchOfflineResult> => {
  const { games } = coverProjectGames;

  const matches = Object
    .entries(games)
    .reduce((reducer, [gameId, gameName]) => {
      if (distance(gameTitle, gameName) >= options?.minLevenshteinDistance) {
        reducer.push({ gameId, gameName });
      }

      return reducer;
    }, [] as SearchOfflineResult);

  return matches;
}

export const searchOnline = async (gameTitle: string, options?: SearchOnlineOptions): Promise<SearchOnlineResult> => {
  const query = new URLSearchParams({
    searchstring: gameTitle
  });

  if (options?.page) {
    query.append('page', options.page.toString());
  }

  const { data } = await httpApi.get<SearchOnlineResult>(`${SEARCH_GAMES}?${query.toString()}`, {
    transformResponse: (html: string) =>
      new SearchGameParser(html).parse()
  });

  return data;
}