export type GameCoverSelectors = {
  firstCover: string;
  allCovers: string;
  newsTableGameTitle: cheerio.Cheerio | undefined;
  newsTableGamePlatform: cheerio.Element | undefined;
};

export const gameCoverSelector = ($: cheerio.Root): GameCoverSelectors => {
  const [newsTable] = $('.newsTable').toArray();

  const firstCover = '#covers ul li.tabSelected';
  const allCovers = '#covers ul li:not(.tabHeader)';
  const newsTableGameTitle = $(newsTable).find('td.pageBody h2:first-child');
  const [newsTableGamePlatform] = $(newsTable).find('.newsHeader a:first-child');

  return { firstCover, allCovers, newsTableGameTitle, newsTableGamePlatform };
};
