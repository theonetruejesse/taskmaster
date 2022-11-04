import { enumContains } from "../utils/enum";

export enum Roi {
  Low = 1,
  Okay,
  Good,
  Great,
  Crucial,
  Mandatory,
}
// lazy man's functions
// would've been wayy better if I used a type instead of enum

export const getRoiValue = (roiName: string) => {
  switch (roiName) {
    case "Low":
      return Roi.Low;
    case "Okay":
      return Roi.Okay;
    case "Great":
      return Roi.Great;
    case "Crucial":
      return Roi.Crucial;
    case "Mandatory":
      return Roi.Mandatory;
    default:
      throw "Invalid roi value";
  }
};

export const getRoiName = (roiValue: number) => {
  switch (roiValue) {
    case 1:
      return "Low";
    case 2:
      return "Okay";
    case 3:
      return "Great";
    case 4:
      return "Crucial";
    case 5:
      return "Mandatory";
    default:
      throw "Invalid roi value";
  }
};

export const getRoiProp = (value: number) => ({
  select: {
    name: getRoiName(value),
  },
});
