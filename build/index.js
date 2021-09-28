"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const SATURDAY = 6;
var firstSaturdayOfYear = function firstSaturdayOfYear(year) {
    var time = moment.utc(0);
    time.year(year);
    time.dayOfYear(1);
    while (time.day() < SATURDAY) {
        time.add(1, "day");
    }
    return time.dayOfYear();
};
var numberOfDaysInYear = function numberOfDaysInYear(year) {
    return year % 4 === 0 ? 366 : 365;
};
const weekDate = {
    date: (fig) => {
        var year = void 0;
        var week = void 0;
        if (typeof fig === "string") {
            var match = fig.match(/^([0-9]{4})-([0-9]{2})$/);
            week = parseInt(match[2], 10);
            year = parseInt(match[1], 10);
        }
        else {
            year = fig.year;
            week = fig.week;
        }
        var dayOfYearAdjusted = (week - 1) * 7 + firstSaturdayOfYear(year);
        if (firstSaturdayOfYear(year) <= 7) {
            dayOfYearAdjusted += 7;
        }
        var date = moment.utc(0);
        date.year(year);
        date.dayOfYear(dayOfYearAdjusted);
        return date;
    },
    week: (dateRaw) => {
        var date = moment.utc(dateRaw);
        var yearAdjusted = date.dayOfYear() <= firstSaturdayOfYear(date.year()) ? date.year() - 1 : date.year();
        var dayOfYearAdjusted = (yearAdjusted < date.year() ? numberOfDaysInYear(yearAdjusted) + date.dayOfYear() : date.dayOfYear()) -
            firstSaturdayOfYear(yearAdjusted);
        var week = Math.ceil(dayOfYearAdjusted / 7);
        return {
            year: yearAdjusted,
            week: week
        };
    },
    adjustDate: (date) => {
        return weekDate.date(weekDate.week(date));
    }
};
module.exports = weekDate;
exports.default = weekDate;
//# sourceMappingURL=index.js.map