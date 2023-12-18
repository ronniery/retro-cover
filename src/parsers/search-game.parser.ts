import URL from 'node:url';

import { Platforms, SearchResult, ServiceResult } from './parser.types';
import { AbstractParser } from './parser';

import { searchGameSelectors } from '../selectors';
import { BASE_URL } from '../constants';

export class SearchGameParser extends AbstractParser<ServiceResult<SearchResult[]>> {
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
        const href = $a.attr('href') ?? '';
        const [, name, platform] = $a.text().match(/(.+?)\s\((.+?)\)/i) ?? [];
        const source = URL.resolve(BASE_URL, href);
        const [, gameId] = href.match(/game_id=(.*)/) ?? [];

        return {
          name,
          platform: platform as unknown as Platforms,
          source,
          gameId: +gameId,
        };
      });
  }
}
