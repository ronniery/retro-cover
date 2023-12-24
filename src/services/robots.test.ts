import axios from 'axios';
import robotsParser from 'robots-parser';
import { getRobots } from './robots';

jest.mock('axios');
jest.mock('robots-parser');

describe('service/robots.ts', () => {
  const fullPath = '/jest.php';

  it('should fetch robots successfully', async () => {
    const onlineRobots = 'User-agent: *\nDisallow: /private/';

    (axios.get as jest.Mock).mockResolvedValue({ data: onlineRobots });

    const result = await getRobots();

    expect(robotsParser).toHaveBeenCalledWith(fullPath, onlineRobots);
    expect(result).toBeDefined();
    expect(result.constructor.name).toBe('Robots');
  });

  it('should handle fetch error and uses offline robots', async () => {
    const offlineRobots = 'User-agent: *\nDisallow: /offline/';

    (axios.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch robots'));

    const result = await getRobots();

    expect(robotsParser).toHaveBeenCalledWith(fullPath, offlineRobots);

    // Event with an error it should be a robot object
    expect(result).toBeDefined();
    expect(result.constructor.name).toBe('Robots');
  });

  // describe('RobotsCache', () => {
  //   test('creates an instance of RobotsCache', () => {
  //     const cache = new RobotsCache();
  //     expect(cache).toBeInstanceOf(RobotsCache);
  //   });
  // });
});