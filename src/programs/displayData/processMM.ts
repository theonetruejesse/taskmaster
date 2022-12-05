import { isFullPage } from "@notionhq/client";
import { getMasterMindState, MastermindState } from "../../interfaces/mmState";
import { Roi } from "../../properties/Roi";
import { Status } from "../../properties/Status";
import { Type } from "../../properties/Type";
import { getAllMM } from "../../queries/mastermind";
import {
  createDateList,
  dateRangeToKeyString,
  DayNames,
  getDayOfWeek,
  getThatWeek,
} from "../../utils/dates";

export interface MastermindChunk {
  Name: string;
  Day: string;
  Time: number;
  Status: Status;
  Roi: Roi;
  Tags: string[];
  Type: Type;
}

// break state down into chunks (data objects) based on dates
const breakdown = (mmState: MastermindState): Array<MastermindChunk> => {
  if (!mmState.Date.Start) throw "no start given";

  const chunks: MastermindChunk[] = [];
  if (!mmState.Time || !mmState.Data) return chunks;

  const totalTime = mmState.Time!.Hours * 60 + mmState.Time!.Minutes;
  const duplicateInfo = {
    Status: mmState.Status,
    Roi: mmState.Data!.Roi,
    Tags: mmState.Data!.Tags,
    Type: mmState.Data!.Type,
  };

  if (!mmState.Date.End)
    return [
      {
        ...duplicateInfo,
        Name: mmState.Name,
        Day: mmState.Date.Start,
        Time: totalTime,
      },
    ];

  // todo -> break into chunks based off day splitting
  const dateList = createDateList(mmState.Date);
  const numberOfDays = dateList.length;
  for (let i = 0; i < numberOfDays; i++)
    chunks.push({
      ...duplicateInfo,
      Name: `${mmState.Name} (${i + 1}/${numberOfDays})`,
      Day: dateList[i],
      Time: Math.round(totalTime / numberOfDays),
    });

  return chunks;
};

// {Sunday: [], Monday: [], ... /Saturday: []}
const startingState = Object.keys(DayNames).reduce((days: any, d: any) => {
  const addDay: any = {};
  if (isNaN(d)) addDay[d] = [];
  return { ...days, ...addDay };
}, {});

export const processData = async () => {
  const ikDateRanges: string[] = [];
  let totalDataPoints = 0;
  let dataMap: any = {};
  const response = await getAllMM();

  for (const page of response.results) {
    if (isFullPage(page)) {
      const state = getMasterMindState(page);
      const stateChunks: MastermindChunk[] = breakdown(state);
      stateChunks.map((c) => {
        const dateRange = getThatWeek(c.Day);
        const dateKey = dateRangeToKeyString(dateRange);
        if (!dataMap[dateKey]) {
          dataMap[dateKey] = startingState;
          ikDateRanges.push(dateKey);
        }
        const dayOfWeek = getDayOfWeek(c.Day);
        dataMap[dateKey][dayOfWeek].push(c);
      });
      totalDataPoints += stateChunks.length;
    }
  }
  ikDateRanges.sort();
  return {
    TotalDataPoints: totalDataPoints,
    IteratorKeys: {
      dateRanges: ikDateRanges,
      dayNames: Object.keys(DayNames).filter((k: any) => isNaN(k)), // ["Sunday", "Monday", ... , "Saturday"]
    },
    Map: dataMap,
  };
};
