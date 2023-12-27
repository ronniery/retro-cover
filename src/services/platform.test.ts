import { GetPlatformCoverOptions, getAdditionsByPlatform, getCoversByPlatform } from '.';
import httpApi from './client/http-api';

import { Consoles } from '../constants';

jest.mock('./client/http-api');

describe('unit:services/platform.ts', () => {
  describe('getAdditionsByPlatform', () => {
    it('should parse platform additions', async () => {
      const platform = Consoles['3DO'];
      const options = {};

      (httpApi.get as jest.Mock).mockResolvedValue({ data: 'mocked data' });

      const result = await getAdditionsByPlatform(platform, options);

      expect(httpApi.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          query: { cat_id: platform.toString() },
        }),
      );

      expect(result).toBeString();
    });
  });
  describe('getCoversByPlatform', () => {
    it('should fetch game covers by platform', async () => {
      const options: GetPlatformCoverOptions = { page: '1' };
      const platform = Consoles.amigaCD32;
      const matcher = 'A';

      (httpApi.get as jest.Mock).mockResolvedValue({ data: 'mocked data' });

      const result = await getCoversByPlatform(platform, matcher, options);

      expect(httpApi.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          query: { cat_id: platform.toString(), view: matcher, page: options.page?.toString() },
        }),
      );

      expect(result).toBeString();
    });
  });
});
