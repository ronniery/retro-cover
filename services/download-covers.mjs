import fs from 'fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { default as _ } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import https from 'node:https';
import http from 'node:http';
import axios from 'axios';

const { chunk, isEmpty } = _;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * urls only
 * @param {Array<string | {downloadUrl: string}>} targets
 */
const downloadCovers = async (targets, { outputPath, parallelDownload = 3 } = {}) => {
  const fullPath = resolve(__dirname, outputPath);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
  }

  const chunks = chunk(targets, Math.min(5, parallelDownload))

  for (let block of chunks) {
    const filesToDownload = block.map(item => {
      let url = item?.downloadUrl;

      if (isEmpty(url)) {
        url = item
      }

      return axios.get(url, {
        responseType: 'stream',
        httpAgent: new http.Agent({
          rejectUnauthorized: false,
        }),
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        })
      })
        .then(res => {
          const attachment = res.headers.get('content-disposition');
          const [, filename] = attachment.match(/filename=(.*).jpg/);
          const writeStream = fs.createWriteStream(`${fullPath}/${filename || uuidv4()}.jpg`)

          res.data.pipe(writeStream);
        })
    });

    await Promise.all(filesToDownload)
  }
}

await downloadCovers([
  "https://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=877",
  "https://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=1186",
  "https://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=14547",
  'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=13134',
  'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=13135',
  'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=14856',
  'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=9630',
  'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=12512',
  'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=12513',
  'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=16027'
], { outputPath: './games/covers' })
  .catch(err => console.log(err));