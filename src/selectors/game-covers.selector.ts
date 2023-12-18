export const gameCoverSelector = ($: cheerio.Root) => {
  const firstCover = '#covers ul li.tabSelected';
  const allCovers = '#covers ul li:not(.tabHeader)';
  const newsTableGameTitle = $('.newsTable:last-child td.pageBody h2')
  const newsTableGamePlatform = $('.newsTable:last-child .newsHeader a')

  return { firstCover, allCovers, newsTableGameTitle, newsTableGamePlatform }
}