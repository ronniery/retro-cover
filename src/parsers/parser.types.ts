import { Computers, Consoles, Handhelds } from "../constants";

export type Platforms = Consoles | Handhelds | Computers

export type Matcher = '#' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'

export type Pagination = {
  current: number | null,
  pageSize: number | null,
  totalPages: number | null,
  next: number | null,
  prev: number | null
}

export type SearchResult = {
  name: string,
  platform: Platforms;
  source: string,
  gameId: number
}

export type SearchOfflineResult = Array<{
  gameId: string;
  gameName: string;
}>;

export type ServiceResult<TResult> = {
  searchTerm: string,
  results: TResult,
  pagination: Pagination
}

export type AddedGame = {
  format: string | null,
  country: string | null,
  gameTitle: string | null,
  dateAdded: Date
}

export type GameAdditions = {
  platformInfo: {
    platform: string | null;
    availableCovers: number | null
  },
  addedGames: Array<AddedGame>
}

export type PlatformAdditionsOptions = {
  order: { [key in keyof AddedGame]: 'asc' | 'desc' };
  ignoreEmpty: boolean;
  startingAt: Date;
}

export type PlatformCover = { gameTitle: string, covers: number, manuals: number, source: string }

export type PlatformCoverOptions = {
  page?: number
}

export type CountryDictionary = { [key: string]: string };

export interface IParser<TOutput, TParseOptions = undefined> {
  parse(options?: TParseOptions): TOutput
}