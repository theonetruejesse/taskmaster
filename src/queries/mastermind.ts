import { notion } from "../constants";
import { getGeneratedProp } from "../properties/Generated";
import { getDateProp } from "../properties/Date";
import { getNameProp } from "../properties/Name";
import { getStatusProp } from "../properties/Status";
import { MastermindState } from "../interfaces/mmState";

export const getMMPage = async (pageId: string) => {
  const response = await notion.pages
    .retrieve({ page_id: pageId })
    .catch((err) => {
      throw err;
    });
  return response;
};

export const addToMM = async (mmState: MastermindState) => {
  const response = await notion.pages
    .create({
      parent: {
        type: "database_id",
        database_id: process.env.DATABASE_ID_MM,
      },
      properties: {
        ...mmState.OtherProps,
        Name: getNameProp(mmState.Name),
        Generated: getGeneratedProp(mmState.Generated),
        Status: getStatusProp(mmState.Status),
        Date: getDateProp(mmState.Date),
      },
    })
    .catch((err) => {
      throw err;
    });
  return response;
};

export const getAllMM = async () => {
  const response = await notion.databases
    .query({
      database_id: process.env.DATABASE_ID_MM,
      sorts: [
        {
          property: "Date",
          direction: "ascending",
        },
      ],
    })
    .catch((err) => {
      throw err;
    });
  return response;
};
