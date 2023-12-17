import * as cheerio from "cheerio";

import { IParser } from "./parser.types";

export abstract class AbstractParser<TOutput> implements IParser<TOutput> {
  protected $: cheerio.Root;

  constructor(htmlString: string) {
    this.$ = cheerio.load(htmlString, {
      decodeEntities: false,
      lowerCaseTags: true,
      lowerCaseAttributeNames: true,
      recognizeCDATA: true,
      recognizeSelfClosing: true,
      normalizeWhitespace: true,
      _useHtmlParser2: true
    })
  }

  public abstract parse(): TOutput
}