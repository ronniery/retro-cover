export const platformCoversSelectors = ($: cheerio.Root) => {
  const newsHeader = $('td.newsHeader');
  const pageBodyLines = $('.pageBody tr');
  const spanArticleText = 'span.articleText'

  return { newsHeader, pageBodyLines, spanArticleText }
}