type GameCoverSelectors = {
  firstCover: string;
  allCovers: string;
  newsTableGameTitle: cheerio.Cheerio;
  newsTableGamePlatform: cheerio.Cheerio;
};

export const gameCoverSelector = ($: cheerio.Root): GameCoverSelectors => {
  const newsTable = 'table table table.newsTable' as const;

  const firstCover = '#covers ul li.tabSelected';
  const allCovers = '#covers ul li:not(.tabHeader)';
  const newsTableGameTitle = $(`${newsTable} td.pageBody h2`);
  const newsTableGamePlatform = $(`${newsTable} .newsHeader a`);

  return { firstCover, allCovers, newsTableGameTitle, newsTableGamePlatform };
};
