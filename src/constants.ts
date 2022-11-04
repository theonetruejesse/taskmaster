import { Client } from "@notionhq/client";
import { getNextWeek } from "./utils/dates";
import "dotenv-safe/config";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const week = getNextWeek();

// ik -> iterator keys

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

console.log(tomorrow);
