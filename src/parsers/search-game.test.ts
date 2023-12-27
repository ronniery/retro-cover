import { SearchGameParser } from './search-game';
import { searches } from './search-game.mock';

import { Computers, Consoles, Handhelds } from '../constants';
import { Pagination, SearchResult } from '../types';

describe('parser/search-game.ts | SearchGameParser', () => {
  const { superMario } = searches;
  const allConsoles = [...Object.keys(Consoles), ...Object.keys(Handhelds), ...Object.keys(Computers)]
    .filter((console) => !Number.isInteger(+console))
    .map((console) => console.toUpperCase());

  it('should parse the first page of "super mario" search', () => {
    const searchResult = new SearchGameParser(superMario.page1).parse();

    expect(searchResult).toHaveProperty('searchTerm', 'super mario');
    expect(searchResult).toHaveProperty('pagination');
    expect(searchResult).toHaveProperty('results');

    const { results, pagination } = searchResult;
    expect(pagination).toBeObject();
    expect(pagination).toEqual(
      expect.objectContaining<Pagination>({
        next: expect.any(Number),
        prev: expect.toBeOneOf([expect.any(Number), null]),
        current: expect.any(Number),
        totalPages: expect.any(Number),
        itemsPerPage: expect.any(Number),
      }),
    );

    expect(results).toBeArray();
    expect(results.length).toBe(30);
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining<SearchResult>({
          gameId: expect.any(Number),
          platform: expect.toBeOneOf(allConsoles),
          name: expect.any(String),
          source: expect.any(String),
        }),
      ]),
    );
  });

  it('should parse the second page of "super mario" search', () => {
    const searchResult = new SearchGameParser(superMario.page2).parse();

    expect(searchResult).toHaveProperty('searchTerm', 'super mario');
    expect(searchResult).toHaveProperty('pagination');
    expect(searchResult).toHaveProperty('results');

    const { results, pagination } = searchResult;
    expect(pagination).toBeObject();
    expect(pagination).toEqual(
      expect.objectContaining<Pagination>({
        next: expect.any(Number),
        prev: expect.any(Number),
        current: expect.any(Number),
        totalPages: expect.any(Number),
        itemsPerPage: expect.any(Number),
      }),
    );

    expect(results).toBeArray();
    expect(results.length).toBe(30);
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining<SearchResult>({
          gameId: expect.any(Number),
          platform: expect.toBeOneOf(allConsoles),
          name: expect.any(String),
          source: expect.any(String),
        }),
      ]),
    );
  });

  it('should parse the third page of "super mario" search', () => {
    const searchResult = new SearchGameParser(superMario.page3).parse();

    expect(searchResult).toHaveProperty('searchTerm', 'super mario');
    expect(searchResult).toHaveProperty('pagination');
    expect(searchResult).toHaveProperty('results');

    const { results, pagination } = searchResult;
    expect(pagination).toBeObject();
    expect(pagination).toEqual(
      expect.objectContaining<Pagination>({
        next: expect.toBeOneOf([expect.any(Number), null]),
        prev: expect.any(Number),
        current: expect.any(Number),
        totalPages: expect.any(Number),
        itemsPerPage: expect.any(Number),
      }),
    );

    expect(results).toBeArray();
    expect(results.length).toBe(11);
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining<SearchResult>({
          gameId: expect.any(Number),
          platform: expect.toBeOneOf(allConsoles),
          name: expect.any(String),
          source: expect.any(String),
        }),
      ]),
    );
  });
});
