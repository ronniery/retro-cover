"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatformAdditions = void 0;
const axios_1 = __importDefault(require("axios"));
const platform_parser_1 = require("./parsers/platform-parser");
const client = axios_1.default.create({
    baseURL: 'http://www.thecoverproject.net',
});
const getPlatformAdditions = (platform) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield client.get(`/view.php?cat_id=${platform}`, {
        transformResponse: (html, _headers, status) => {
            console.log(status);
            return new platform_parser_1.Parser(html, 'http://www.thecoverproject.net').parse();
        },
    });
    return data;
});
exports.getPlatformAdditions = getPlatformAdditions;
//# sourceMappingURL=service.js.map