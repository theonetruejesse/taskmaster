import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "../constants";
import { DateRange } from "../utils/dates";

export interface CloneState {
  Active: boolean;
  Streak: number;
  State: number;
  PageId: string;
  DayNames: DateRange;
  GenesisId: string | null;
  // Repeat: Repeat (enum)
}

export const getUpdatedCloneState = (page: PageObjectResponse): CloneState => {
  const props = page.properties;
  const isActive = props.Active.type == "checkbox" && props.Active.checkbox;

  let state = -1;
  if (props.State.type == "number") {
    state = props.State.number ? props.State.number : 0;
  }

  // todo -> add in date logic for determining streak
  let streak = -1;
  if (props.Streak.type == "number") {
    streak = props.Streak.number ? props.Streak.number : 0;
  }

  let genesisId: string | null = null;
  if (props.Genesis.type == "relation") {
    genesisId =
      props.Genesis.relation.length == 1 ? props.Genesis.relation[0].id : null;
  }
  if (!genesisId) throw "no genesis id given";

  let start: string | undefined = undefined;
  if (props.Start.type == "select") {
    start = props.Start.select?.name;
  }
  if (!start) throw "no starting day selected";

  let end: string | undefined = undefined;
  if (props.End.type == "select") {
    end = props.End.select?.name;
  }

  return {
    Active: isActive,
    State: state + 1,
    Streak: streak + 1, // need biz logic
    PageId: page.id,
    DayNames: {
      Start: start,
      End: end ? end : null,
    },
    GenesisId: genesisId,
  };
};

export const getActiveClones = async () => {
  const response = await notion.databases.query({
    database_id: process.env.DATABASE_ID_CLONE,
    filter: {
      property: "Active",
      checkbox: {
        equals: true,
      },
    },
  });
  return response;
};

export const updateClone = async (newState: CloneState) => {
  const response = await notion.pages
    .update({
      page_id: newState.PageId,
      properties: {
        Streak: {
          number: newState.Streak,
        },
        State: {
          number: newState.State,
        },
      },
    })
    .catch((err) => {
      throw err;
    });
  return response;
};
