import { GraphQLDateDirective, GraphQLTimeOffsetDirective } from '../../src/index'
import { testEqual } from '../utils';

import { expect } from 'chai';

describe('directives/date', () => {

    it('expected to have name property', () => {
        expect(GraphQLDateDirective.name).to.a('string')
    });

    it('expected to have description property', () => {
        expect(GraphQLDateDirective.description).to.a('string')
    });

    it('expected to have args properties', () => {
        expect(GraphQLDateDirective.args).to.a('array')
    });

    it('expected to have locations list', () => {
        expect(GraphQLDateDirective.locations).to.a('array');
    });

    it('expected to have resolve function', () => {
        expect(GraphQLDateDirective.resolve).to.be.function;
    });


    it('expected regular execution of graphql', (done) => {
        const query = `{ value }`,
            directives = [ GraphQLDateDirective],
            expected = { value: null };

        testEqual({ directives, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result formatted number', (done) => {
        const query = `{ value(input: "2016-01-01T00:00:00") @date }`,
            directives = [ GraphQLDateDirective],
            expected = { value: "01 Jan 2016 00:00" };

        testEqual({ directives, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result formatted number with as args', (done) => {
        const query = `{ value(input: "2016-01-01T00:00:00") @date(as:"YYYY") }`,
            directives = [ GraphQLDateDirective],
            expected = { value: "2016" };

        testEqual({ directives, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result formatted number with as args', (done) => {
        const query = `{ value(input: "2016-01-01T00:00:00") @date(as:"YYYY") }`,
            directives = [ GraphQLDateDirective],
            expected = { value: "2016" };

        testEqual({ directives, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result formatted number with as args (days)', (done) => {
        const query = `{ value(input: "${(new Date()).toISOString()}") @date(as:"days") }`,
            directives = [ GraphQLDateDirective],
            expected = { value: "0 days" };

        testEqual({ directives, query, expected, done });
    });


    it('expected directive to alter execution of graphql and result the original string', (done) => {
        const query = `{ value(input: "AA") @date }`,
            directives = [ GraphQLDateDirective],
            expected = { value: "AA" };

        testEqual({ directives, query, expected, done });
    });

    it('expected directive to convert 13 digit unixtime to formatted date', (done) => {
        const query = `{ value(input: "1479964283000") @date }`,
            directives = [ GraphQLDateDirective],
            expected = { value: "24 Nov 2016 05:11" };

        testEqual({ directives, query, expected, done });

    });

    it('expected directive to add offset to 13 digit unixtime, and return 13 digit unixtime ', (done) => {
        const query = `{ value(input: "1479964283000") @timeOffset(offsetLocation: "req.shop.utcOffset") }`,
            directives = [ GraphQLTimeOffsetDirective],
            expected = { value: "1479975083000" },
            context = {req: {shop: {utcOffset: 180}}};

        testEqual({ directives, query, expected, done ,context});

    });
});
