import cors from "cors";
import express from "express";
import { week } from "./constants";
import { cloneMM } from "./programs/cloneMM";

async function main() {
  const app = express();
  app.set("proxy", 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.get("/clone", async (req, res) => {
    console.log("\n", week);
    res.send(await cloneMM());
  });

  app.get("/data", async (req, res) => {
    res.send("cool data bro");
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log("\nlistening to port:", process.env.PORT);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
