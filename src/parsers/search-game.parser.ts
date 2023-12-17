import URL from 'node:url';

import { searchGameSelectors } from "@/selectors";
import { BASE_URL } from "@/constants";

import { Platforms, SearchOnlineResult } from "./parser.types";
import { AbstractParser } from "./parser";

export class SearchGameParser extends AbstractParser<SearchOnlineResult> {

  parse(): SearchOnlineResult {
    const { pageBody, spanThisPage, paginatorChildren, newsHeader } = searchGameSelectors(this.$);
    const [, searchTerm] = newsHeader.first().text().match(/Search Results for: (.+)/) || [];
    const results = pageBody.find('tr').toArray().map((element) => {
      const $a = this.$(element).find('a');
      const href = $a.attr('href') ?? '';
      const [, name, platform] = $a.text().match(/(.+?)\s\((.+?)\)/i) ?? [];
      const source = URL.resolve(BASE_URL, href);
      const [, gameId] = href.match(/game_id=(.*)/) ?? []

      return { name, platform: platform as unknown as Platforms, source, gameId: +gameId };
    });

    // Extract pagination information
    const current = parseInt(spanThisPage.text());
    const pageSize = results.length;
    const totalPages = parseInt(paginatorChildren.last().text());
    const next = current === totalPages ? null : current + 1;
    const prev = current === 1 ? null : current - 1;

    return {
      searchTerm,
      results,
      pagination: {
        current,
        pageSize,
        totalPages,
        next,
        prev
      }
    }
  }
}