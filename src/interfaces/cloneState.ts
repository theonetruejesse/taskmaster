import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { DateRange, DayNames } from "../utils/dates";

export interface CloneState {
  Active: boolean;
  Streak: number;
  State: number;
  PageId: string;
  DayNames: DateRange;
  GenesisId: string | null;
  Repeat: string;
}

export const getUpdatedCloneStates = (
  page: PageObjectResponse
): Array<CloneState> => {
  const clean = cleanCloneState(page);

  switch (clean.Repeat) {
    case "Daily":
      return getDailyClones(clean);
    case "EO-Day":
      return getEoDClones(clean);
    case "Weekly":
      return [clean];
    case "EO-Week":
      return getEoWClones(clean);
    case "Monthly":
      return getMonthlyClones(clean);
    default:
      return [clean];
  }
};

const cleanCloneState = (page: PageObjectResponse): CloneState => {
  const props = page.properties;

  let state = -1;
  if (props.State.type == "number") {
    state = props.State.number ? props.State.number : state;
  }

  let streak = -1;
  if (props.Streak.type == "number")
    streak = props.Streak.number ? props.Streak.number : 1;

  let repeatType: string | undefined = undefined;
  if (props.Repeat.type == "select") repeatType = props.Repeat.select?.name;
  if (!repeatType) throw "no repeat type selected";

  let start: string | undefined = undefined;
  if (props.Start.type == "select") start = props.Start.select?.name;
  // double check conditional logic
  if (!start && repeatType != "EoD" && repeatType != "Daily")
    throw "no starting day selected";

  let end: string | undefined = undefined;
  if (props.End.type == "select") end = props.End.select?.name;

  let genesisId: string | null = null;
  if (props.Genesis.type == "relation")
    genesisId =
      props.Genesis.relation.length >= 1 ? props.Genesis.relation[0].id : null;
  if (!genesisId) throw "no genesis id given";

  const isActive = props.Active.type == "checkbox" && props.Active.checkbox;

  return {
    State: state + 1,
    Streak: streak + 1,
    DayNames: {
      Start: start ? start : null,
      End: end ? end : null,
    },
    Active: isActive,
    PageId: page.id,
    GenesisId: genesisId,
    Repeat: repeatType,
  };
};

const getDailyClones = (clean: CloneState): Array<CloneState> => {
  // todo -> dynamic lengths based off start and ending distance
  // overengineered solution...
  // const endOfWeek = (Math.floor(res[0].Streak / 7) + 1) * 7;
  // while (res[-1].Streak < endOfWeek) {
  // }

  const res: Array<CloneState> = [];

  // ts enums are lowkey cringe
  const days = Object.values(DayNames).filter((v) => !isNaN(Number(v)));
  for (const d of days) {
    res.push({
      ...clean,
      State: clean.State + (d as number),
      Streak: clean.Streak + (d as number),
      DayNames: {
        Start: DayNames[d as number],
        End: clean.DayNames.End,
      },
    });
  }

  return res;
};
const getEoDClones = (clean: CloneState): Array<CloneState> => {
  const res = getDailyClones(clean);
  return res.map((r) => {
    // 0 is starting state, let it be active then
    return { ...r, Active: r.State % 2 == 0 ? r.Active : false };
  });
};
const getEoWClones = (clean: CloneState): Array<CloneState> => {
  return [{ ...clean, Active: clean.State % 2 == 0 ? clean.Active : false }];
};
const getMonthlyClones = (clean: CloneState): Array<CloneState> => {
  // todo -> based off day of month rather than set number of weeks
  return [{ ...clean, Active: clean.State % 4 == 0 ? clean.Active : false }];
};
