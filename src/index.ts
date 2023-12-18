import { getAdditionsByPlatform, getCoversByPlatform } from "./services/platform";
import { getRobots } from "./services/robots";
import { searchOffline, searchOnline, getGameCovers, downloadCovers } from "./services";
import { Consoles } from "./constants";

(async () => {
  // const x = await getRobots();
  // console.log(x)

  // const x = await searchOnline("mario");
  // const y = await searchOffline("mario");
  // console.log(x, y);
  // const y = await getAdditionsByPlatform(Consoles["3DO"]);
  // const y = await getCoversByPlatform(Consoles.playstation1, 'A', { page: 1 })
  // const y = await getGameCovers([
  //   "832", "11111111111", "345"])
  // ], {
  //   includeManuals: false,
  //   firstAvailable: true,  // ignore other results and bring the first only
  //   //onlyRegions: /*['The Netherlands']*/['nl'], // only bring results that are inside the region array (translate it)
  //   //onlyFormats: ['PAL', 'NTSC'], // only bring results for that formats
  // })
  // console.log(JSON.stringify(y, null, 2));
  await downloadCovers([
    "http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=877",
    "http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=1186",
    "http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=14547",
    'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=13134',
    'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=13135',
    'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=14856',
    'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=9630',
    'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=12512',
    'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=12513',
    'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=16027'
  ], '../games/covers')
    .catch(err => console.log(err));
})()

process.on('uncaughtException', (err) => {
  console.log(err)
})

process.on('unhandledRejection', (err) => {
  console.log(err)
})