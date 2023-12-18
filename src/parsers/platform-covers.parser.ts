import URL from 'node:url';

import { AbstractParser } from './parser';

import { BASE_URL } from '../constants';
import { PlatformCover, ServiceResult } from './parser.types';
import { platformCoversSelectors } from '../selectors';

export class PlatformCoverParser extends AbstractParser<ServiceResult<PlatformCover[]>> {
  private readonly availableAssets = /<!--.*NumCovers: (\d+) \| NumManuals: (\d+)-->/;

  public parse(): ServiceResult<PlatformCover[]> {
    const { newsHeader } = platformCoversSelectors(this.$);
    const [, searchTerm] =
      newsHeader
        .first()
        .text()
        .match(/> (.+)/) ?? []; /*.trim();*/
    const results = this.getAllCovers();

    return {
      searchTerm,
      results,
      pagination: this.getPagination(results.length),
    };
  }

  private getAllCovers(): Array<PlatformCover> {
    const { pageBodyLines, spanArticleText } = platformCoversSelectors(this.$);

    return pageBodyLines.toArray().reduce((accumulator, element) => {
      const $el = this.$(element).find(spanArticleText);
      const [, covers, manuals] = $el?.html()?.match(this.availableAssets) ?? [];

      const a = $el.find('a');
      const source = URL.resolve(BASE_URL, this.$(a).attr('href') ?? '');

      return [
        ...accumulator,
        {
          gameTitle: this.$(a).text(),
          covers: parseInt(covers),
          manuals: parseInt(manuals),
          source,
        },
      ];
    }, [] as Array<PlatformCover>);
  }
}
