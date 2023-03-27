import moment from "moment";

const schemaType = require("./schema-type");
const SATURDAY = 6;

const firstSaturdayOfYear = (year) => {
  const time = moment.utc(0);
  time.year(year);
  time.dayOfYear(1);

  while (time.day() < SATURDAY) {
    time.add(1, "day");
  }

  return time.dayOfYear();
};

const numberOfDaysInYear = (year) => (year % 4 === 0 ? 366 : 365);

exports.date = (
  fig:
    | string
    | {
        year: any;
        week: any;
      }
) => {
  let year;
  let week;

  if (typeof fig === "string") {
    const match = fig.match(/^([0-9]{4})-([0-9]{2})$/);
    if (match) {
      week = parseInt(match[2], 10);
      year = parseInt(match[1], 10);
    } else {
      const w = exports.week(new Date(fig));
      week = w.week;
      year = w.year;
    }
  } else {
    year = fig.year;
    week = fig.week;
  }
  if (!week || !year) {
    throw new Error(`could not extract date: ${fig}`);
  }

  const date = moment.utc(0);
  date.year(year);
  date.week(week);
  //moment US start on Sunday and end on Saturday
  //last seconds 23:59:59 in last week
  date.endOf("week");
  //set time back to 00:00:00 in last day
  date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  return date;
};
//this is not standard ISO. In the United States, Sunday is the first day of the week. The week with January 1st in it is the first week of the year.
//53 weeks when first day of year is Saturday
exports.week = (dateRaw: any) => {
  const date = moment.utc(dateRaw);
  return {
    year: date.weekYear(),
    week: date.week()
  };
};

exports.adjustDate = (date: any) => exports.date(exports.week(date));

exports.dateToString = (
  date: Date | string,
  opt: {
    isDateTimeWithMillis?: boolean;
  } = {}
) => moment(date).format(opt && opt.isDateTimeWithMillis ? "YYYY-MM-DD H:mm:ss.SSS" : "YYYY-MM-DD");

exports.toDate = (dateString?: string) => {
  return (dateString ? new Date(dateString) : new Date()).setHours(0, 0, 0, 0);
};

exports.toDateFromWeeks = (dateString: string) => exports.dateToString(exports.date(dateString));

exports.toWeeksFromDate = (date: any) => {
  const w = exports.week(new Date(date));
  const week = String(w.week).length === 1 ? `0${w.week}` : w.week;
  return `${w.year}-${week}`;
};

exports.weekDateString = (date: any) => exports.dateToString(exports.adjustDate(date));

exports.isPastDate = (date: any) => {
  const today = exports.toDate();
  const inputDate = exports.toDate(date);
  return inputDate < today;
};

const dayOfWeekIds = ["SU", "M", "TU", "W", "TH", "F", "SA"];

const isValidDate = (d: any): boolean => d instanceof Date && !isNaN(d.getTime());

exports.getUTCTimeAndWeekId = ({ time, dayOfWeekId, timeZone }: any) => {
  const dateNow = new Date();

  if (!timeZone) {
    timeZone = "UTC+0000";
  }

  const dateStringOfThisWeek = new Date(
    dateNow.setDate(dateNow.getDate() - dateNow.getDay() + dayOfWeekIds.indexOf(dayOfWeekId))
  ).toISOString();

  //this should return a date of the current week
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

//A is utc to local
//B is local to utc
const convertBetweenLocalAndUTC = ({ date, timeZone, type }: { date: any; timeZone: string; type: "A" | "B" }) => {
  const { offsetMinutes } = schemaType.parseTimezone(timeZone.replace(/[A-Z]/g, ""));
  const filp = type === "A" ? 1 : -1;
  const ms = new Date(date).getTime() + offsetMinutes * 60000 * filp;
  return new Date(ms);
};

exports.getLocalDateFromUTCDate = ({ date, timeZone }: { date: any; timeZone: string }) => {
  return convertBetweenLocalAndUTC({ date, timeZone, type: "A" });
};

exports.getUTCDateFromLocalDate = ({ date, timeZone }: { date: any; timeZone: string }) => {
  return convertBetweenLocalAndUTC({ date, timeZone, type: "B" });
};

exports.getUTCDayOfWeekIdFromAnyDateWithAnyTimeZone = (date: any): string => dayOfWeekIds[new Date(date).getUTCDay()];

exports.buildDateFromUTCTimeAndUTCDayOfWeekId = ({ time, dayOfWeekId }: { time: any; dayOfWeekId: string }) => {
  const dateNow = new Date();
  const dateStringOfThisWeek = new Date(
    dateNow.setDate(dateNow.getDate() - dateNow.getDay() + dayOfWeekIds.indexOf(dayOfWeekId))
  ).toISOString();
  return `${dateStringOfThisWeek.split("T")[0]} ${time}`;
};

exports.firstDateOfWeek = (week: any) =>
  new Date(exports.dateToString(exports.date(week).subtract(6, "days"))).getTime();
exports.lastDateOfWeek = (week: any) => new Date(exports.toDateFromWeeks(week)).getTime();
