import { GraphQLDateDirective } from '../../src/directives/date'
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
});
