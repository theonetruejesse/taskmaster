import { notion, week } from "../constants";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { CloneState } from "./clone";
import { SOON_STATUS } from "../properties/Status";
import { IS_GENERATED } from "../properties/Generated";
import { DateRange, getNewDays } from "../utils/dates";

export interface MastermindState {
  Name: string;
  Date: DateRange;
  Status: any;
  Generated: any;
  OtherProps: any;
}
export const getUpdatedMMState = (
  genesis: PageObjectResponse,
  cloneState: CloneState
): MastermindState => {
  const props = genesis.properties;

  let title = "ERROR";
  if (props.Name.type == "title" && props.Name.title) {
    title = props.Name.title[0]["plain_text"];
  }

  return {
    Name: `${cloneState.Streak} - ${title}`,
    Date: getNewDays(week, cloneState.DayNames),
    Generated: IS_GENERATED,
    Status: SOON_STATUS,
    OtherProps: props,
  };
};

export const getMMPage = async (pageId: string) => {
  const response = await notion.pages
    .retrieve({ page_id: pageId })
    .catch((err) => {
      throw err;
    });
  return response;
};

export const addToMM = async (mmState: MastermindState) => {
  const newDates = mmState.Date.End
    ? {
        start: mmState.Date.Start,
        end: mmState.Date.End,
      }
    : {
        start: mmState.Date.Start,
      };

  const response = await notion.pages
    .create({
      parent: {
        type: "database_id",
        database_id: process.env.DATABASE_ID_MM,
      },
      properties: {
        ...mmState.OtherProps,
        Name: {
          title: [
            {
              text: {
                content: mmState.Name,
              },
            },
          ],
        },
        Generated: mmState.Generated,
        Status: mmState.Status,
        Date: {
          date: newDates,
        },
      },
    })
    .catch((err) => {
      throw err;
    });
  return response;
};
