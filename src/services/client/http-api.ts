import axios from 'axios';;
import axiosRetry from 'axios-retry';
import axiosThrottle from 'axios-request-throttle';
import { setupCache as axiosCache } from 'axios-cache-interceptor';

import { getRobots } from '@/services';
import { BASE_URL, ROBOTS } from '@/constants';

const httpApi = axios.create();
httpApi.defaults.baseURL = BASE_URL;
httpApi.defaults.headers.common['Content-Type'] = 'text/html';
httpApi.defaults.headers.common['User-Agent'] = 'Retro-Cover/1.0';

httpApi.interceptors.request.use(async (config) => {
  let robots;

  if (!config.url?.includes(ROBOTS)) {
    robots = await getRobots();

    if (robots.isAllowed(config.url as string) === false) {
      throw new Error(`The requested endpoint: \n [${config.url}] is blocked by robots.txt`);
    }
  }

  return config;
})

axiosRetry(httpApi, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  shouldResetTimeout: true,
});

axiosThrottle.use(httpApi, {
  requestsPerSecond: 5
});

export default axiosCache(httpApi);