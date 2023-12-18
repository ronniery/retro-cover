import URL from 'node:url';
import { decode } from 'html-entities';

import { BASE_URL, GAME_COVERS } from "../constants";
import { AbstractParser } from "./parser";
import { GameCover, GameCoverMetadata, GameCoverMetadataOptions, KnownFormats } from "./parser.types";
import { gameCoverSelector } from '../selectors/game-covers.selector';
import { ProjectCountiesAlpha2, ProjectCountriesNames } from '../utils/project-countries';

export class GameCoverMetadataParser extends AbstractParser<GameCoverMetadata, GameCoverMetadataOptions> {

  public parse(options?: GameCoverMetadataOptions): GameCoverMetadata {
    const { firstAvailable, onlyFormats, onlyRegions, gameId, includeManuals } = options ?? {}
    const { firstCover, allCovers, newsTableGamePlatform, newsTableGameTitle } = gameCoverSelector(this.$);
    const elements = firstAvailable ? this.$(firstCover) : this.$(allCovers);

    let drafts = [];
    let manuals: string[] = [];
    for (let el of elements.toArray()) {
      const [a, img] = this.$(el).find('a, span img').toArray();
      const url = this.$(a).attr('href') ?? '';

      if (url.includes('/manuals/')) {
        manuals.push(URL.resolve(BASE_URL, this.$(a).attr('href') ?? ''));
      } else {
        const [, format] = this.$(el).find('span')?.html()?.match(/^format:\s([a-z]+)/i) ?? [];
        const [, country] = this.$(img).attr('src')?.match(/flags\/([a-z]+)/) ?? [];
        const coverId = url.replace(/v.*=/, '')

        drafts.push({
          coverId,
          format: format as KnownFormats,
          country: country as ProjectCountiesAlpha2
        });
      }
    }

    if (Array.isArray(onlyRegions)) {
      drafts = drafts.filter(({ country }) => onlyRegions.includes(country))
    }

    if (Array.isArray(onlyFormats)) {
      drafts = drafts.filter(({ format }) => onlyFormats.includes(format))
    }

    let gameCoverMetadata = {
      covers: [],
      drafts,
      manuals: [] as string[],
      source: `${BASE_URL}${GAME_COVERS}?cover_id=${gameId}`,
      gameTitle: this.$(newsTableGameTitle)?.html()?.trim() ?? '',
      platform: this.$(newsTableGamePlatform)?.html()?.trim()
    }

    if (includeManuals) {
      gameCoverMetadata.manuals = manuals;
    }

    return gameCoverMetadata;
  }
}

export class GameCoverParser extends AbstractParser<GameCover> {
  private readonly secondNewsTable: string = '.newsTable tbody table td:nth-child(2)';

  public parse(): GameCover {
    const [description, format, createdBy, region, caseType, , downloadSection] = this.$(this.secondNewsTable)?.html()?.split('<br>') ?? [];
    const downloadedTimesText = downloadSection.replace(/^.*ded|times.*/ig, '').trim();
    const downloadUrl = this.$(downloadSection).find('a').attr('href');

    return {
      description: description.replace(/<img.*:/i, '').trim(),
      format: format.replace(/^f.*?:/i, '').trim() as KnownFormats,
      createdBy: createdBy.replace(/^c.*?:(\s<.*?>)?|<.*>/ig, '').trim(),
      region: region.replace(/^r.*?:|<.*/ig, '').trim() as ProjectCountriesNames,
      caseType: caseType.replace(/^ca.*:\s/i, '').trim(),
      downloadedTimes: parseInt(downloadedTimesText, 10),
      downloadUrl: decode(`${BASE_URL}${downloadUrl}`)
    }
  }
}