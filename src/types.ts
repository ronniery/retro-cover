import { ProjectCountiesAlpha2, ProjectCountriesNames } from "./utils/project-countries";

export type GetGameCoverOptions = Omit<GameCoverMetadataOptions, 'gameId'>;

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
  itemsPerPage: number | null;
  totalPages: number | null;
  next: number | null;
  prev: number | null;
};

export type SearchResult = {
  name: string;
  platform: string;
  source: string;
  gameId: number;
};

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
  order?: Partial<{ [key in keyof AddedGame]: 'asc' | 'desc' }>;
  ignoreEmpty?: boolean;
  startingAt?: Date;
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
  includeManuals?: boolean;
  firstAvailable?: boolean;
  onlyFormats?: Array<KnownFormats>;
  onlyRegions?: Array<ProjectCountiesAlpha2>;
};

export type DraftGameCover = {
  coverId: string;
  format: KnownFormats;
  country: ProjectCountiesAlpha2;
};

export type GameManual = {
  source: string;
  language: string;
};

export type GameCoverMetadata = {
  drafts: Array<DraftGameCover>;
  covers: Array<GameCover>;
  manuals: GameManual[];
  gameTitle: string;
  source: string;
  platform: string | undefined;
};

export interface IParser<TOutput, TParseOptions = undefined> {
  parse(options?: TParseOptions): TOutput;
}
