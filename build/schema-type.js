"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const moment = require('moment');
const createSchema = (fig, initial) => {
    const { allowNull, required } = fig || {};
    let schema = [].concat(initial);
    if (allowNull) {
        schema = ['allowNull'].concat(schema);
    }
    if (required) {
        schema = ['required'].concat(schema);
    }
    return schema;
};
exports.aggregationIntervalFields = () => [
    'day',
    'dayOfWeek',
    'hour',
    'hourOfDay',
    'minuteOfDay',
    'month',
    'monthOfYear',
    'week',
    'weekOfYear',
    'year',
];
exports.aggregationInterval = (fig) => createSchema(fig, ['type:string', `enumerated:${exports.aggregationIntervalFields().join(',')}`]);
exports.aggregationIntervalFormatBin = (interval) => {
    switch (interval) {
        case 'day':
            return '%Y-%m-%d';
        case 'dayOfWeek':
            return '%w';
        case 'hour':
            return '%Y-%m-%d %H';
        case 'hourOfDay':
            return '%H';
        case 'minuteOfDay':
            return '%H-%i';
        case 'month':
            return '%Y-%m';
        case 'monthOfYear':
            return '%m';
        case 'week':
            return '%Y-%U';
        case 'weekOfYear':
            return '%U';
        case 'year':
            return '%Y';
        default:
            throw new Error(`Invalid interval format: ${interval}`);
    }
};
exports.aggregationIntervalBinToDate = (interval, dateString) => {
    switch (interval) {
        case 'day':
            return moment.utc(dateString).toDate();
        case 'dayOfWeek':
            return null;
        case 'hour':
            return moment.utc(`${dateString}:00:00`).toDate();
        case 'hourOfDay':
            return null;
        case 'minuteOfDay':
            return null;
        case 'month':
            return moment.utc(dateString).toDate();
        case 'monthOfYear':
            return null;
        case 'week':
            const d = moment.utc(0);
            d.year(Number(dateString.replace(/-[0-9]{2}$/, '')));
            d.week(Number(dateString.replace(/^[0-9]{4}-/, '')));
            return d.toDate();
        case 'weekOfYear':
            return null;
        case 'year':
            return moment.utc(`${dateString}-01-01`).toDate();
        default:
            throw new Error(`Invalid interval format: ${interval}`);
    }
};
exports.timeZone = (fig) => createSchema(fig, [
    'type:string',
    'regex:/^[\\+\\(\\)A-Z0-9-]{3,7}\\s?\\(?(\\+|-)[0-9]{3,4}\\)?[\\+\\(\\)A-Z0-9-]{0,7}$/',
]);
exports.parseTimezone = (tzString) => {
    const offsetStringMatch = _.first(/((\+|-)[0-9]{3,4})\)?/.exec(tzString));
    const offsetString = (offsetStringMatch && offsetStringMatch.replace(/\)/, '')) || '';
    let offsetMinutes;
    const isMychaelNaN = a => !(a === a);
    const matches = /((?:\+|-)([0-9]+))/.exec(offsetString);
    if (matches && matches.length) {
        const m = parseInt(_.first(matches).slice(0, -2)) * 60 +
            (_.first(matches).charAt(0) === '-' ? -1 : 1) * parseInt(_.first(matches).slice(-2));
        offsetMinutes = isMychaelNaN(m) ? 0 : m;
    }
    else {
        offsetMinutes = 0;
    }
    return {
        offsetString,
        offsetMinutes,
    };
};
exports.week = (fig) => createSchema(fig, ['type:string', 'regex:/^([0-9]{4}-[0-9]{2}|LATEST)$/']);
exports.weekOrLatest = (fig) => createSchema(fig, ['type:string', 'regex:/^([0-9]{4}-[0-9]{2}|LATEST|LATESTNONZERO)$/']);
exports.color = (fig) => createSchema(fig, ['type:string', 'regex:/^#[0-9a-f]{6}$/']);
exports.lat = (fig) => createSchema(fig, ['type:number', '>=:-90', '<=:90']);
exports.lng = (fig) => createSchema(fig, ['type:number', '>=:-180', '<=:180']);
exports.id = (fig) => createSchema(fig, ['type:number', 'integer', '>:0']);
exports.timestamp = (fig) => createSchema(fig, ['type:number', 'integer', '>=:1000']);
//# sourceMappingURL=schema-type.js.map