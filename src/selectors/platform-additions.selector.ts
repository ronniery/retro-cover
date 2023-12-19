type PlatformAdditionsSelectors = {
  smallArticleText: string;
  articleText: string;
  gameRows: cheerio.Cheerio;
  newsTable: cheerio.Cheerio;
  newsHeader: cheerio.Cheerio;
};

export const platformAdditionsSelectors = ($: cheerio.Root): PlatformAdditionsSelectors => {
  const newsTable = $('table.newsTable').first();
  const newsHeader = newsTable.find('td.newsHeader');
  const gameRows = newsTable.find('table.tblSpecs tr');
  const articleText = '.articleText';
  const smallArticleText = '.articleTextSmall';

  return { smallArticleText, articleText, gameRows, newsTable, newsHeader };
};
