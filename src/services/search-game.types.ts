import { SearchOnlineResult } from "../parsers";

export type SearchWhere = 'online' | 'off-line';

export type SearchOfflineOptions = { minLevenshteinDistance: number }

export type SearchOnlineOptions = {
  page?: number;
}