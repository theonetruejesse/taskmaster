import { DateRange } from "../utils/dates";

export const getDateProp = (dr: DateRange) => ({
  date: dr.End
    ? {
        start: dr.Start,
        end: dr.End,
      }
    : {
        start: dr.Start,
      },
});
