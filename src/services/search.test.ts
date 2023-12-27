import httpApi from './client/http-api';

import { OfflineResult, SearchOfflineResult, searchOffline, searchOnline } from './search';

import { SEARCH_GAMES } from '../constants';

jest.mock('./client/http-api');

describe('unit:services/search.ts', () => {
  describe('searchOffline', () => {
    it('should return an array of matches for offline search', async () => {
      const result: SearchOfflineResult = await searchOffline('mario');

      expect(result).toBeArray();
      expect(result.length).toBe(174);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining<OfflineResult>({
            gameId: expect.any(String),
            gameName: expect.any(String),
          }),
        ]),
      );
    });
  });

  describe('searchOnline', () => {
    it('should return online search results', async () => {
      const response = {
        data: [
          { gameName: 'Game A', gameId: 'A' },
          { gameName: 'Game B', gameId: 'B' },
        ],
      };

      (httpApi.get as jest.Mock).mockResolvedValue(response);

      const result = await searchOnline('game');

      expect(result).toEqual(response.data);
    });

    it('should handle options for pagination', async () => {
      (httpApi.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await searchOnline('game', { page: '2' });

      expect(result).toBeArray();
      expect(httpApi.get).toHaveBeenCalledWith(SEARCH_GAMES, expect.any(Object));
    });
  });
});
