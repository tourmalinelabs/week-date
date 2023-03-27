"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const schemaType = require("./schema-type");
const SATURDAY = 6;
const firstSaturdayOfYear = (year) => {
    const time = moment_1.default.utc(0);
    time.year(year);
    time.dayOfYear(1);
    while (time.day() < SATURDAY) {
        time.add(1, "day");
    }
    return time.dayOfYear();
};
const numberOfDaysInYear = (year) => (year % 4 === 0 ? 366 : 365);
exports.date = (fig) => {
    let year;
    let week;
    if (typeof fig === "string") {
        const match = fig.match(/^([0-9]{4})-([0-9]{2})$/);
        if (match) {
            week = parseInt(match[2], 10);
            year = parseInt(match[1], 10);
        }
        else {
            const w = exports.week(new Date(fig));
            week = w.week;
            year = w.year;
        }
    }
    else {
        year = fig.year;
        week = fig.week;
    }
    if (!week || !year) {
        throw new Error(`could not extract date: ${fig}`);
    }
    const date = moment_1.default.utc(0);
    date.year(year);
    date.week(week);
    date.endOf("week");
    date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    return date;
};
exports.week = (dateRaw) => {
    const date = moment_1.default.utc(dateRaw);
    return {
        year: date.weekYear(),
        week: date.week()
    };
};
exports.adjustDate = (date) => exports.date(exports.week(date));
exports.dateToString = (date, opt = {}) => moment_1.default(date).format(opt && opt.isDateTimeWithMillis ? "YYYY-MM-DD H:mm:ss.SSS" : "YYYY-MM-DD");
exports.toDate = (dateString) => {
    return (dateString ? new Date(dateString) : new Date()).setHours(0, 0, 0, 0);
};
exports.toDateFromWeeks = (dateString) => exports.dateToString(exports.date(dateString));
exports.toWeeksFromDate = (date) => {
    const w = exports.week(new Date(date));
    const week = String(w.week).length === 1 ? `0${w.week}` : w.week;
    return `${w.year}-${week}`;
};
exports.weekDateString = (date) => exports.dateToString(exports.adjustDate(date));
exports.isPastDate = (date) => {
    const today = exports.toDate();
    const inputDate = exports.toDate(date);
    return inputDate < today;
};
const dayOfWeekIds = ["SU", "M", "TU", "W", "TH", "F", "SA"];
const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());
exports.getUTCTimeAndWeekId = ({ time, dayOfWeekId, timeZone }) => {
    const dateNow = new Date();
    if (!timeZone) {
        timeZone = "UTC+0000";
    }
    const dateStringOfThisWeek = new Date(dateNow.setDate(dateNow.getDate() - dateNow.getDay() + dayOfWeekIds.indexOf(dayOfWeekId))).toISOString();
    if (timeZone === "CET") {
        timeZone = "UTC+0200";
    }
    const fakeTime = `${dateStringOfThisWeek.split("T")[0]} ${time} ${timeZone}`;
    const utcTime = new Date(fakeTime);
    return {
        utcTime: isValidDate(utcTime) ? utcTime.toTimeString().split(" ")[0] : null,
        utcDayOfWeekId: dayOfWeekIds[utcTime.getDay()]
    };
};
const convertBetweenLocalAndUTC = ({ date, timeZone, type }) => {
    const { offsetMinutes } = schemaType.parseTimezone(timeZone.replace(/[A-Z]/g, ""));
    const filp = type === "A" ? 1 : -1;
    const ms = new Date(date).getTime() + offsetMinutes * 60000 * filp;
    return new Date(ms);
};
exports.getLocalDateFromUTCDate = ({ date, timeZone }) => {
    return convertBetweenLocalAndUTC({ date, timeZone, type: "A" });
};
exports.getUTCDateFromLocalDate = ({ date, timeZone }) => {
    return convertBetweenLocalAndUTC({ date, timeZone, type: "B" });
};
exports.getUTCDayOfWeekIdFromAnyDateWithAnyTimeZone = (date) => dayOfWeekIds[new Date(date).getUTCDay()];
exports.buildDateFromUTCTimeAndUTCDayOfWeekId = ({ time, dayOfWeekId }) => {
    const dateNow = new Date();
    const dateStringOfThisWeek = new Date(dateNow.setDate(dateNow.getDate() - dateNow.getDay() + dayOfWeekIds.indexOf(dayOfWeekId))).toISOString();
    return `${dateStringOfThisWeek.split("T")[0]} ${time}`;
};
exports.firstDateOfWeek = (week) => new Date(exports.dateToString(exports.date(week).subtract(6, 'days'))).getTime();
exports.lastDateOfWeek = (week) => new Date(exports.toDateFromWeeks(week)).getTime();
//# sourceMappingURL=index.js.map