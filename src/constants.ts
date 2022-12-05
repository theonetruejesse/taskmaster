import { Client } from "@notionhq/client";
import { DayNames, getNextWeek } from "./utils/dates";
import "dotenv-safe/config";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const week = getNextWeek();

// good testing place
console.log(week);
