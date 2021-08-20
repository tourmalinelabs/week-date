"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const moment = require('moment');
const expect = require('chai').expect;
const weekDate = require('./index.js');
describe('week-date', () => {
    describe('date', () => {
        it('should convert first week as ending on next saturday after first saturday of the year', () => {
            expect(weekDate
                .date({
                year: 2016,
                week: 1,
            })
                .format('YYYY-MM-DD')).to.equal('2016-01-09');
        });
        it('should convert second week the next saturday', () => {
            expect(weekDate
                .date({
                year: 2016,
                week: 2,
            })
                .format('YYYY-MM-DD')).to.equal('2016-01-16');
        });
        it('should cover the overlap into next year', () => {
            expect(weekDate
                .date({
                year: 2016,
                week: 53,
            })
                .format('YYYY-MM-DD')).to.equal('2017-01-07');
        });
        it('should cover partial overlap into next year', () => {
            expect(weekDate
                .date({
                year: 2015,
                week: 52,
            })
                .format('YYYY-MM-DD')).to.equal('2016-01-02');
        });
        it('should handle first week of 2006', () => {
            expect(weekDate
                .date({
                year: 2006,
                week: 1,
            })
                .format('YYYY-MM-DD')).to.equal('2006-01-14');
        });
        it('should handle second to last week of 2005', () => {
            expect(weekDate
                .date({
                year: 2005,
                week: 53,
            })
                .format('YYYY-MM-DD')).to.equal('2006-01-07');
        });
        it('should allow for year-week string', () => {
            expect(weekDate.date('2005-53').format('YYYY-MM-DD')).to.equal('2006-01-07');
        });
    });
    describe('week', () => {
        it('should convert first week as ending on next saturday after first saturday of the year', () => {
            expect(weekDate.week(moment.utc('2016-01-09'))).to.deep.equal({
                year: 2016,
                week: 1,
            });
        });
        it('should convert friday of first week of year', () => {
            expect(weekDate.week(moment.utc('2016-01-08'))).to.deep.equal({
                year: 2016,
                week: 1,
            });
        });
        it('should convert sunday of first week of year', () => {
            expect(weekDate.week(moment.utc('2016-01-03'))).to.deep.equal({
                year: 2016,
                week: 1,
            });
        });
        it('should convert second week the next saturday', () => {
            expect(weekDate.week(moment.utc('2016-01-16'))).to.deep.equal({
                year: 2016,
                week: 2,
            });
        });
        it('should convert friday of second week the next saturday', () => {
            expect(weekDate.week(moment.utc('2016-01-15'))).to.deep.equal({
                year: 2016,
                week: 2,
            });
        });
        it('should convert sunday of second week the next saturday', () => {
            expect(weekDate.week(moment.utc('2016-01-10'))).to.deep.equal({
                year: 2016,
                week: 2,
            });
        });
        it('should cover the overlap into next year', () => {
            expect(weekDate.week(moment.utc('2017-01-07'))).to.deep.equal({
                year: 2016,
                week: 53,
            });
        });
        it('should cover friday of the overlap into next year', () => {
            expect(weekDate.week(moment.utc('2017-01-06'))).to.deep.equal({
                year: 2016,
                week: 53,
            });
        });
        it('should cover sunday of the overlap into next year', () => {
            expect(weekDate.week(moment.utc('2017-01-01'))).to.deep.equal({
                year: 2016,
                week: 53,
            });
        });
        it('should cover partial overlap into next year', () => {
            expect(weekDate.week(moment.utc('2016-01-02'))).to.deep.equal({
                year: 2015,
                week: 52,
            });
        });
        it('should cover friday of the partial overlap into next year', () => {
            expect(weekDate.week(moment.utc('2016-01-01'))).to.deep.equal({
                year: 2015,
                week: 52,
            });
        });
        it('should cover sunday of the partial overlap into next year', () => {
            expect(weekDate.week(moment.utc('2015-12-27'))).to.deep.equal({
                year: 2015,
                week: 52,
            });
        });
        it('should handle first week of 2006', () => {
            expect(weekDate.week(moment.utc('2006-01-07'))).to.deep.equal({
                year: 2005,
                week: 53,
            });
        });
        it('should handle second to last week of 2005', () => {
            expect(weekDate.week(moment.utc('2005-12-31'))).to.deep.equal({
                year: 2005,
                week: 52,
            });
        });
        it('should cover overlap into 2018', () => {
            expect(weekDate.week(moment.utc('2018-01-06'))).to.deep.equal({
                year: 2017,
                week: 52,
            });
        });
        it('should cover friday of the overlap into 2018', () => {
            expect(weekDate.week(moment.utc('2018-01-05'))).to.deep.equal({
                year: 2017,
                week: 52,
            });
        });
        it('should cover sunday of the overlap into 2018', () => {
            expect(weekDate.week(moment.utc('2017-12-31'))).to.deep.equal({
                year: 2017,
                week: 52,
            });
        });
        it('should cover first week of 2018', () => {
            expect(weekDate.week(moment.utc('2018-01-13'))).to.deep.equal({
                year: 2018,
                week: 1,
            });
        });
        it('should cover friday of the first week of 2018', () => {
            expect(weekDate.week(moment.utc('2018-01-12'))).to.deep.equal({
                year: 2018,
                week: 1,
            });
        });
        it('should cover sunday of the first week of 2018', () => {
            expect(weekDate.week(moment.utc('2018-01-07'))).to.deep.equal({
                year: 2018,
                week: 1,
            });
        });
        it('should allow for regular date objects', () => {
            expect(weekDate.week(moment.utc('2018-01-07').toDate())).to.deep.equal({
                year: 2018,
                week: 1,
            });
        });
        it('should allow for milliseconds since epoch', () => {
            expect(weekDate.week(moment.utc('2018-01-07').unix() * 1000)).to.deep.equal({
                year: 2018,
                week: 1,
            });
        });
        it('should allow for date string', () => {
            expect(weekDate.week('2018-01-07')).to.deep.equal({
                year: 2018,
                week: 1,
            });
        });
    });
    describe('adjustDate', () => {
        it('should adjust date to that weeks saturday', () => {
            expect(weekDate.adjustDate(moment.utc('2018-01-07')).format('YYYY-MM-DD')).to.deep.equal('2018-01-13');
        });
    });
    describe('potpourri', () => {
        it('should probably be bijective', () => {
            _.each(_.range(2000, 2100), year => {
                _.each(_.range(1, 53), week => {
                    expect(weekDate.week(weekDate.date({
                        year: year,
                        week: week,
                    }))).to.deep.equal({
                        year: year,
                        week: week,
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=index.unit.js.map