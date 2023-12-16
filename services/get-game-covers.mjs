import cheerio from 'cheerio';
import fetch from 'node-fetch';
import robotsParser from 'robots-parser';
import { decode } from 'html-entities';

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

// This method need to be renamed
// targets = number[]
const getGameCovers = async (gameIds, options = {}) => {
  const targetUrl = 'http://www.thecoverproject.net/view.php';

  if (!robots.isAllowed(targetUrl)) {
    throw new Error(`The requested endpoint: \n [${targetUrl}] is blocked by robots.txt`);
  }

  const games = (Array.isArray(gameIds) ? gameIds : [gameIds]);

  const allCovers = {}
  for (const gameId of games) {
    const $gameProfile = await getGameCoverProfile(gameId);
    const gameCovers = await getGameCoversFromProfile(gameId, $gameProfile, options);

    allCovers[gameId] = gameCovers;
  }

  return allCovers;
}

const getGameCoverProfile = async (gameId) => {
  const targetUrl = 'http://www.thecoverproject.net/view.php';
  return await fetch(`${targetUrl}?game_id=${gameId}`, {
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
}

const getGameCoversFromProfile = async (gameId, $, { includeManuals, firstAvailable, onlyFormats, onlyRegions } = {}) => {
  // need to parse manuals
  let covers = [];
  let manuals = [];

  const elements = (
    firstAvailable ? $('#covers ul li.tabSelected') : $('#covers ul li:not(.tabHeader)')
  ).toArray()

  for (let el of elements) {
    const [a, img] = $(el).find('a, span img').toArray();
    const url = $(a).attr('href');

    if (url.includes('/manuals/')) {
      manuals.push(`http://www.thecoverproject.net${url}`);
    } else {
      const [, format] = $(el).find('span').html().match(/^format:\s([a-z]+)/i)
      const [, country] = $(img).attr('src').match(/flags\/([a-z]+)/);
      const coverId = url.replace(/v.*=/, '')

      covers.push({
        coverId,
        format,
        country
      });
    }
  }

  if (Array.isArray(onlyRegions)) {
    covers = covers.filter(({ country }) => onlyRegions.includes(country))
  }

  if (Array.isArray(onlyFormats)) {
    covers = covers.filter(({ format }) => onlyFormats.includes(format))
  }

  // What to do with one value? Parse and return

  const coverDataPromises = covers.map(({ coverId }) => {
    const url = `http://www.thecoverproject.net/view.php?cover_id=${coverId}`;
    return fetch(url).then((response) => response.text()).then(html => cheerio.load(html));
  })

  const $coverPages = await Promise.all(coverDataPromises);

  const allCovers = { covers: [], manuals: [], game: '' };
  for (let $coverPage of $coverPages) {
    const [description, format, createdBy, region, caseType, , downloadSection] = $coverPage('.newsTable tbody table td:nth-child(2)').html().split('<br>');
    const downloadedTimesText = downloadSection.replace(/^.*ded|times.*/ig, '').trim();
    const downloadUrl = $(downloadSection).find('a').attr('href');

    const coverDetails = {
      description: description.replace(/<img.*:/i, '').trim(),
      format: format.replace(/^f.*?:/i, '').trim(),
      createdBy: createdBy.replace(/^c.*?:(\s<.*?>)?|<.*>/ig, '').trim(),
      region: region.replace(/^r.*?:|<.*/ig, '').trim(),
      caseType: caseType.replace(/^ca.*:\s/i, '').trim(),
      downloadedTimes: parseInt(downloadedTimesText, 10),
      downloadUrl: decode(`http://www.thecoverproject.net${downloadUrl}`)
    }

    allCovers.covers.push(coverDetails);
  }

  allCovers.source = `https://www.thecoverproject.net/view.php?cover_id=${gameId}`;
  allCovers.game = $('.newsTable:last-child td.pageBody h2').html().trim()
  allCovers.platform = $('.newsTable:last-child .newsHeader a').html().trim();

  includeManuals && (allCovers.manuals = manuals)
  return allCovers;
}

// const x = await getGameCovers([
//   "GP-1: Part II",
//   "Great Circus Mystery: Starring Mickey and Minnie, The",
//   "Great Waldo Search, The"
// ])
const y = await getGameCovers([
  "832"
], {
  includeManuals: false,
  firstAvailable: true,  // ignore other results and bring the first only
  //onlyRegions: /*['The Netherlands']*/['nl'], // only bring results that are inside the region array (translate it)
  //onlyFormats: ['PAL', 'NTSC'], // only bring results for that formats
})

// const x = await getGameCovers([
//  "Maximo Vs. Army Of Zin",
//   "Max Payne 2: The Fall Of Max Payne",
//   "Mega Man X8",
//   "Midnight Club",
//   "Midnight Club II",
// ])