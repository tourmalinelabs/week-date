export {};

const _ = require('lodash');

const moment = require('moment');

export type SchemaTypeSchema = Array<string>;
type SchemaTypeOptions = {
    allowNull?: boolean;
    required?: boolean;
};

const createSchema = (fig: SchemaTypeOptions | null | undefined, initial: SchemaTypeSchema): SchemaTypeSchema => {
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

type AggregationIntervalFields =
    | 'day'
    | 'dayOfWeek'
    | 'hour'
    | 'hourOfDay'
    | 'minuteOfDay'
    | 'month'
    | 'monthOfYear'
    | 'week'
    | 'weekOfYear'
    | 'year';

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

exports.aggregationInterval = (fig: SchemaTypeOptions | null | undefined): SchemaTypeSchema =>
    createSchema(fig, ['type:string', `enumerated:${exports.aggregationIntervalFields().join(',')}`]);

exports.aggregationIntervalFormatBin = (interval: AggregationIntervalFields) => {
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

exports.aggregationIntervalBinToDate = (interval: AggregationIntervalFields, dateString: string) => {
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

exports.timeZone = (fig: SchemaTypeOptions | null | undefined): SchemaTypeSchema =>
    createSchema(fig, [
        'type:string',
        'regex:/^[\\+\\(\\)A-Z0-9-]{3,7}\\s?\\(?(\\+|-)[0-9]{3,4}\\)?[\\+\\(\\)A-Z0-9-]{0,7}$/',
    ]);

exports.parseTimezone = (
    tzString: string,
): {
    offsetString: string;
    offsetMinutes: number;
} => {
    const offsetStringMatch = _.first(/((\+|-)[0-9]{3,4})\)?/.exec(tzString));

    const offsetString = (offsetStringMatch && offsetStringMatch.replace(/\)/, '')) || '';
    let offsetMinutes;

    const isMychaelNaN = a => !(a === a);

    const matches = /((?:\+|-)([0-9]+))/.exec(offsetString);

    if (matches && matches.length) {
        const m =
            parseInt(_.first(matches).slice(0, -2)) * 60 +
            (_.first(matches).charAt(0) === '-' ? -1 : 1) * parseInt(_.first(matches).slice(-2));
        offsetMinutes = isMychaelNaN(m) ? 0 : m;
    } else {
        offsetMinutes = 0;
    }

    return {
        offsetString,
        offsetMinutes,
    };
};

exports.week = (fig: SchemaTypeOptions | null | undefined): SchemaTypeSchema =>
    createSchema(fig, ['type:string', 'regex:/^([0-9]{4}-[0-9]{2}|LATEST)$/']);

exports.weekOrLatest = (fig: SchemaTypeOptions | null | undefined): SchemaTypeSchema =>
    createSchema(fig, ['type:string', 'regex:/^([0-9]{4}-[0-9]{2}|LATEST|LATESTNONZERO)$/']);

exports.color = (fig: SchemaTypeOptions | null | undefined): SchemaTypeSchema =>
    createSchema(fig, ['type:string', 'regex:/^#[0-9a-f]{6}$/']);

exports.lat = (fig: SchemaTypeOptions | null | undefined): SchemaTypeSchema =>
    createSchema(fig, ['type:number', '>=:-90', '<=:90']);

exports.lng = (fig: SchemaTypeOptions | null | undefined): SchemaTypeSchema =>
    createSchema(fig, ['type:number', '>=:-180', '<=:180']);

exports.id = (fig: SchemaTypeOptions | null | undefined): SchemaTypeSchema =>
    createSchema(fig, ['type:number', 'integer', '>:0']);

exports.timestamp = (fig: SchemaTypeOptions | null | undefined): SchemaTypeSchema =>
    createSchema(fig, ['type:number', 'integer', '>=:1000']);
