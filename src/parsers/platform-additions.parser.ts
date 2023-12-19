import orderBy from 'lodash.orderby';
import isEmpty from 'lodash.isempty';
import isDate from 'lodash.isdate';
import { decode } from 'html-entities';

import { AbstractParser } from './parser';
import { GameAdditions, PlatformAdditionsOptions, AddedGame, CountryDictionary } from './parser.types';

import { platformAdditionsSelectors } from '../selectors';
import { projectCountries } from '../utils/project-countries';

export class PlatformAdditionsParser extends AbstractParser<GameAdditions, PlatformAdditionsOptions> {
  private readonly headerRegex = /(?<platform>.+?) Game Covers \((?<availableCovers>\d+) Covers\) > Newest Covers/;

  public parse(options?: PlatformAdditionsOptions): GameAdditions {
    const { newsHeader } = platformAdditionsSelectors(this.$);
    const headerText = newsHeader.text();
    const headerMatch = headerText.match(this.headerRegex);

    const platformInfo = {
      platform: headerMatch?.groups?.platform || null,
      availableCovers: headerMatch?.groups?.availableCovers ? parseInt(headerMatch.groups.availableCovers, 10) : null,
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
      const tds = this.$(element).find('td');
      const inputText = tds.eq(0).find(articleText).html() ?? '';

      if (ignoreEmpty && /x\sempty/i.test(inputText)) return accumulator;

      const [, nameMatch] = inputText.match(/>(.+?)</) ?? [];
      const [, formatMatch] = inputText.match(/>\s\(([a-z]+)\/?/i) ?? [];
      const [, countryMatch] = inputText.match(/flags\/(.+?).png/) ?? [];

      const game = {
        format: formatMatch ? formatMatch : null,
        country: countryMatch ? this.convertCountryInitials(countryMatch) : null,
        gameTitle: nameMatch ? decode(nameMatch) : null,
        dateAdded: new Date(),
      };

      const dateText = tds.eq(1).find(smallArticleText).text();
      const [, dateString] = dateText.match(/Added: (.+)/) ?? [];

      if (dateString && dateString !== 'Today') {
        game.dateAdded = new Date(`${dateString} UTC`);
      }

      return [...accumulator, game];
    }, [] as Array<AddedGame>);
  }

  private convertCountryInitials(initials: string): string | 'Unknown' {
    const countries: CountryDictionary = projectCountries;
    return countries[initials] ?? 'Unknown';
  }
}
