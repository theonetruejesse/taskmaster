// get and format date range
// getRange(-1,1) => yesterday, tomorrow
// date may not be in sync, depending on time-zone
const formatDate = (d: Date) => d.toISOString().split("T")[0];

// relative value to date string
// ex: yesterday = -1, tomorrow = 1
// if today is 2000-01-02:
// -1 -> 2000-01-01, 1 -> 2000-01-03
export const valueToDate = (givenValue: number) => {
  const today = new Date();
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

// based on Notion db properties
export const repeatToDate = (type: string) => {
  switch (type) {
    case "Daily":
      return 1;
    case "EO-Day":
      return 2;
    case "Weekly":
      return 7;
    case "EO-Week":
      return 14;
    case "Monthly":
      return 30; // technically incorrect, todo -> create helper function
    default:
      return 0;
  }
};

export const getNextWeek = () => {
  const nextSunday = getNextSunday(new Date());

  const weekString = (value: number) =>
    valueToDate(dateToValue(nextSunday) + value);

  return {
    Sunday: nextSunday,
    Monday: weekString(1),
    Tuesday: weekString(2),
    Wednesday: weekString(3),
    Thursday: weekString(4),
    Friday: weekString(5),
    Saturday: weekString(6),
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
