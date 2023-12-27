import axios from 'axios';
import isEmpty from 'lodash.isempty';
import robotsParser, { Robot } from 'robots-parser';

import { ROBOTS, BASE_URL } from '../constants';

export const FULL_PATH = `${BASE_URL}${ROBOTS}`;
// updatedAt = '2023-12-16T15:12:17.811Z'
export const LOCAL_ROBOTS = `
  User-agent: *
  Disallow: /includes/
  Disallow: /images/
  Disallow: /uploads/
  Disallow: *.jpg$
  Disallow: *.gif$
  Disallow: /download_cover.php
  Disallow: /forums/

  User-agent: Exabot
  Disallow: /forums/
`;

let cache: Robot | null = null;

const fetchOnlineRobots = async (): Promise<string> => {
  let data;

  try {
    const response = await axios.get<string>(FULL_PATH, {
      headers: {
        'Content-Type': 'text/plain; charset=UTF-8',
      },
    });

    data = response.data;
  } catch (_) {
    data = LOCAL_ROBOTS;
  }

  return data;
};

export const getRobots = async (useCache = true): Promise<Robot> => {
  if (!useCache) cache = null;
  if (!isEmpty(cache)) return Promise.resolve(cache);

  return fetchOnlineRobots().then((robots) => (cache = robotsParser(FULL_PATH, robots)));
};
