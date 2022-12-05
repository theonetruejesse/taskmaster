import { getEnumKeyByValue } from "./enum";

export interface DateRange {
  Start: string | null;
  End: string | null;
}

export enum DayNames {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export const dateRangeToKeyString = (dr: DateRange) => {
  if (!dr.End) throw "date range has no ending";
  return `${dr.Start},${dr.End!}`;
};

// get and format date range
// getRange(-1,1) => yesterday, tomorrow
// date may not be in sync, depending on time-zone
const formatDate = (d: Date) => d.toISOString().split("T")[0];

// relative value to date string
// ex: yesterday = -1, tomorrow = 1
// if today is 2000-01-02:
// -1 -> 2000-01-01, 1 -> 2000-01-03
export const valueToDate = (givenValue: number) => {
  const today = new Date(); // todo -> add helper to set timezone to local
  const getDate = new Date(today.getTime());
  getDate.setDate(today.getDate() + givenValue);
  return formatDate(getDate);
};

// reverse of valueToDate()
export const dateToValue = (givenDate: string) => {
  const today = new Date();
  const given = new Date(givenDate);
  return Math.ceil((given.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const getNextWeek = () => {
  const nextSunday = getNextSunday(new Date());

  const weekString = (value: number) =>
    valueToDate(dateToValue(nextSunday) + value);

  return {
    // todo -> refractor to use DayNames enum instead
    Sunday: nextSunday,
    Monday: weekString(1),
    Tuesday: weekString(2),
    Wednesday: weekString(3),
    Thursday: weekString(4),
    Friday: weekString(5),
    Saturday: weekString(6),
  };
};

export const getNewDays = (weekDays: any, dayNames: DateRange): DateRange => {
  if (!dayNames.Start) throw "no start given";
  const start = weekDays[dayNames.Start];
  if (!start) throw "Starting date issue";

  let end = dayNames.End ? weekDays[dayNames.End] : null;
  if (end && start > end) end = getDayWeekLater(end);

  return {
    Start: start,
    End: end,
  };
};

const getNextSunday = (date = new Date()) => {
  const dateCopy = new Date(date.getTime());

  const nextMonday = new Date(
    dateCopy.setDate(dateCopy.getDate() + ((7 - dateCopy.getDay()) % 7 || 7))
  );

  return formatDate(nextMonday);
};

export const getDayWeekLater = (day: string) =>
  valueToDate(dateToValue(day) + 7);

export const getDateRange = (start: string, end: string | null): DateRange => ({
  Start: start,
  End: end,
});

export const createDateList = (dateRange: DateRange): string[] => {
  if (!dateRange.Start) throw "no start given";
  if (!dateRange.End) return [dateRange.Start];
  const dateList = [];
  let datePointer = dateRange.Start;
  if (dateRange.Start > dateRange.End) throw "start/end date error";
  while (datePointer < dateRange.End) {
    dateList.push(datePointer);
    const dateValue = dateToValue(datePointer);
    datePointer = valueToDate(dateValue + 1);
  }
  dateList.push(dateRange.End);
  return dateList;
};

export const getDayOfWeek = (day: string) => {
  const dt = new Date(day);
  return getEnumKeyByValue(DayNames, dt.getDay());
};

// ex: 11/1/22 -> Tuesday
// dt.getDay() = 2
// startShift = -2, endShift = 4
// get date string based on shift
export const getThatWeek = (day: string): DateRange => {
  const dt = new Date(day);
  const weekdayValue = dt.getDay();
  const startShift = DayNames.Sunday - weekdayValue;
  const endShift = DayNames.Saturday - weekdayValue;

  const relativeDayValue = dateToValue(day);
  return {
    Start: valueToDate(relativeDayValue + startShift),
    End: valueToDate(relativeDayValue + endShift),
  };
};
