import { notion } from "../constants";
import { CloneState } from "../interfaces/cloneState";

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
