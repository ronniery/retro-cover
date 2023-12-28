import URL from 'node:url';
import { decode } from 'html-entities';

import { AbstractParser } from './parser';

import { BASE_URL, GAME_COVERS } from '../constants';
import {
  GameCover,
  GameCoverMetadata,
  GameCoverMetadataOptions,
  GameManual,
  KnownFormats,
  PartialMetadata,
} from '../types';
import { gameCoverSelector } from '../selectors/game-covers';
import { ProjectCountiesAlpha2, ProjectCountriesNames } from '../utils/project-countries';

export class GameCoverMetadataParser extends AbstractParser<GameCoverMetadata, GameCoverMetadataOptions> {
  public parse(options: GameCoverMetadataOptions): GameCoverMetadata {
    const { firstAvailable, onlyFormats, onlyRegions, gameId, includeManuals } = options;
    const { firstCover, allCovers, newsTableGamePlatform, newsTableGameTitle } = gameCoverSelector(this.$);
    const elements = firstAvailable ? this.$(firstCover) : this.$(allCovers);
    const partial = this.getPartialMetadata(elements);

    if (Array.isArray(onlyRegions)) {
      partial.drafts = partial.drafts.filter(({ country }) => onlyRegions.includes(country));
    }

    if (Array.isArray(onlyFormats)) {
      partial.drafts = partial.drafts.filter(({ format }) => onlyFormats.includes(format));
    }

    const titleHtml = this.$(newsTableGameTitle).html() as string;
    const platformHtml = this.$(newsTableGamePlatform).html() as string;

    const coverMetadata = {
      covers: [],
      drafts: partial.drafts,
      manuals: [] as GameManual[],
      source: `${BASE_URL}${GAME_COVERS}?cover_id=${gameId}`,
      gameTitle: titleHtml.trim(),
      platform: platformHtml.trim(),
    };

    if (includeManuals) {
      coverMetadata.manuals = partial.manuals;
    }

    return coverMetadata;
  }

  private getPartialMetadata(elements: cheerio.Cheerio): PartialMetadata {
    const output: PartialMetadata = {
      drafts: [],
      manuals: [],
    };

    for (const el of elements.toArray()) {
      const [a, img] = this.$(el).find('a, span img').toArray();
      const url = this.$(a).attr('href') as string;
      const language = this.$(a).find('span').text();

      if (url.includes('/manuals/')) {
        output.manuals.push({
          source: URL.resolve(BASE_URL, url),
          language: language.replace('Language: ', ''),
        });
      } else {
        const span = this.$(el).find('span') as cheerio.Cheerio;
        const spanHtml = span.html() as string;
        const [, format] = spanHtml.match(/^format:\s([a-z]+)/i) as string[];
        const imgSource = this.$(img).attr('src') as string;
        const [, country] = imgSource.match(/flags\/([a-z]+)/) as string[];
        const coverId = url.replace(/v.*=/, '');

        output.drafts.push({
          coverId,
          format: format as KnownFormats,
          country: country as ProjectCountiesAlpha2,
        });
      }
    }

    return output;
  }
}

export class GameCoverParser extends AbstractParser<GameCover> {
  private readonly newsTablePageBody: string = '.newsTable td.pageBody';

  public parse(): GameCover {
    const lastElement = this.$(this.newsTablePageBody).last();
    const lastHtml = lastElement.html() as string;

    const [description, format, createdBy, region, caseType, , downloadSection] = lastHtml.split('<br>') as string[];
    const downloadedTimesText = downloadSection.replace(/^.*ded|times.*/gi, '').trim();
    const downloadUrl = this.$(downloadSection).find('a').attr('href');

    return {
      description: description.replace(/<img.*:/i, '').trim(),
      format: format.replace(/^f.*?:/i, '').trim() as KnownFormats,
      createdBy: createdBy.replace(/^c.*?:(\s<.*?>)?|<.*>/gi, '').trim(),
      region: region.replace(/^r.*?:|<.*/gi, '').trim() as ProjectCountriesNames,
      caseType: caseType.replace(/^ca.*:\s/i, '').trim(),
      downloadedTimes: parseInt(downloadedTimesText, 10),
      downloadUrl: decode(`${BASE_URL}${downloadUrl}`),
    };
  }
}
