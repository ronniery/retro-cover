"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const cheerio_1 = require("cheerio");
const platform_additions_1 = __importDefault(require("../selectors/platform-additions"));
const node_url_1 = __importDefault(require("node:url"));
const countries = Object.freeze({
    au: 'Australia',
    eu: 'Europe',
    jp: 'Japan',
    us: 'United States',
    ca: 'Canada',
    nl: 'The Netherlands',
    de: 'Germany',
    fr: 'France',
    br: 'Brazil',
    it: 'Italy',
    gb: 'Great Britain',
    noregion: 'No Region Specified',
});
class Parser {
    constructor(html, baseURI) {
        this.baseURI = baseURI;
        this.$ = (0, cheerio_1.load)(html);
    }
    extractCountry(iconSrc) {
        var _a, _b;
        if (!iconSrc) {
            return 'No Region Specified';
        }
        const countryCode = (_a = iconSrc.match(/\/images\/flags\/(.*)\.png/)) === null || _a === void 0 ? void 0 : _a[1];
        return (_b = countries[countryCode]) !== null && _b !== void 0 ? _b : 'No Region Specified';
    }
    parse() {
        var _a;
        const [total] = (_a = this.$(platform_additions_1.default.totalOfCovers).text().match(/\d+/)) !== null && _a !== void 0 ? _a : [];
        return {
            total: +(total !== null && total !== void 0 ? total : 0),
            items: this.$(platform_additions_1.default.cover.items)
                .map((_, element) => {
                var _a, _b, _c, _d, _e;
                const name = this.$(element).find(platform_additions_1.default.cover.name).text();
                const countryIcon = this.$(element)
                    .find(platform_additions_1.default.cover.countryIcon)
                    .attr('src');
                const format = ((_b = (_a = this.$(element)
                    .find(platform_additions_1.default.cover.format)
                    .text()
                    .match(/\((.*?)\)/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 'N/A');
                const added = new Date((_d = (_c = this.$(element)
                    .find(platform_additions_1.default.cover.added)
                    .text()
                    .match(/Added: (.*)/)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : '');
                const source = new URL(node_url_1.default.resolve(this.baseURI, (_e = this.$(element).find(platform_additions_1.default.cover.source).attr('href')) !== null && _e !== void 0 ? _e : ''));
                return {
                    name,
                    country: this.extractCountry(countryIcon),
                    format,
                    added,
                    source,
                };
            })
                .get(),
        };
    }
}
exports.Parser = Parser;
//# sourceMappingURL=platform-parser.js.map