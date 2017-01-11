'use strict';

const moment = require('moment');

const SATURDAY = 6;
const SUNDAY = 0;

const firstSaturdayOfYear = year => {
    let time = moment.utc(0);
    time.year(year);
    time.dayOfYear(1);

    while(time.day() < SATURDAY) {
        time.add(1, 'day');
    }

    return time.dayOfYear();
};

const firstSundayOfYear = year => {
    let time = moment.utc(0);
    time.year(year);
    time.dayOfYear(1);

    while(time.day() !== SUNDAY) {
        time.add(1, 'day');
    }

    return time.dayOfYear();
};

const numberOfDaysInYear = year => year % 4 === 0 ? 366 : 365;

const daysLeftInYear = date => {
    return numberOfDaysInYear(date.year()) - date.dayOfYear();
};

exports.date = fig => {
    const year = fig.year;
    const week = fig.week;
    let dayOfYear = (week - 1) * 7 + firstSaturdayOfYear(year);

    if(firstSaturdayOfYear(year) < 7) {
        dayOfYear += 7;
    }

    let date = moment.utc(0);
    date.year(year);
    date.dayOfYear(dayOfYear);
    return date;
};

exports.week = date => {
    let year = date.year();
    let week;

    let dayOfYear = date.dayOfYear();

    if(firstSaturdayOfYear(year) < 7) {
        dayOfYear -= 7;
        if(dayOfYear < 1) {
            year -= 1;
            dayOfYear = numberOfDaysInYear(year) + dayOfYear;
        }
        week = Math.floor((Math.abs(dayOfYear - firstSaturdayOfYear(year)) / 7) + 1);
    }
    else {
        week = Math.floor((dayOfYear - 1) / 7) + 1;
    }



    // console.log(dayOfYear, firstSaturdayOfYear(year), year)

    // week = Math.floor(dayOfYear / 7) + 1;

    // if(firstSaturdayOfYear(year) === 7) {
    //     week = Math.floor(dayOfYear / 7) + 1;
    // }
    // else {

    // }



    // week = Math.max(dayOfYear - firstSaturdayOfYear(year), 1) / 7


    return { year: year, week: week };
};

// exports.week = date => {
//     let year;
//     let week;

//     if()
// };

// exports.week = date => {
//     let year;
//     let week;

//     console.log(
//         daysLeftInYear(date),
//         firstSundayOfYear(date.year()),
//         firstSaturdayOfYear(date.year()),
//         firstSaturdayOfYear(date.year() + 1),
//         date.dayOfYear()
//     );


//     if(daysLeftInYear(date) + firstSaturdayOfYear(date.year() + 1) < 7) {
//         year = date.year() + 1;
//         week = 1;
//     }
//     else {
//         year = date.year();
//         week = Math.floor(
//            ((7 - firstSundayOfYear(date.year())) + date.dayOfYear()) / 7
//         ) + 1;
//     }

//     return { week: week, year: year };
// };

// exports.date = fig => {
//     const year = fig.year;
//     const dayOfYear = (fig.week - 1) * 7 + firstSaturdayOfYear(fig.year);
//     let date = moment.utc(0);
//     date.year(year);
//     date.dayOfYear(dayOfYear);
//     return date;
// };

// exports.week = date => {
//     let year;
//     let week;

//     if(numberOfDaysInYear(date.year()) - date.dayOfYear() + firstSaturdayOfYear(date.year() + 1) <= 7) {
//         year = date.year() + 1;
//         week = 1;
//     }
//     else {
//         year = date.year();
//         week = Math.floor((date.dayOfYear() - firstSaturdayOfYear(date.year())) / 7) + 1;
//     }

//     return { week: week, year: year };
// };
