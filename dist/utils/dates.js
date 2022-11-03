"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDayWeekLater = exports.getNewDays = exports.getNextWeek = exports.dateToValue = exports.valueToDate = void 0;
// get and format date range
// getRange(-1,1) => yesterday, tomorrow
// date may not be in sync, depending on time-zone
const formatDate = (d) => d.toISOString().split("T")[0];
// relative value to date string
// ex: yesterday = -1, tomorrow = 1
// if today is 2000-01-02:
// -1 -> 2000-01-01, 1 -> 2000-01-03
const valueToDate = (givenValue) => {
    const today = new Date();
    const getDate = new Date(today.getTime());
    getDate.setDate(today.getDate() + givenValue);
    return formatDate(getDate);
};
exports.valueToDate = valueToDate;
// reverse of valueToDate()
const dateToValue = (givenDate) => {
    const today = new Date();
    const given = new Date(givenDate);
    return Math.ceil((given.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};
exports.dateToValue = dateToValue;
const getNextWeek = () => {
    const nextSunday = getNextSunday(new Date());
    const weekString = (value) => (0, exports.valueToDate)((0, exports.dateToValue)(nextSunday) + value);
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
exports.getNextWeek = getNextWeek;
const getNewDays = (weekDays, dayNames) => {
    const start = weekDays[dayNames.Start];
    if (!start)
        throw "Starting date issue";
    let end = dayNames.End ? weekDays[dayNames.End] : null;
    if (end && start > end)
        end = (0, exports.getDayWeekLater)(end);
    return {
        Start: start,
        End: end,
    };
};
exports.getNewDays = getNewDays;
const getNextSunday = (date = new Date()) => {
    const dateCopy = new Date(date.getTime());
    const nextMonday = new Date(dateCopy.setDate(dateCopy.getDate() + ((7 - dateCopy.getDay()) % 7 || 7)));
    return formatDate(nextMonday);
};
const getDayWeekLater = (day) => (0, exports.valueToDate)((0, exports.dateToValue)(day) + 7);
exports.getDayWeekLater = getDayWeekLater;
