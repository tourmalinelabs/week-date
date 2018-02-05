'use strict';

const moment = require('moment');

const SATURDAY = 6;

const firstSaturdayOfYear = year => {
    let time = moment.utc(0);
    time.year(year);
    time.dayOfYear(1);

    while(time.day() < SATURDAY) {
        time.add(1, 'day');
    }

    return time.dayOfYear();
};

const numberOfDaysInYear = year => year % 4 === 0 ? 366 : 365;

exports.date = fig => {
    let year;
    let week;
    if(typeof fig === 'string') {
        const match = fig.match(/^([0-9]{4})-([0-9]{2})$/);
        week = parseInt(match[2], 10);
        year = parseInt(match[1], 10);
    }
    else {
        year = fig.year;
        week = fig.week;
    }

    let dayOfYearAdjusted = ((week - 1) * 7 + firstSaturdayOfYear(year));
    if(firstSaturdayOfYear(year) <= 7) {
        dayOfYearAdjusted += 7;
    }

    let date = moment.utc(0);
    date.year(year);
    date.dayOfYear(dayOfYearAdjusted);
    return date;
};

exports.week = dateRaw => {
    const date = moment.utc(dateRaw);

    const yearAdjusted = date.dayOfYear() <= firstSaturdayOfYear(date.year()) ?
        date.year() - 1 : date.year();

    const dayOfYearAdjusted = (yearAdjusted < date.year() ?
        numberOfDaysInYear(yearAdjusted) + date.dayOfYear() : date.dayOfYear()
    ) - firstSaturdayOfYear(yearAdjusted);

    let week = Math.ceil(dayOfYearAdjusted / 7);

    return { year: yearAdjusted, week: week };
};

exports.adjustDate = date => exports.date(exports.week(date));
