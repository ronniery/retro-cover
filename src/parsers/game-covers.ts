import URL from 'node:url';
import { decode } from 'html-entities';

import { AbstractParser } from './parser';

import { BASE_URL, GAME_COVERS } from '../constants';
import {
  DraftGameCover,
  GameCover,
  GameCoverMetadata,
  GameCoverMetadataOptions,
  GameManual,
  KnownFormats,
} from '../types';
import { gameCoverSelector } from '../selectors/game-covers';
import { ProjectCountiesAlpha2, ProjectCountriesNames } from '../utils/project-countries';

export class GameCoverMetadataParser extends AbstractParser<GameCoverMetadata, GameCoverMetadataOptions> {
  public parse(options: GameCoverMetadataOptions): GameCoverMetadata {
    const { firstAvailable, onlyFormats, onlyRegions, gameId, includeManuals } = options;
    const { firstCover, allCovers, newsTableGamePlatform, newsTableGameTitle } = gameCoverSelector(this.$);
    const elements = firstAvailable ? this.$(firstCover) : this.$(allCovers);

    let drafts: Array<DraftGameCover> = [];
    let manuals: GameManual[] = [];
    for (const el of elements.toArray()) {
      const [a, img] = this.$(el).find('a, span img').toArray();
      const url = this.$(a).attr('href') as string;
      const language = this.$(a).find('span').text();

      if (url.includes('/manuals/')) {
        manuals = [
          ...manuals,
          {
            source: URL.resolve(BASE_URL, url),
            language: language.replace('Language: ', ''),
          },
        ];
      } else {
        const span = this.$(el).find('span') as cheerio.Cheerio;
        const spanHtml = span.html() as string;
        const [, format] = spanHtml.match(/^format:\s([a-z]+)/i) as string[];
        const imgSource = this.$(img).attr('src') as string;
        const [, country] = imgSource.match(/flags\/([a-z]+)/) as string[];
        const coverId = url.replace(/v.*=/, '');

        drafts = [
          ...drafts,
          {
            coverId,
            format: format as KnownFormats,
            country: country as ProjectCountiesAlpha2,
          },
        ];
      }
    }

    if (Array.isArray(onlyRegions)) {
      drafts = drafts.filter(({ country }) => onlyRegions.includes(country));
    }

    if (Array.isArray(onlyFormats)) {
      drafts = drafts.filter(({ format }) => onlyFormats.includes(format));
    }

    const titleHtml = this.$(newsTableGameTitle).html() as string;
    const platformHtml = this.$(newsTableGamePlatform).html() as string;

    const coverMetadata = {
      covers: [],
      drafts,
      manuals: [] as GameManual[],
      source: `${BASE_URL}${GAME_COVERS}?cover_id=${gameId}`,
      gameTitle: titleHtml.trim(),
      platform: platformHtml.trim(),
    };

    if (includeManuals) {
      coverMetadata.manuals = manuals;
    }

    return coverMetadata;
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
