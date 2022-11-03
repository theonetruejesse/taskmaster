import { isFullPage } from "@notionhq/client";
import {
  getActiveClones,
  getUpdatedCloneState,
  updateClone,
} from "../queries/clone";
import { addToMM, getMMPage, getUpdatedMMState } from "../queries/mastermind";

export const cloneMM = async () => {
  const response = await getActiveClones();

  const additions = [];
  for (const page of response.results) {
    if (isFullPage(page)) {
      const cloneState = getUpdatedCloneState(page);
      updateClone(cloneState);
      if (!cloneState.GenesisId) throw "no genesis id found";

      if (cloneState.Active) {
        const genesis = await getMMPage(cloneState.GenesisId);
        if (!isFullPage(genesis)) throw "genesis is not a full page";
        const mmState = getUpdatedMMState(genesis, cloneState);
        additions.push(mmState);
        addToMM(mmState);
      }
    }
  }
  return {
    response,
    additions,
  };
};
