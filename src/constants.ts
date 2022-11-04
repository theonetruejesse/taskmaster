import { Client } from "@notionhq/client";
import { getNextWeek } from "./utils/dates";
import "dotenv-safe/config";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const week = getNextWeek();

// ik -> iterator keys
export const ikDayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
