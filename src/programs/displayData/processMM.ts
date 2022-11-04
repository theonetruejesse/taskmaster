import { isFullPage } from "@notionhq/client";
import { getMasterMindState, MastermindState } from "../../interfaces/mmState";
import { Roi } from "../../properties/Roi";
import { Status } from "../../properties/Status";
import { Type } from "../../properties/Type";
import { getAllMM } from "../../queries/mastermind";
import { getDateRange } from "../../utils/dates";

export interface MastermindChunk {
  Name: string;
  Day: string;
  Status: Status;
  Roi: Roi;
  Tags: string[];
  Type: Type;
}

// break state down into chunks (data objects) based on dates
const breakdown = (mmState: MastermindState): Array<MastermindChunk> => {
  const chunks: MastermindChunk[] = [];
  if (!mmState.Time || !mmState.Data) return chunks;

  if (!mmState.Date.End)
    return [
      {
        Name: mmState.Name,
        Day: mmState.Date.Start,
        Status: mmState.Status,
        Roi: mmState.Data!.Roi,
        Tags: mmState.Data!.Tags,
        Type: mmState.Data!.Type,
      },
    ];

  const totalTime = mmState.Time!.Hours * 60 + mmState.Time!.Minutes;
  // todo -> break into chunks based off day splitting

  return [];
};

export const processData = async () => {
  const ikData: string[] = [];
  let dataMap: any = {};
  const response = await getAllMM();

  for (const page of response.results) {
    if (isFullPage(page)) {
      const state = getMasterMindState(page);
      const stateChunks: MastermindChunk[] = breakdown(state);
      stateChunks.map((c) => {
        // const dateRange = getThatWeek(c.Day);
        const dateKey = dateRangeToKeyString(dateRange);
        if (!dataMap[dateKey]) {
          dataMap[dateKey] = startingValueState();
          ikData.push(dateKey);
        }
        const dayOfWeek = getDayOfWeek(minion.Day);
        dataMap[dateKey][dayOfWeek].append(minion); // todo -> create typing for dayNames
      });
    }
  }
  ikData.sort();
  return {} as DataMapObject;
};
