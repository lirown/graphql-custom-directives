import { GraphQLNumberDirective } from '../../src/index'
import { testEqual } from '../utils';

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
        const query = `{ value }`,
            directives = [ GraphQLNumberDirective],
            expected = { value: null };

        testEqual({ directives, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result formatted number', (done) => {
        const query = `{ value(input: "10.00") @number }`,
            directives = [ GraphQLNumberDirective],
            expected = { value: "10" };

        testEqual({ directives, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result formatted number with as args', (done) => {
        const query = `{ value(input: "-10.00") @number(as:"(0,0)") }`,
            directives = [ GraphQLNumberDirective],
            expected = { value: "(10)" };

        testEqual({ directives, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result null', (done) => {
        const query = `{ value @number }`,
            directives = [ GraphQLNumberDirective ],
            expected = { value: null };

        testEqual({ directives, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result original value', (done) => {
        const query = `{ value(input: "test") @number }`,
            directives = [ GraphQLNumberDirective],
            expected = { value: "test" };

        testEqual({ directives, query, expected, done });
    });
});
