import cors from "cors";
import express, { response } from "express";
import { notion } from "./constants";
import {
  getUpdatedCloneState,
  getActiveClones,
  updateClone,
} from "./queries/clone";
import { isFullPage } from "@notionhq/client";
import { addToMM, getMMPage, getUpdatedMMState } from "./queries/mastermind";

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
    const response = await getActiveClones();

    for (const page of response.results) {
      if (isFullPage(page)) {
        const cloneState = getUpdatedCloneState(page);
        // updateClone(cloneState);
        if (!cloneState.GenesisId) throw "no genesis id found";

        if (cloneState.Active) {
          const genesis = await getMMPage(cloneState.GenesisId);
          if (!isFullPage(genesis)) throw "genesis is not a full page";
          const mmState = getUpdatedMMState(genesis, cloneState);
          addToMM(mmState);
        }
      }
    }
    res.send(response);
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log("\nlistening to port:", process.env.PORT);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
