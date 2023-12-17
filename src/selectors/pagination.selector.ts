export const paginationSelector = ($: cheerio.Root) => {
  const paginator = $('div.paginator');
  const paginatorChildren = $('div.paginator a, div.paginator span');
  const spanThisPage = paginator.find('span.this-page');

  return { paginator, paginatorChildren, spanThisPage }
}