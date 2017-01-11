'use strict';

const _ = require('lodash');
const moment = require('moment');
const expect = require('chai').expect;
const weekDate = require('./index.js');

describe('week-date', () => {
    it('should handle date conversion', () => {
        expect(weekDate.date({
            year: 2015,
            week: 1
        }).format('YYYY-MM-DD'))
        .to.equal('2015-01-10');

        expect(weekDate.date({
            year: 2015,
            week: 2
        }).format('YYYY-MM-DD'))
        .to.equal('2015-01-17');

        expect(weekDate.date({
            year: 2015,
            week: 51
        }).format('YYYY-MM-DD'))
        .to.equal('2015-12-26');

        expect(weekDate.date({
            year: 2015,
            week: 52
        }).format('YYYY-MM-DD'))
        .to.equal('2016-01-02');
    });

    it('should handle week conversion', () => {
        expect(weekDate.week(moment.utc('2015-01-10')))
        .to.deep.equal({ year: 2015, week: 1 });

        expect(weekDate.week(moment.utc('2015-01-17')))
        .to.deep.equal({ year: 2015, week: 2 });

        expect(weekDate.week(moment.utc('2015-12-26')))
        .to.deep.equal({ year: 2015, week: 51 });

        expect(weekDate.week(moment.utc('2016-01-02')))
        .to.deep.equal({ year: 2015, week: 52 });
    });


    // it('should handle week rollover 2015 - 2016', () => {
    //     expect(weekDate.date({
    //         year: 2015,
    //         week: 51
    //     }).format('YYYY-MM-DD'))
    //     .to.equal('2015-12-19');

    //     expect(weekDate.date({
    //         year: 2015,
    //         week: 52
    //     }).format('YYYY-MM-DD'))
    //     .to.equal('2015-12-26');

    //     expect(weekDate.date({
    //         year: 2016,
    //         week: 1
    //     }).format('YYYY-MM-DD'))
    //     .to.equal('2016-01-02');

    //     expect(weekDate.week(moment.utc('2015-12-19')))
    //     .to.deep.equal({ year: 2015, week: 51 });

    //     expect(weekDate.week(moment.utc('2015-12-20')))
    //     .to.deep.equal({ year: 2015, week: 52 });

    //     expect(weekDate.week(moment.utc('2015-12-25')))
    //     .to.deep.equal({ year: 2015, week: 52 });

    //     expect(weekDate.week(moment.utc('2015-12-26')))
    //     .to.deep.equal({ year: 2015, week: 52 });

    //     expect(weekDate.week(moment.utc('2015-12-27')))
    //     .to.deep.equal({ year: 2016, week: 1 });

    //     expect(weekDate.week(moment.utc('2016-01-02')))
    //     .to.deep.equal({ year: 2016, week: 1 });

    //     expect(weekDate.week(moment.utc('2016-01-03')))
    //     .to.deep.equal({ year: 2016, week: 2 });

    //     expect(weekDate.week(moment.utc('2016-01-04')))
    //     .to.deep.equal({ year: 2016, week: 2 });
    // });

    it('should handle current week (when this test was written)', () => {
        expect(weekDate.date({
            year: 2017,
            week: 1
        }).format('YYYY-MM-DD'))
        .to.equal('2017-01-07');

        expect(weekDate.date({
            year: 2017,
            week: 2
        }).format('YYYY-MM-DD'))
        .to.equal('2017-01-14');

        expect(weekDate.week(moment.utc('2017-01-4')))
        .to.deep.equal({ year: 2017, week: 1 });

        expect(weekDate.week(moment.utc('2017-01-7')))
        .to.deep.equal({ year: 2017, week: 1 });

        expect(weekDate.week(moment.utc('2017-01-8')))
        .to.deep.equal({ year: 2017, week: 2 });

        expect(weekDate.week(moment.utc('2017-01-14')))
        .to.deep.equal({ year: 2017, week: 2 });

        expect(weekDate.week(moment.utc('2017-01-20')))
        .to.deep.equal({ year: 2017, week: 3 });

        expect(weekDate.week(moment.utc('2017-01-21')))
        .to.deep.equal({ year: 2017, week: 3 });
    });

    it('should handle upcoming year rollover (2017)', () => {
        expect(weekDate.date({
            year: 2017,
            week: 52
        }).format('YYYY-MM-DD'))
        .to.equal('2017-12-30');

        expect(weekDate.date({
            year: 2017,
            week: 53
        }).format('YYYY-MM-DD'))
        .to.equal('2018-01-06');

        expect(weekDate.week(moment.utc('2017-12-29')))
        .to.deep.equal({ year: 2017, week: 52 });

        expect(weekDate.week(moment.utc('2017-12-30')))
        .to.deep.equal({ year: 2017, week: 52 });

        expect(weekDate.week(moment.utc('2017-12-31')))
        .to.deep.equal({ year: 2017, week: 53 });

        expect(weekDate.week(moment.utc('2018-01-6')))
        .to.deep.equal({ year: 2017, week: 53 });

        expect(weekDate.week(moment.utc('2018-01-7')))
        .to.deep.equal({ year: 2018, week: 1 });

        // expect(weekDate.week(moment.utc('2017-12-30')))
        // .to.deep.equal({ year: 2017, week: 52 });

        // expect(weekDate.week(moment.utc('2017-12-31')))
        // .to.deep.equal({ year: 2018, week: 1 });
    });

    // it('should handle 2016', () => {
    //     expect(weekDate.date({
    //         year: 2016,
    //         week: 53
    //     }).format('YYYY-MM-DD'))
    //     .to.equal('2016-12-31');

    //     expect(weekDate.date({
    //         year: 2016,
    //         week: 53
    //     }).format('YYYY-MM-DD'))
    //     .to.equal('2016-12-31');

    //     expect(weekDate.date({
    //         year: 2017,
    //         week: 1
    //     }).format('YYYY-MM-DD'))
    //     .to.equal('2017-01-07');
    // });

    // it('should handle last week of 2017', () => {
    //     expect(weekDate.date({
    //         year: 2017,
    //         week: 52
    //     }).format('YYYY-MM-DD'))
    //     .to.equal('2017-12-30');
    // });

    // it('should handle week rollover of 2017', () => {
    //     expect(weekDate.date({
    //         year: 2017,
    //         week: 53
    //     }).format('YYYY-MM-DD'))
    //     .to.equal('2018-01-06');

    //     expect(weekDate.date({
    //         year: 2018,
    //         week: 1
    //     }).format('YYYY-MM-DD'))
    //     .to.equal('2018-01-06');
    // });

    it('should consistently generate each week ending on saturday over time and convert back and forth', () => {
        _.each(_.range(2000, 2100), year => {
            _.each(_.range(1, 52), week => {
                const d = weekDate.date({ year: year, week: week });

                expect(d.year()).to.equal(year);
                expect(d.week()).to.equal(week);
                expect(d.day()).to.equal(6);

                expect(weekDate.week(d))
                .to.deep.equal({ year: year, week: week });
            });
        });
    });
});
