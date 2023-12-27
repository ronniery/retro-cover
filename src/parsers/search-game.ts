import URL from 'node:url';

import { AbstractParser } from './parser';

import { SearchResult, ServiceResult } from '../types';
import { searchGameSelectors } from '../selectors';
import { BASE_URL, consoleAcronyms, handheldsAcronyms } from '../constants';

export class SearchGameParser extends AbstractParser<ServiceResult<SearchResult[]>> {
  private gameAcronyms: Record<string, string> = {
    ...consoleAcronyms,
    ...handheldsAcronyms,
  };

  public parse(): ServiceResult<SearchResult[]> {
    const { newsHeader } = searchGameSelectors(this.$);
    const [, searchTerm] =
      newsHeader
        .first()
        .text()
        .match(/Search Results for: (.+)/) || [];
    const results = this.getAllResults();

    return {
      searchTerm,
      results,
      pagination: this.getPagination(results.length),
    };
  }

  private getAllResults(): SearchResult[] {
    const { pageBody } = searchGameSelectors(this.$);

    return pageBody
      .find('tr')
      .toArray()
      .map((element) => {
        const $a = this.$(element).find('a');
        const href = $a.attr('href') as string;
        const [, name, platform] = $a.text().match(/^(.*?)(?:\(([^)]*)\))?$/i) ?? [];

        const source = URL.resolve(BASE_URL, href);
        const [, gameId] = href.match(/game_id=(.*)/) ?? [];
        const lowerPlatform = platform.trim().toLowerCase();
        const noacronym = this.gameAcronyms[lowerPlatform] || lowerPlatform;

        return {
          name,
          platform: noacronym.toUpperCase(),
          source,
          gameId: +gameId,
        };
      });
  }
}
