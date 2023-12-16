import cheerio from 'cheerio';
import fetch from 'node-fetch';
import robotsParser from 'robots-parser';
import nodeURL from 'node:url';

const baseUrl = 'http://www.thecoverproject.net/';
const robots = robotsParser(baseUrl, [
  'User-agent: *',
  'Disallow: /includes/',
  'Disallow: /images/',
  'Disallow: /uploads/',
  'Disallow: *.jpg$',
  'Disallow: *.gif$',
  'Disallow: /download_cover.php',
  'Disallow: /forums/',
  'User-agent: Exabot',
  'Disallow: /forums/'
].join('\n'))

const searchOnline = async (game, { page } = {}) => {
  const targetUrl = `${baseUrl}/view.php`;

  if (!robots.isAllowed(targetUrl)) {
    throw new Error(`The requested endpoint: \n [${targetUrl}] is blocked by robots.txt`);
  }

  const searches = await fetch(`${targetUrl}?searchstring=${game}${page ? `&page=${page}` : ''}`, {
    "method": "GET"
  })
    .then(response => response.text())
    .then(html => cheerio.load(html, {
      decodeEntities: false,
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
      recognizeCDATA: true,
      recognizeSelfClosing: true,
      normalizeWhitespace: true,
      _useHtmlParser2: true
    }))
    .then($ => parseSearches($));

  return searches;
}

const searchFor = async function* (game, { page } = {}) {
  const targetUrl = `${baseUrl}/view.php`;

  if (!robots.isAllowed(targetUrl)) {
    throw new Error(`The requested endpoint: \n [${targetUrl}] is blocked by robots.txt`);
  }

  let currentPage = page;

  while (true) {
    const searches = await searchOnline(game, { page: currentPage });

    yield searches;

    if (searches.pagination.next) {
      currentPage = searches.pagination.next;
    } else {
      break;
    }
  }
}

const parseSearches = ($) => {
  const term = $('td.newsHeader').first().text().match(/Search Results for: (.+)/)[1].trim();
  const results = [];

  $('.pageBody tr').each((_, element) => {
    const $a = $(element).find('a');
    const href = $a.attr('href');
    const [, name, platform] = $a.text().match(/(.+?)\s\((.+?)\)/i);
    const source = nodeURL.resolve(baseUrl, href);
    const [, gameId] = href.match(/game_id=(.*)/)

    results.push({ name, platform, source, gameId: +gameId });
  });

  // Extract pagination information
  const current = parseInt($('div.paginator span.this-page').text());
  const pageSize = results.length;
  const totalPages = parseInt($('div.paginator a, div.paginator span').last().text());
  const next = current === totalPages ? null : current + 1;
  const prev = current === 1 ? null : current - 1;

  // Create the final output object
  const output = {
    term,
    results,
    pagination: {
      current,
      pageSize,
      totalPages,
      next,
      prev
    }
  };

  return output;
}

// const x = await getPlatformAdditions(consoles.playstation1);
// console.log(x);
// const y = await getPlatformAdditions(consoles.playstation1, { order: { name: 'asc' } });
// const z = await getPlatformAdditions(consoles.playstation1, { ignoreEmpty: true });
const k = await searchOnline("mario");
const y = await searchOnline("mario", { page: k.pagination.next })
console.log(k);
console.log(y)
// const y = searchFor("mario");
// console.log(await y.next())
// console.log(await y.next())
// console.log(await y.next())
// console.log(await y.next())
// console.log(await y.next())
// console.log(await y.next())
// console.log(await y.next())

console.log(k)

// useHttps