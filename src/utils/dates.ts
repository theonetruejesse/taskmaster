export interface DateRange {
  Start: string;
  End: string | null;
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
    Sunday: nextSunday,
    DayNames: weekString(1),
    Tuesday: weekString(2),
    Wednesday: weekString(3),
    Thursday: weekString(4),
    Friday: weekString(5),
    Saturday: weekString(6),
  };
};

export const getNewDays = (weekDays: any, dayNames: DateRange): DateRange => {
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
