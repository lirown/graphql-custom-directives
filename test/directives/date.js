import { GraphQLDateDirective } from '../../src/directives/date'
import { testEqual, testNullEqual } from '../utils';

import { expect } from 'chai';

describe('directives/number', () => {

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
        const query = `{ input }`,
            expected = { "input": null };

        testNullEqual({ query, expected, done });
    });

    it('expected directive to alter execution of graphql and result formatted number', (done) => {
        const query = `{ input(value: "2016-01-01T00:00:00") @date }`,
            expected = { "input": "01 Jan 2016 00:00" };

        testEqual({ directive: GraphQLDateDirective, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result formatted number with as args', (done) => {
        const query = `{ input(value: "2016-01-01T00:00:00") @date(as:"YYYY") }`,
            expected = { "input": "2016" };

        testEqual({ directive: GraphQLDateDirective, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result formatted number with as args', (done) => {
        const query = `{ input(value: "2016-01-01T00:00:00") @date(as:"YYYY") }`,
            expected = { "input": "2016" };

        testEqual({ directive: GraphQLDateDirective, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result formatted number with as args (days)', (done) => {
        const query = `{ input(value: "${(new Date()).toISOString()}") @date(as:"days") }`,
            expected = { "input": "0 days" };

        testEqual({ directive: GraphQLDateDirective, query, expected, done });
    });


    it('expected directive to alter execution of graphql and result the original string', (done) => {
        const query = `{ input(value: "AA") @date }`,
            expected = { "input": "AA" };

        testEqual({ directive: GraphQLDateDirective, query, expected, done });
    });
});
