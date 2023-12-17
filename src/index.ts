import { getRobots } from "./services/robots";
import { searchOffline, searchOnline } from "./services/search-game";

(async () => {
  // const x = await getRobots();
  // console.log(x)

  // const x = await searchOnline("mario");
  const y = await searchOffline("mario");
  // console.log(x, y);
  console.log(y);
})()