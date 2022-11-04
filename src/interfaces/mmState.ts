import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Roi, getRoiValue } from "../properties/Roi";
import { Status } from "../properties/Status";
import { Type } from "../properties/Type";
import { DateRange, getDateRange } from "../utils/dates";

export interface MastermindState {
  Name: string;
  Date: DateRange;
  Status: Status;
  Data: {
    Type: Type;
    Roi: Roi;
    Tags: string[];
  } | null;
  Time: {
    Hours: number;
    Minutes: number;
  } | null;
  Generated: boolean;
  OtherProps: any; // double dips data, but really convenient
}

export const getMasterMindState = (
  page: PageObjectResponse
): MastermindState => {
  const props = page.properties;

  let name: string | undefined = undefined;
  if (props.Name.type == "title") {
    name = props.Name.title[0].plain_text;
  }
  if (!name) throw "title name issue";

  if (props.Date.type != "date" || !props.Date.date) throw "no date given";

  let status: string | undefined = undefined;
  if (props.End.type == "status") {
    status = props.End.status?.name;
  }
  if (!status) throw "no status selected";

  // DATA

  let type: string | undefined = undefined;
  if (props.Type.type == "select") {
    type = props.Type.select?.name;
  }

  let roi: string | undefined = undefined;
  if (props.ROI.type == "select") {
    roi = props.ROI.select?.name;
  }

  let tags: string[] = [];
  if (props.Tags.type == "multi_select") {
    tags = props.Tags.multi_select.map((t) => t.name);
  }

  // TIME

  let hours = -1;
  if (props.Hours.type == "number") {
    hours = props.Hours.number ? props.Hours.number : 0;
  }
  let minutes = -1;
  if (props.Minutes.type == "number") {
    minutes = props.Minutes.number ? props.Minutes.number : 0;
  }

  //

  const isGenerated =
    props.Generated.type == "checkbox" && props.Generated.checkbox;

  return {
    Name: name,
    Date: getDateRange(props.Date.date.start, props.Date.date.end),
    Status: status as Status,
    Data:
      type && roi && tags.length
        ? {
            Type: type as Type,
            Roi: getRoiValue(roi) as Roi,
            Tags: tags,
          }
        : null,
    Time:
      minutes != -1 && hours != -1
        ? {
            Hours: hours,
            Minutes: minutes,
          }
        : null,
    Generated: isGenerated,
    OtherProps: props,
  };
};
