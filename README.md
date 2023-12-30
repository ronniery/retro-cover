# retro-cover
*Search and download covers from [thecoverproject.com](https://www.thecoverproject.net)*

You can search and download covers directly from their servers, leaving the boring HTML parsing for us.
**To install:**
```
npm install retro-cover
```
## API
Some endpoints are available within the server, which can be consumed through this library. The first one is:

### Search(online|offline) Games
To search any term inside **thecoverpoject** you can use a function called `searchOnline` and `searchOffline`. This function will hit the server searching and parsing the output HTML:
```typescript
import { searchOnline, searchOffline } from 'retro-cover';

searchOnline('mario');
searchOnline('mario', { page: 2 });
// Or
searchOffline('mario');
```
Those two functions exist because of the way the server was built; if you try to search simple strings like `super Mario`, `Legend of Zelda`, or `Pokemon`, the server will return satisfactory results. However, if you need more complex stuff like `Conker's Pocket Tales` or `Bubba 'n' Stix` the server will return no results, even thought there are valid results, so to let you search what you want, use this condition, if it has special characters, try the `searchOffline` for the other conditions use `searchOnline`.
### Download Covers
You can get data or download all game covers from a game using those two methods:
```typescript
import { getGameCovers, downloadCovers } from 'retro-cover';

getGameCovers([
  '4916', // Dr. Mario (GBA)
  '3043', // Dr. Mario (NES)
])

downloadCovers([
 'https://www.thecoverproject.net/view.php?cover_id=4155', // Dr. Mario (NES) 1st cover
 '10767' // Dr. Mario (NES) 2nd cover
], '/output/path')
```
Use the search methods to receive an object containing the URL from a cover game or even the `gameId` required by those two previous methods.
### Search Covers
If you want to search covers by platform, you can use the two following methods:
```typescript
import { getAdditionsByPlatform, getCoversByPlatform, type Platforms } from 'retro-cover';

getAdditionsByPlatform(Platforms.playstation3)
// Or
getCoversByPlatform(Platforms.playstation3, 'A');
```
