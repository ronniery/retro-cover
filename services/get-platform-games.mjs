import cheerio from 'cheerio';
import fetch from 'node-fetch';
import robotsParser from 'robots-parser';
import nodeURL from 'node:url';
import { consoles } from '../constants/platforms.mjs';
import isEmpty from 'lodash.isempty';

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

const getPlatformCovers = async (platform, matcher, { page } = {}) => {
  const targetUrl = `${baseUrl}/view.php`;

  if (!robots.isAllowed(targetUrl)) {
    throw new Error(`The requested endpoint: \n [${targetUrl}] is blocked by robots.txt`);
  }

  const searches = await fetch(`${targetUrl}?cat_id=${platform}&view=${matcher}${page ? `&page=${page}` : ''}`, {
    "method": "GET"
  })
    .then(response => response.text())
    .then(response => {
      if (response.includes("There are no covers that match this criteria.")) {
        throw new Error("There are no covers that match this criteria.")
      }

      return response;
    })
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

// ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const getPlatformCoversFor = async function* (platform, matcher, { page = 1 } = {}) {
  let currentPage = page;

  while (true) {
    const searches = await getPlatformCovers(platform, matcher, { page: currentPage });

    yield searches;

    if (searches.pagination.next) {
      currentPage = searches.pagination.next;
    } else {
      break;
    }
  }
}

const parseSearches = ($) => {
  const term = $('td.newsHeader').first().text().match(/> (.+)/)[1].trim();
  const results = [];

  $('.pageBody tr').each((_, element) => {
    const $el = $(element).find('span.articleText');
    const [a, comment] = [...$el.contents()].filter(el => el.tagName === 'a' || el.type === 'comment');
    const name = $(a).text();

    if(isEmpty(comment)) {
      debugger;
    }

    const [_count, covers, manuals ]= comment.data.match(/\d+/g)
    // const covers = parseInt($(text).text().replace(/\s|\(|\)/g, ''));
    const source = nodeURL.resolve(baseUrl, $(a).attr('href'));

    results.push({ name, covers, manuals, source });
  });

  // Extract pagination information
  const current = parseInt($('div.paginator span.this-page').text());
  const pageSize = results.length;
  const allPages = $('div.paginator a, div.paginator span').toArray().map(el => +$(el).text()).filter(page => Number.isInteger(page));

  const totalPages = parseInt(allPages[allPages.length - 1]);
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
// const k = await searchInPlatform(consoles.playstation1, "a");
// const y = await searchInPlatform(consoles.playstation1, "a", { page: k.pagination.next })
// console.log(k);
// console.log(y)
const y = getPlatformCoversFor(consoles.playstation1, "a", { page: 8 });
console.log(await y.next())
console.log(await y.next())
console.log(await y.next())
// console.log(await y.next())
// console.log(await y.next())
// console.log(await y.next())
// console.log(await y.next())

console.log(k)

// useHttps