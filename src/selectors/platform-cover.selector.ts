type PlatformCoversSelectors = {
  newsHeader: cheerio.Cheerio;
  pageBodyLines: cheerio.Cheerio;
  spanArticleText: string;
};

export const platformCoversSelectors = ($: cheerio.Root): PlatformCoversSelectors => {
  const newsHeader = $('td.newsHeader');
  const pageBodyLines = $('.pageBody tr');
  const spanArticleText = 'span.articleText';

  return { newsHeader, pageBodyLines, spanArticleText };
};
