type PaginatorSelectors = {
  paginator: cheerio.Cheerio;
  paginatorChildren: cheerio.Cheerio;
  spanThisPage: cheerio.Cheerio;
};

export const paginationSelector = ($: cheerio.Root): PaginatorSelectors => {
  const paginator = $('div.paginator');
  const paginatorChildren = $('div.paginator a, div.paginator span');
  const spanThisPage = paginator.find('span.this-page');

  return { paginator, paginatorChildren, spanThisPage };
};
