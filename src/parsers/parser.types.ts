import * as cheerio from "cheerio";

import { Computers, Consoles, Handhelds } from "../constants/platforms";

export type Platforms = Consoles | Handhelds | Computers

export type Pagination = {
  current: number,
  pageSize: number,
  totalPages: number,
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

export type SearchOnlineResult = {
  searchTerm: string,
  results: SearchResult[],
  pagination: Pagination
}

export interface IParser<TOutput> {
  parse(): TOutput
}