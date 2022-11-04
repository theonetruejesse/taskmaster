import { isFullPage } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { week } from "../constants";
import { MastermindState } from "../interfaces/mmState";
import { Status } from "../properties/Status";
import {
  CloneState,
  getActiveClones,
  getUpdatedCloneState,
  updateClone,
} from "../queries/clone";
import { addToMM, getMMPage } from "../queries/mastermind";
import { getNewDays } from "../utils/dates";

const genesisToMMState = (
  genesis: PageObjectResponse,
  cloneState: CloneState
): MastermindState => {
  const props = genesis.properties;

  let title = "";
  if (props.Name.type == "title" && props.Name.title) {
    title = props.Name.title[0]["plain_text"];
  }
  if (!title) throw "title error";

  return {
    Name: `${cloneState.Streak} - ${title}`,
    Date: getNewDays(week, cloneState.DayNames),
    Generated: true,
    Status: Status.Soon,
    Data: null,
    Time: null,
    OtherProps: props,
  };
};

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
        const mmState = genesisToMMState(genesis, cloneState);
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
