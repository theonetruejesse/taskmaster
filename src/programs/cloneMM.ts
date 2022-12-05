import { isFullPage } from "@notionhq/client";
import { getUpdatedCloneStates } from "../interfaces/cloneState";
import { genesisToMMState, MastermindState } from "../interfaces/mmState";
import { getActiveClones, updateClone } from "../queries/clone";
import { addToMM, getMMPage } from "../queries/mastermind";

export const cloneMM = async () => {
  const response = await getActiveClones();
  const additions: Array<MastermindState> = [];
  for (const page of response.results) {
    if (isFullPage(page)) {
      const cloneStates = getUpdatedCloneStates(page);
      // todo -> fix up only in active cases
      // todo -> refractor based on Repeat cases (currently just a mesh)
      if (!cloneStates[0].GenesisId) throw "no genesis given";
      const genesis = await getMMPage(cloneStates[0].GenesisId);
      if (!isFullPage(genesis)) throw "genesis is not a full page";

      // needed for <weekly Repeats (ex: daily)
      for (let i = 0; i < cloneStates.length; i++) {
        const cloneState = cloneStates[i];

        if (!cloneState.GenesisId) throw "no genesis id found";

        // needed for >weekly Repeats (ex: monthly)
        if (cloneState.Active) {
          const mmState = genesisToMMState(genesis, cloneState);
          additions.push(mmState);
          addToMM(mmState);
        }

        // save on api calls
        if (i == cloneStates.length - 1) updateClone(cloneState);
      }
    }
  }
  return {
    response,
    additions,
  };
};
