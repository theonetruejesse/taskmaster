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
exports.attempt = void 0;
const client_1 = require("@notionhq/client");
const constants_1 = require("../constants");
const attempt = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield constants_1.notion.databases.query({
            database_id: process.env.DATABASE_ID_CLONE,
            filter: {
                property: "Active",
                checkbox: {
                    equals: true,
                },
            },
        });
    }
    catch (error) {
        if ((0, client_1.isNotionClientError)(error)) {
            // error is now strongly typed to NotionClientError
            switch (error.code) {
                case client_1.ClientErrorCode.RequestTimeout:
                    // ...
                    break;
                case client_1.APIErrorCode.ObjectNotFound:
                    // ...
                    break;
                case client_1.APIErrorCode.Unauthorized:
                    // ...
                    break;
                // ...
                default:
                    // you could even take advantage of exhaustiveness checking
                    assertNever(error.code);
            }
        }
    }
});
exports.attempt = attempt;
