import { getAdditionsByPlatform, getCoversByPlatform } from "./services/platform";
import { getRobots } from "./services/robots";
import { searchOffline, searchOnline } from "./services/search";
import { Consoles } from "./constants";

(async () => {
  // const x = await getRobots();
  // console.log(x)

  // const x = await searchOnline("mario");
  // const y = await searchOffline("mario");
  // console.log(x, y);
  // const y = await getAdditionsByPlatform(Consoles["3DO"]);
  const y = await getCoversByPlatform(Consoles.playstation1, 'A', { page: 2 })
  console.log(JSON.stringify(y, null, 2));
})()