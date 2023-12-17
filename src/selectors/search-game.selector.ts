export const searchGameSelector = ($: cheerio.Root) => {
  const newsHeader = $('td.newsHeader');
  const pageBody = $('.pageBody');
  const paginator = $('div.paginator');
  const paginatorChildren = $('div.paginator a, div.paginator span');
  const spanThisPage = paginator.find('span.this-page');

  return { newsHeader, pageBody, paginator, paginatorChildren, spanThisPage }
}