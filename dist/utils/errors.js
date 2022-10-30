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
Object.defineProperty(exports, "__esModule", { value: true });
exports.notionErrorWrapper = void 0;
const client_1 = require("@notionhq/client");
const { Client, APIErrorCode } = require("@notionhq/client");
const notionErrorWrapper = (notionRequest) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield notionRequest();
    }
    catch (error) {
        if ((0, client_1.isNotionClientError)(error)) {
            switch (error.code) {
                case client_1.ClientErrorCode.RequestTimeout:
                    return "ClientErrorCode.RequestTimeout";
                case APIErrorCode.ObjectNotFound:
                    return "APIErrorCode.ObjectNotFound";
                case APIErrorCode.Unauthorized:
                    return "APIErrorCode.Unauthorized";
                default:
                    return;
            }
        }
    }
});
exports.notionErrorWrapper = notionErrorWrapper;
