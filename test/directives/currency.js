import { GraphQLCurrencyDirective } from '../../src/directives/currency'
import { testEqual, testNullEqual } from '../utils';

import { expect } from 'chai';

describe('directives/currency', () => {

    it('expected to have name property', () => {
        expect(GraphQLCurrencyDirective.name).to.a('string')
    });

    it('expected to have description property', () => {
        expect(GraphQLCurrencyDirective.description).to.a('string')
    });

    it('expected to have args properties', () => {
        expect(GraphQLCurrencyDirective.args).to.a('array')
    });

    it('expected to have locations list', () => {
        expect(GraphQLCurrencyDirective.locations).to.a('array');
    });

    it('expected to have resolve function', () => {
        expect(GraphQLCurrencyDirective.resolve).to.be.function;
    });


    it('expected regular execution of graphql', (done) => {
        const query = `{ input }`,
            expected = { "input": null };

        testNullEqual({ query, expected, done });
    });

    it('expected directive to alter execution of graphql and result formatted currency', (done) => {
        const query = `{ input(value: "10") @currency }`,
            expected = { "input": "$10" };

        testEqual({ directive: GraphQLCurrencyDirective, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result null', (done) => {
        const query = `{ input @currency }`,
            expected = { "input": null };

        testEqual({ directive: GraphQLCurrencyDirective, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result the original value', (done) => {
        const query = `{ input(value: "test") @currency }`,
            expected = { "input": "test" };

        testEqual({ directive: GraphQLCurrencyDirective, query, expected, done });
    });
});
