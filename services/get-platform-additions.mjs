import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { decode } from 'html-entities';
import robotsParser from 'robots-parser';
import orderBy from 'lodash.orderby';
import isEmpty from 'lodash.isempty';
import isDate from 'lodash.isdate';
import { consoles } from '../constants/platforms.mjs';

const robots = robotsParser('http://www.thecoverproject.net/', [
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

function convertCountryInitials(initials) {
  const countries = {
    "ad": "Andorra",
    "ae": "United Arab Emirates",
    "af": "Afghanistan",
    "ag": "Antigua and Barbuda",
    "ai": "Anguilla",
    "al": "Albania",
    "am": "Armenia",
    "ao": "Angola",
    "aq": "Antarctica",
    "ar": "Argentina",
    "as": "American Samoa",
    "at": "Austria",
    "au": "Australia",
    "aw": "Aruba",
    "ax": "Åland Islands",
    "az": "Azerbaijan",
    "ba": "Bosnia and Herzegovina",
    "bb": "Barbados",
    "bd": "Bangladesh",
    "be": "Belgium",
    "bf": "Burkina Faso",
    "bg": "Bulgaria",
    "bh": "Bahrain",
    "bi": "Burundi",
    "bj": "Benin",
    "bl": "Saint Barthélemy",
    "bm": "Bermuda",
    "bn": "Brunei Darussalam",
    "bo": "Bolivia",
    "bq": "Bonaire, Sint Eustatius and Saba",
    "br": "Brazil",
    "bs": "Bahamas",
    "bt": "Bhutan",
    "bv": "Bouvet Island",
    "bw": "Botswana",
    "by": "Belarus",
    "bz": "Belize",
    "ca": "Canada",
    "cc": "Cocos (Keeling) Islands",
    "cd": "Congo, Democratic Republic of the",
    "cf": "Central African Republic",
    "cg": "Congo",
    "ch": "Switzerland",
    "ci": "Côte d'Ivoire",
    "ck": "Cook Islands",
    "cl": "Chile",
    "cm": "Cameroon",
    "cn": "China",
    "co": "Colombia",
    "cr": "Costa Rica",
    "cu": "Cuba",
    "cv": "Cabo Verde",
    "cw": "Curaçao",
    "cx": "Christmas Island",
    "cy": "Cyprus",
    "cz": "Czech Republic",
    "de": "Germany",
    "dj": "Djibouti",
    "dk": "Denmark",
    "dm": "Dominica",
    "do": "Dominican Republic",
    "dz": "Algeria",
    "ec": "Ecuador",
    "ee": "Estonia",
    "eg": "Egypt",
    "eh": "Western Sahara",
    "er": "Eritrea",
    "es": "Spain",
    "et": "Ethiopia",
    "fi": "Finland",
    "fj": "Fiji",
    "fk": "Falkland Islands (Malvinas)",
    "fm": "Micronesia, Federated States of",
    "fo": "Faroe Islands",
    "fr": "France",
    "ga": "Gabon",
    "gb": "United Kingdom",
    "gd": "Grenada",
    "ge": "Georgia",
    "gf": "French Guiana",
    "gg": "Guernsey",
    "gh": "Ghana",
    "gi": "Gibraltar",
    "gl": "Greenland",
    "gm": "Gambia",
    "gn": "Guinea",
    "gp": "Guadeloupe",
    "gq": "Equatorial Guinea",
    "gr": "Greece",
    "gs": "South Georgia and the South Sandwich Islands",
    "gt": "Guatemala",
    "gu": "Guam",
    "gw": "Guinea-Bissau",
    "gy": "Guyana",
    "hk": "Hong Kong",
    "hm": "Heard Island and McDonald Islands",
    "hn": "Honduras",
    "hr": "Croatia",
    "ht": "Haiti",
    "hu": "Hungary",
    "id": "Indonesia",
    "ie": "Ireland",
    "il": "Israel",
    "im": "Isle of Man",
    "in": "India",
    "io": "British Indian Ocean Territory",
    "iq": "Iraq",
    "ir": "Iran, Islamic Republic of",
    "is": "Iceland",
    "it": "Italy",
    "je": "Jersey",
    "jm": "Jamaica",
    "jo": "Jordan",
    "jp": "Japan",
    "ke": "Kenya",
    "kg": "Kyrgyzstan",
    "kh": "Cambodia",
    "ki": "Kiribati",
    "km": "Comoros",
    "kn": "Saint Kitts and Nevis",
    "kp": "Korea, Democratic People's Republic of",
    "kr": "Korea, Republic of",
    "kw": "Kuwait",
    "ky": "Cayman Islands",
    "kz": "Kazakhstan",
    "la": "Lao People's Democratic Republic",
    "lb": "Lebanon",
    "lc": "Saint Lucia",
    "li": "Liechtenstein",
    "lk": "Sri Lanka",
    "lr": "Liberia",
    "ls": "Lesotho",
    "lt": "Lithuania",
    "lu": "Luxembourg",
    "lv": "Latvia",
    "ly": "Libya",
    "ma": "Morocco",
    "mc": "Monaco",
    "md": "Moldova, Republic of",
    "me": "Montenegro",
    "mf": "Saint Martin (French part)",
    "mg": "Madagascar",
    "mh": "Marshall Islands",
    "mk": "North Macedonia",
    "ml": "Mali",
    "mm": "Myanmar",
    "mn": "Mongolia",
    "mo": "Macao",
    "mp": "Northern Mariana Islands",
    "mq": "Martinique",
    "mr": "Mauritania",
    "ms": "Montserrat",
    "mt": "Malta",
    "mu": "Mauritius",
    "mv": "Maldives",
    "mw": "Malawi",
    "mx": "Mexico",
    "my": "Malaysia",
    "mz": "Mozambique",
    "na": "Namibia",
    "nc": "New Caledonia",
    "ne": "Niger",
    "nf": "Norfolk Island",
    "ng": "Nigeria",
    "ni": "Nicaragua",
    "nl": "Netherlands",
    "no": "Norway",
    "np": "Nepal",
    "nr": "Nauru",
    "nu": "Niue",
    "nz": "New Zealand",
    "om": "Oman",
    "pa": "Panama",
    "pe": "Peru",
    "pf": "French Polynesia",
    "pg": "Papua New Guinea",
    "ph": "Philippines",
    "pk": "Pakistan",
    "pl": "Poland",
    "pm": "Saint Pierre and Miquelon",
    "pn": "Pitcairn",
    "pr": "Puerto Rico",
    "ps": "Palestine, State of",
    "pt": "Portugal",
    "pw": "Palau",
    "py": "Paraguay",
    "qa": "Qatar",
    "re": "Réunion",
    "ro": "Romania",
    "rs": "Serbia",
    "ru": "Russian Federation",
    "rw": "Rwanda",
    "sa": "Saudi Arabia",
    "sb": "Solomon Islands",
    "sc": "Seychelles",
    "sd": "Sudan",
    "sw": "Sweden",
    "sg": "Singapore",
    "sh": "Saint Helena, Ascension and Tristan da Cunha",
    "si": "Slovenia",
    "sj": "Svalbard and Jan Mayen",
    "sk": "Slovakia",
    "sl": "Sierra Leone",
    "sm": "San Marino",
    "sn": "Senegal",
    "so": "Somalia",
    "sr": "Suriname",
    "ss": "South Sudan",
    "st": "Sao Tome and Principe",
    "sv": "El Salvador",
    "sx": "Sint Maarten (Dutch part)",
    "sy": "Syrian Arab Republic",
    "sz": "Eswatini",
    "tc": "Turks and Caicos Islands",
    "td": "Chad",
    "tf": "French Southern Territories",
    "tg": "Togo",
    "th": "Thailand",
    "tj": "Tajikistan",
    "tk": "Tokelau",
    "tl": "Timor-Leste",
    "tm": "Turkmenistan",
    "tn": "Tunisia",
    "to": "Tonga",
    "tr": "Turkey",
    "tt": "Trinidad and Tobago",
    "tv": "Tuvalu",
    "tw": "Taiwan, Province of China",
    "tz": "Tanzania, United Republic of",
    "ua": "Ukraine",
    "ug": "Uganda",
    "us": "United States",
    "uy": "Uruguay",
    "uz": "Uzbekistan",
    "va": "Holy See (Vatican City State)",
    "vc": "Saint Vincent and the Grenadines",
    "ve": "Venezuela, Bolivarian Republic of",
    "vg": "Virgin Islands, British",
    "vi": "Virgin Islands, U.S.",
    "vn": "Viet Nam",
    "vu": "Vanuatu",
    "wf": "Wallis and Futuna",
    "ws": "Samoa",
    "ye": "Yemen",
    "yt": "Mayotte",
    "za": "South Africa",
    "zm": "Zambia",
    "zw": "Zimbabwe",
    "noregion": "No-region"
  }

  return countries[initials] || 'Unknown';
}
// orderBy will be an object { key: asc | desc }
const getPlatformAdditions = async (platform, options = {}) => {
  const targetUrl = 'http://www.thecoverproject.net/view.php';

  if (!robots.isAllowed(targetUrl)) {
    throw new Error(`The requested endpoint: \n [${targetUrl}] is blocked by robots.txt`);
  }

  const newAdditions = await fetch(`${targetUrl}?cat_id=${platform}`, {
    "method": "GET"
  })
    .then(response => response.text())
    // .then(html => decode(html, { level: 'html4'}))
    .then(html => cheerio.load(html, {
      decodeEntities: false,
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
      recognizeCDATA: true,
      recognizeSelfClosing: true,
      normalizeWhitespace: true,
      _useHtmlParser2: true
    }))
    .then($ => parseNewAdditions($, options));

  return newAdditions;
}

const parseNewAdditions = ($, { order, ignoreEmpty, startingAt }) => {
  const table = $('table.newsTable').first();
  const headerText = table.find('td.newsHeader').text();

  const headerRegex = /(?<platform>.+?) Game Covers \((?<availableCovers>\d+) Covers\) > Newest Covers/;
  const headerMatch = headerText.match(headerRegex);

  const platformInfo = {
    platform: headerMatch?.groups?.platform || null,
    availableCovers: headerMatch?.groups?.availableCovers ? parseInt(headerMatch.groups.availableCovers, 10) : null,
  };

  let gameInfo = [];

  table.find('table.tblSpecs tr').each((_, element) => {
    const tds = $(element).find('td');

    const nameRegex = />(.+?)</;
    const formatRegex = />\s\(([a-z]+)\/?/i;
    const countryRegex = /flags\/(.+?).png/;
    const inputText = tds.eq(0).find('.articleText').html();

    if (ignoreEmpty && /x\sempty/i.test(inputText)) return;

    const nameMatch = inputText.match(nameRegex);
    const formatMatch = inputText.match(formatRegex);
    const countryMatch = inputText.match(countryRegex);

    const name = nameMatch ? nameMatch[1] : null;
    const format = formatMatch ? formatMatch[1] : null;
    const country = countryMatch ? countryMatch[1] : null;

    const game = {
      format: format || null,
      country: convertCountryInitials(country),
      name: decode(name) || null,
    };

    const dateText = tds.eq(1).find('.articleTextSmall').text();
    const dateRegex = /Added: (.+)/;
    const dateMatch = dateText.match(dateRegex);

    if (dateMatch) {
      const dateString = dateMatch[1];
      game.dateAdded = dateString === "Today" ? Date.now() : new Date(`${dateString} UTC`);
    }

    gameInfo.push(game);
  });

  if (isDate(startingAt)) {
    gameInfo = gameInfo.filter(({ dateAdded }) => dateAdded >= startingAt);
  }

  if (!isEmpty(order)) {
    gameInfo = orderBy(gameInfo, ...Object.keys(order), ...Object.values(order))
  }

  return { platformInfo, gameInfo };
}

const searchFor = async (game) => {
  const targetUrl = 'http://www.thecoverproject.net/view.php';

  if (!robots.isAllowed(targetUrl)) {
    throw new Error(`The requested endpoint: \n [${targetUrl}] is blocked by robots.txt`);
  }

  const newAdditions = await fetch(`${targetUrl}?cat_id=${platform}`, {
    "method": "GET"
  })
    .then(response => response.text())
    // .then(html => decode(html, { level: 'html4'}))
    .then(html => cheerio.load(html, {
      decodeEntities: false,
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
      recognizeCDATA: true,
      recognizeSelfClosing: true,
      normalizeWhitespace: true,
      _useHtmlParser2: true
    }))
    .then($ => parseNewAdditions($, options));

  return newAdditions;
}

// const x = await getPlatformAdditions(consoles.playstation1);
// console.log(x);
// const y = await getPlatformAdditions(consoles.playstation1, { order: { name: 'asc' } });
// const z = await getPlatformAdditions(consoles.playstation1, { ignoreEmpty: true });
const k = await getPlatformAdditions(consoles.playstation5, { startingAt: new Date(2023, 10, 1) });
console.log('bye')

// useHttps