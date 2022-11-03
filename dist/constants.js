"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.week = exports.notion = void 0;
const client_1 = require("@notionhq/client");
const dates_1 = require("./utils/dates");
require("dotenv-safe/config");
exports.notion = new client_1.Client({
    auth: process.env.NOTION_TOKEN,
});
exports.week = (0, dates_1.getNextWeek)();
console.log(exports.week);
