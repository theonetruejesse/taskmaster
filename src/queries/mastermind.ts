import { notion } from "../constants";

export interface MastermindState {
  Active: boolean;
  Streak: number;
  State: number;
  PageId: string;
  GenesisId: string | null;
}

export const getMMPage = async (pageId: string) => {
  const response = await notion.pages
    .retrieve({ page_id: pageId })
    .catch((err) => {
      throw err;
    });
  return response;
};
