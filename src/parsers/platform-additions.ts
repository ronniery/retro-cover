import orderBy from 'lodash.orderby';
import isEmpty from 'lodash.isempty';
import isDate from 'lodash.isdate';
import { decode } from 'html-entities';

import { AbstractParser } from './parser';
import { GameAdditions, PlatformAdditionsOptions, AddedGame } from '../types';

import { platformAdditionsSelectors } from '../selectors';
import { projectCountries } from '../utils/project-countries';

export type CountryDictionary = { [key: string]: string };

export class PlatformAdditionsParser extends AbstractParser<GameAdditions, PlatformAdditionsOptions> {
  private readonly headerRegex = /(?<platform>.+?) Game Covers \((?<availableCovers>\d+) Covers\) > Newest Covers/;

  public parse(options?: PlatformAdditionsOptions): GameAdditions {
    const { newsHeader } = platformAdditionsSelectors(this.$);
    const headerText = decode(newsHeader.text());
    const headerMatch = headerText.match(this.headerRegex) as RegExpMatchArray;
    const { groups = {} } = headerMatch;

    const platformInfo = {
      platform: groups.platform || null,
      availableCovers: groups.availableCovers ? parseInt(groups.availableCovers, 10) : null,
    };

    let addedGames = this.getAllAdditions(options?.ignoreEmpty);

    const { startingAt } = options ?? {};
    if (isDate(startingAt)) {
      addedGames = addedGames.filter(({ dateAdded }) => dateAdded >= startingAt);
    }

    const { order } = options ?? {};
    if (!isEmpty(order)) {
      addedGames = orderBy(addedGames, ...Object.keys(order), ...Object.values(order));
    }

    return { platformInfo, addedGames };
  }

  private getAllAdditions(ignoreEmpty: boolean = false): Array<AddedGame> {
    const { gameRows, articleText, smallArticleText } = platformAdditionsSelectors(this.$);

    return gameRows.toArray().reduce((accumulator, element): Array<AddedGame> => {
      const allElements = this.$(element).find('td');
      const header = allElements.eq(0).find(articleText) as cheerio.Cheerio;
      const headerHtml = header.html() as string;

      if (ignoreEmpty && /x\sempty/i.test(headerHtml)) return accumulator;

      const [, nameMatch = null] = headerHtml.match(/>(.+?)</) ?? [];
      const [, formatMatch = null] = headerHtml.replace(/^<a.*a>/, '').match(/\(([a-z]+)(\)|\/)/i) ?? [];
      const [, countryMatch = null] = headerHtml.match(/flags\/(.+?).png/) ?? [];

      const game = {
        format: formatMatch,
        country: this.convertCountryInitials(countryMatch),
        gameTitle: decode(nameMatch),
        dateAdded: new Date(),
      };

      const dateText = allElements.eq(1).find(smallArticleText).text();
      const [, dateString] = dateText.match(/Added: (.+)/) ?? [];

      if (dateString && dateString !== 'Today') {
        game.dateAdded = new Date(`${dateString} UTC`);
      }

      return [...accumulator, game];
    }, [] as Array<AddedGame>);
  }

  private convertCountryInitials(initials: string | null): string | null | 'Unknown' {
    if (initials === null) return initials;

    const countries: CountryDictionary = projectCountries;
    return countries[initials] ?? 'Unknown';
  }
}
