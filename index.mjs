import fs from 'fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { default as _ } from 'lodash';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import https from 'node:https';

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

  for (let block of chunk(targets, Math.min([5, parallelDownload]))) {
    const filesToDownload = block.map(item => {
      let url = item?.downloadUrl;

      if (isEmpty(url)) {
        url = item
      }

      return fetch(url, {
        method: "GET",
        agent: new https.Agent({
          rejectUnauthorized: false,
        })
      })
        .then(res => {
          const attachment = res.headers.get('content-disposition');
          const [, filename] = attachment.match(/filename=(.*).jpg/);
          const writeStream = fs.createWriteStream(`${fullPath}/${filename || uuidv4()}.jpg`)

          res.body.pipe(writeStream);
        })
    });

    await Promise.all(filesToDownload)
  }
}

await downloadCovers([
  "https://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=877",
  // "https://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=1186",
  // "https://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=14547"
], { outputPath: './games/covers' });