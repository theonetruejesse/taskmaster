import { isNotionClientError, ClientErrorCode } from "@notionhq/client";

const { Client, APIErrorCode } = require("@notionhq/client");

export const notionErrorWrapper = async (notionRequest: any) => {
  try {
    await notionRequest();
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          return "ClientErrorCode.RequestTimeout";
        case APIErrorCode.ObjectNotFound:
          return "APIErrorCode.ObjectNotFound";
        case APIErrorCode.Unauthorized:
          return "APIErrorCode.Unauthorized";
        default:
          return;
      }
    }
  }
};
