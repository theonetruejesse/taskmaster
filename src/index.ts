import cors from "cors";
import express from "express";
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
    res.send(await cloneMM());
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log("\nlistening to port:", process.env.PORT);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
