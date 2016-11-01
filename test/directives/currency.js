import { GraphQLCurrencyDirective } from '../../src/index'
import { testEqual } from '../utils';

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
        const query = `{ value }`,
            directives = [ GraphQLCurrencyDirective],
            expected = { value: null };

        testEqual({ directives, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result formatted currency', (done) => {
        const query = `{ value(input: "10") @currency }`,
            directives = [ GraphQLCurrencyDirective],
            expected = { value: "$10" };

        testEqual({ directives, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result null', (done) => {
        const query = `{ value @currency }`,
            directives = [ GraphQLCurrencyDirective ],
            expected = { value: null };

        testEqual({ directives, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result the original value', (done) => {
        const query = `{ value(input: "test") @currency }`,
            directives = [ GraphQLCurrencyDirective],
            expected = { value: "test" };

        testEqual({ directives, query, expected, done });
    });
});
