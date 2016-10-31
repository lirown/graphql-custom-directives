import { GraphQLNumberDirective } from '../../src/directives/number'
import { testEqual, testNullEqual } from '../utils';

import { expect } from 'chai';

describe('directives/number', () => {

    it('expected to have name property', () => {
        expect(GraphQLNumberDirective.name).to.a('string')
    });

    it('expected to have description property', () => {
        expect(GraphQLNumberDirective.description).to.a('string')
    });

    it('expected to have args properties', () => {
        expect(GraphQLNumberDirective.args).to.a('array')
    });

    it('expected to have locations list', () => {
        expect(GraphQLNumberDirective.locations).to.a('array');
    });

    it('expected to have resolve function', () => {
        expect(GraphQLNumberDirective.resolve).to.be.function;
    });


    it('expected regular execution of graphql', (done) => {
        const query = `{ input }`,
            expected = { "input": null };

        testNullEqual({ query, expected, done });
    });

    it('expected directive to alter execution of graphql and result formatted number', (done) => {
        const query = `{ input(value: "10.00") @number }`,
            expected = { "input": "10" };

        testEqual({ directive: GraphQLNumberDirective, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result formatted number with as args', (done) => {
        const query = `{ input(value: "-10.00") @number(as:"(0,0)") }`,
            expected = { "input": "(10)" };

        testEqual({ directive: GraphQLNumberDirective, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result null', (done) => {
        const query = `{ input @number }`,
            expected = { "input": null };

        testEqual({ directive: GraphQLNumberDirective, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result original value', (done) => {
        const query = `{ input(value: "test") @number }`,
            expected = { "input": "test" };

        testEqual({ directive: GraphQLNumberDirective, query, expected, done });
    });
});
