export const searchGameSelectors = ($: cheerio.Root) => {
  const newsHeader = $('td.newsHeader');
  const pageBody = $('.pageBody');

  return { newsHeader, pageBody }
}