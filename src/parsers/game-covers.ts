import URL from 'node:url';
import { decode } from 'html-entities';

import { BASE_URL, GAME_COVERS } from '../constants';
import { AbstractParser } from './parser';
import { DraftGameCover, GameCover, GameCoverMetadata, GameCoverMetadataOptions, GameManual, KnownFormats } from './parser.types';
import { gameCoverSelector } from '../selectors/game-covers';
import { ProjectCountiesAlpha2, ProjectCountriesNames } from '../utils/project-countries';

export class GameCoverMetadataParser extends AbstractParser<GameCoverMetadata, GameCoverMetadataOptions> {
  public parse(options: GameCoverMetadataOptions): GameCoverMetadata {
    const { firstAvailable, onlyFormats, onlyRegions, gameId, includeManuals } = options ?? {};
    const { firstCover, allCovers, newsTableGamePlatform, newsTableGameTitle } = gameCoverSelector(this.$);
    const elements = firstAvailable ? this.$(firstCover) : this.$(allCovers);

    let drafts: Array<DraftGameCover> = [];
    let manuals: GameManual[] = [];
    for (const el of elements.toArray()) {
      const [a, img] = this.$(el).find('a, span img').toArray();
      const url = this.$(a).attr('href') ?? '';
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
        const spanHtml = this.$(el).find('span')?.html();
        const [, format] = spanHtml?.match(/^format:\s([a-z]+)/i) ?? [];
        const imgSource = this.$(img).attr('src');
        const [, country] = imgSource?.match(/flags\/([a-z]+)/) ?? [];
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

    const coverMetadata = {
      covers: [],
      drafts,
      manuals: [] as GameManual[],
      source: `${BASE_URL}${GAME_COVERS}?cover_id=${gameId}`,
      gameTitle: this.$(newsTableGameTitle)?.html()?.trim() ?? '',
      platform: this.$(newsTableGamePlatform)?.html()?.trim(),
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
    const [description, format, createdBy, region, caseType, , downloadSection] =
      this.$(this.newsTablePageBody).last()?.html()?.split('<br>') ?? [];
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
