import * as cheerio from "cheerio";

import { IParser, Pagination } from "./parser.types";
import { paginationSelector } from "../selectors/pagination.selector";

export abstract class AbstractParser<TOutput, TParseOptions = undefined> implements IParser<TOutput, TParseOptions> {
  protected $: cheerio.Root;

  constructor(htmlString: string, useOptions = true) {
    const options = {
      decodeEntities: false,
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
      recognizeCDATA: true,
      recognizeSelfClosing: true,
      normalizeWhitespace: true,
      _useHtmlParser2: true
    };

    this.$ = cheerio.load(htmlString, useOptions ? options : {})
  }

  public abstract parse(options?: TParseOptions): TOutput

  protected getPagination(collectionSize: number): Pagination {
    const { spanThisPage, paginatorChildren } = paginationSelector(this.$);

    // Extract pagination information
    const current = parseInt(spanThisPage.text());
    const pageSize = collectionSize;
    const totalPages = parseInt(paginatorChildren.last().text());
    const next = current === totalPages ? null : current + 1;
    const prev = current === 1 ? null : current - 1;

    return {
      current,
      pageSize,
      totalPages,
      next,
      prev
    }
  }
}