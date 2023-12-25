import axios from 'axios';

import { getRobots } from './robots';

jest.mock('axios');

describe('service/robots.ts', () => {
  const toJSON = (obj: object): string => JSON.stringify(obj);

  it('should fetch robots successfully', async () => {
    const onlineRobots = 'User-agent: *\nDisallow: /private/';

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: onlineRobots });

    const result = await getRobots();

    expect(result).toBeDefined();
    expect(result).toBeObject();
    expect(toJSON(result)).toStrictEqual(
      toJSON({
        _url: 'http://www.thecoverproject.net/robots.txt',
        _rules: { '*': [{ pattern: '/private/', allow: false, lineNumber: 2 }] },
        _sitemaps: [],
        _preferredHost: null,
      }),
    );
  });

  it('should handle fetch error and uses offline robots', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch robots'));

    const result = await getRobots(false);

    expect(result).toBeDefined();
    expect(result).toBeObject();
    expect(toJSON(result)).toStrictEqual(
      toJSON({
        _url: 'http://www.thecoverproject.net/robots.txt',
        _rules: {
          '*': [
            { pattern: '/includes/', allow: false, lineNumber: 3 },
            { pattern: '/images/', allow: false, lineNumber: 4 },
            { pattern: '/uploads/', allow: false, lineNumber: 5 },
            { pattern: '*.jpg$', allow: false, lineNumber: 6 },
            { pattern: '*.gif$', allow: false, lineNumber: 7 },
            { pattern: '/download_cover.php', allow: false, lineNumber: 8 },
            { pattern: '/forums/', allow: false, lineNumber: 9 },
          ],
          exabot: [{ pattern: '/forums/', allow: false, lineNumber: 12 }],
        },
        _sitemaps: [],
        _preferredHost: null,
      }),
    );
  });
});
