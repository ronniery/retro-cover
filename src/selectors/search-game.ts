export type SearchGameSelectors = {
  newsHeader: cheerio.Cheerio;
  pageBody: cheerio.Cheerio;
};

export const searchGameSelectors = ($: cheerio.Root): SearchGameSelectors => {
  const newsHeader = $('td.newsHeader');
  const pageBody = $('.pageBody');

  return { newsHeader, pageBody };
};
