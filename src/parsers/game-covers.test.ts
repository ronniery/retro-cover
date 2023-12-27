import { gameCovers, gameMetadata } from './game-covers.mock';
import { GameCoverMetadataParser, GameCoverParser } from './game-covers';

import { DraftGameCover } from '../types';

describe('parsers/game-covers.ts | GameCoverMetadataParser', () => {
  const { internationalSuperstarSoccer64, spiderMan2 } = gameMetadata;

  it('should parse Spider Man 2 and check the generated metadata', () => {
    const { html, gameId } = spiderMan2;
    const metadata = new GameCoverMetadataParser(html).parse({ gameId: gameId });

    expect(metadata).toBeObject();
    expect(metadata).toHaveProperty('covers', []);
    expect(metadata).toHaveProperty('manuals', []);
    expect(metadata).toHaveProperty('platform', 'Playstation 1');
    expect(metadata).toHaveProperty('source', `http://www.thecoverproject.net/view.php?cover_id=${gameId}`);
    expect(metadata).toHaveProperty('gameTitle', 'Spider-Man 2');
  });

  it('should parse Spider Man 2 and check generated drafts', () => {
    const { html, gameId } = spiderMan2;
    const metadata = new GameCoverMetadataParser(html).parse({
      gameId: gameId,
    });

    const { drafts } = metadata;
    expect(drafts).toBeDefined();
    expect(drafts).toBeArray();
    expect(drafts).toEqual(
      expect.arrayContaining([
        expect.objectContaining<DraftGameCover>({
          country: expect.toBeOneOf(['us', 'fr']),
          coverId: expect.any(String),
          format: expect.toBeOneOf(['NTSC', 'PAL']),
        }),
      ]),
    );
  });

  it('should parse Spider Man 2 bringing only the first available', () => {
    const { html, coverId, gameId } = spiderMan2;
    const metadata = new GameCoverMetadataParser(html).parse({
      gameId: gameId,
      firstAvailable: true,
    });

    const { drafts } = metadata;
    expect(drafts).toBeArray();
    expect(drafts.length).toBe(1);

    const [draft] = drafts;
    expect(draft).toHaveProperty('country', 'fr');
    expect(draft).toHaveProperty('coverId', String(coverId));
    expect(draft).toHaveProperty('format', 'PAL');
  });

  it('should parse Spider Man 2 bringing only specified format', () => {
    const { html, gameId } = spiderMan2;
    const metadata = new GameCoverMetadataParser(html).parse({
      gameId: gameId,
      onlyFormats: ['PAL'],
    });

    const { drafts } = metadata;
    expect(drafts).toBeArray();
    expect(drafts.length).toBe(2);

    drafts.forEach((draft) => {
      expect(draft).toHaveProperty('country', 'fr');
      expect(draft).toHaveProperty('coverId');
      expect(draft.coverId).toBeOneOf(['25045', '25046']);
      expect(draft).toHaveProperty('format', 'PAL');
    });
  });

  it('should parse Spider Man 2 bringing only specified region', () => {
    const { html, gameId } = spiderMan2;
    const metadata = new GameCoverMetadataParser(html).parse({
      gameId: gameId,
      onlyRegions: ['us'],
    });

    const { drafts } = metadata;
    expect(drafts).toBeArray();
    expect(drafts.length).toBe(3);

    drafts.forEach((draft) => {
      expect(draft).toHaveProperty('country', 'us');
      expect(draft).toHaveProperty('coverId');
      expect(draft.coverId).toBeOneOf(['21886', '8336', '8337']);
      expect(draft).toHaveProperty('format', 'NTSC');
    });
  });

  it('should parse International Superstar Soccer 64 bringing game manuals', () => {
    const { html, gameId } = internationalSuperstarSoccer64;
    const metadata = new GameCoverMetadataParser(html).parse({
      gameId: gameId,
      includeManuals: true,
    });

    const { manuals } = metadata;
    expect(manuals).toBeArray();
    expect(manuals.length).toBe(1);

    manuals.forEach((manual) => {
      expect(manual).toHaveProperty('language', 'English');
      expect(manual).toHaveProperty(
        'source',
        'http://www.thecoverproject.net/images/manuals/InternationalSuperstarSoccer64.pdf',
      );
    });
  });
});

describe('GameCoverParser', () => {
  const { fightNight, zenji } = gameCovers;

  it('should parse Fight Night cover', () => {
    const cover = new GameCoverParser(fightNight.html).parse();

    expect(cover).toHaveProperty('description', 'Retail Cover');
    expect(cover).toHaveProperty('format', 'NTSC');
    expect(cover).toHaveProperty('createdBy', 'Lumberjack42');
    expect(cover).toHaveProperty('region', 'United States');
    expect(cover).toHaveProperty('caseType', 'Universal Game Case');
    expect(cover).toHaveProperty('downloadedTimes', 1067);
    expect(cover).toHaveProperty(
      'downloadUrl',
      'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=14022',
    );
  });

  it('should parse Zenji cover', () => {
    const cover = new GameCoverParser(zenji.html).parse();

    expect(cover).toHaveProperty('description', 'Retail Cover');
    expect(cover).toHaveProperty('format', 'NTSC');
    expect(cover).toHaveProperty('createdBy', 'Lumberjack42');
    expect(cover).toHaveProperty('region', 'United States');
    expect(cover).toHaveProperty('caseType', 'Universal Game Case');
    expect(cover).toHaveProperty('downloadedTimes', 604);
    expect(cover).toHaveProperty(
      'downloadUrl',
      'http://www.thecoverproject.net/download_cover.php?src=cdn&cover_id=13661',
    );
  });
});
