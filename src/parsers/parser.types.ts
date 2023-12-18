import { Computers, Consoles, Handhelds } from '../constants';
import { ProjectCountiesAlpha2, ProjectCountriesNames } from '../utils/project-countries';

export type Platforms = Consoles | Handhelds | Computers;

export type Matcher =
  | '#'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';

export type Pagination = {
  current: number | null;
  pageSize: number | null;
  totalPages: number | null;
  next: number | null;
  prev: number | null;
};

export type SearchResult = {
  name: string;
  platform: Platforms;
  source: string;
  gameId: number;
};

export type SearchOfflineResult = Array<{
  gameId: string;
  gameName: string;
}>;

export type ServiceResult<TResult> = {
  searchTerm: string;
  results: TResult;
  pagination: Pagination;
};

export type AddedGame = {
  format: string | null;
  country: string | null;
  gameTitle: string | null;
  dateAdded: Date;
};

export type GameAdditions = {
  platformInfo: {
    platform: string | null;
    availableCovers: number | null;
  };
  addedGames: Array<AddedGame>;
};

export type PlatformAdditionsOptions = {
  order: { [key in keyof AddedGame]: 'asc' | 'desc' };
  ignoreEmpty: boolean;
  startingAt: Date;
};

export type KnownFormats = 'PAL' | 'NTSC' | 'NTSC-J';

export type GameCover = {
  description: string;
  format: KnownFormats;
  createdBy: string;
  region: ProjectCountriesNames;
  caseType: string;
  downloadedTimes: number;
  downloadUrl: string;
};

export type GameCoverMetadataOptions = {
  gameId: string | number;
  includeManuals: boolean;
  firstAvailable: boolean;
  onlyFormats: Array<KnownFormats>;
  onlyRegions: Array<ProjectCountiesAlpha2>;
};

export type GetGameCoverOptions = Omit<GameCoverMetadataOptions, 'gameId'>;

export type GameCoverCollection = {
  [gameId: string]: Omit<GameCoverMetadata, 'drafts'> | string;
};

export type DraftGameCover = {
  coverId: string;
  format: KnownFormats;
  country: ProjectCountiesAlpha2;
};

export type GameCoverMetadata = {
  drafts: Array<DraftGameCover>;
  covers: Array<GameCover>;
  manuals: string[];
  gameTitle: string;
  source: string;
  platform: string | undefined;
};

export type PlatformCover = {
  gameTitle: string;
  covers: number;
  manuals: number;
  source: string;
};

export type PlatformCoverOptions = {
  page?: number;
};

export type CountryDictionary = { [key: string]: string };

export interface IParser<TOutput, TParseOptions = undefined> {
  parse(options?: TParseOptions): TOutput;
}
