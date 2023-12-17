import robotsParser, { Robot } from "robots-parser";

import { ROBOTS, BASE_URL } from "../constants";
import axios from "axios";

class RobotsCache {
  public online: string | undefined;
  public readonly offline: string;
  public readonly updatedAt: string;

  constructor() {
    this.updatedAt = "2023-12-16T15:12:17.811Z";
    this.offline = `
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
    `
  }
}

const fullPath = `${BASE_URL}${ROBOTS}`
const cache = new RobotsCache();

const fetchOnlineRobots = async (): Promise<string> => {
  let data;

  try {
    if (cache.online !== undefined)
      return Promise.resolve(cache.online);

    const response = await axios.get(fullPath, {
      headers: {
        'Content-Type': 'text/plain; charset=UTF-8'
      }
    })

    cache.online = response.data
    data = response.data;
  } catch (_) {
    data = cache.offline;
  }

  return data;
}

export const getRobots = async (): Promise<Robot> =>
  fetchOnlineRobots()
    .then(robots => robotsParser(fullPath, robots))