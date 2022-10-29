import { Client } from "@notionhq/client";
import cors from "cors";
import express, { response } from "express";
import "dotenv-safe/config";

async function main() {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });
  const app = express();
  app.set("proxy", 1);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.get("/", async (req, res) => {
    const response = await notion.databases.query({
      database_id: process.env.DATABASE_ID,
    });
    res.send(response);
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log("\nlistening to port:", process.env.PORT);

    // const response = await notion.databases.query({
    //   database_id: process.env.DATABASE_ID,
    // });

    // console.log("Got response:", response);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
