import { paginationSelector } from '../selectors/pagination.selector';
import { AbstractParser } from './parser';
import { getPaginationHtml } from './parser.mock';
import { Pagination } from './parser.types';

// TODO: still need to work on this
// jest.mock('../selectors/pagination.selector', () => ({
//   paginationSelector: jest.fn(() => ({
//     spanThisPage: { text: jest.fn().mockReturnValue('1') },
//     paginatorChildren: {
//       last: jest.fn().mockReturnValue({ text: (): string => '3' }),
//     },
//   })),
// }));

class ConcreteParser extends AbstractParser<string> {
  public parse(): string {
    return `Parsed Output`;
  }

  public get cheerio(): cheerio.Root {
    return this.$;
  }

  public get pagination(): Pagination {
    return this.getPagination(3);
  }
}

describe('AbstractParser', () => {
  let parser: ConcreteParser;

  beforeEach(() => {
    parser = new ConcreteParser(`<html></html>`);
  });

  it('should parse HTML and return expected output', () => {
    const parsedOutput = parser.parse();
    expect(parsedOutput).toBe('Parsed Output');
  });

  it('should initialize cheerio instance', () => {
    expect(parser).toHaveProperty('$');
    expect(parser.cheerio).toBeDefined();
  });

  it('should call paginationSelector while getting pagination', () => {
    expect(typeof parser.pagination).toBe('object');
    expect(paginationSelector).toHaveBeenCalledWith(parser.cheerio);
  });

  it('should validate the generated pagination for starting navigation', () => {
    const localParser = new ConcreteParser(getPaginationHtml().starting);

    expect(localParser.pagination).toStrictEqual({
      next: 2,
      prev: null,
      itemsPerPage: 3,
      current: 1,
      totalPages: 3,
    });
  });

  it('should validate the generated pagination for middle navigation', () => {
    const localParser = new ConcreteParser(getPaginationHtml().middle);

    expect(localParser.pagination).toStrictEqual({
      next: 3,
      prev: 1,
      itemsPerPage: 3,
      current: 2,
      totalPages: 3,
    });
  });

  it('should validate the generated pagination for middle ending', () => {
    const localParser = new ConcreteParser(getPaginationHtml().ending);

    expect(localParser.pagination).toStrictEqual({
      next: null,
      prev: 2,
      itemsPerPage: 3,
      current: 3,
      totalPages: 3,
    });
  });
});
