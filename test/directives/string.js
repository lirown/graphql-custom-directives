import { GraphQLLowerCaseDirective, GraphQLUpperCaseDirective, GraphQLTemplateDirective, GraphQLToLowerDirective, GraphQLTrimDirective, GraphQLToUpperDirective, GraphQLDefaultToDirective } from '../../src/directives/string'
import { testEqual, testNullEqual } from '../setup';

import { expect } from 'chai';

describe('directives/string/lowerCase', () => {

    it('expected to have name property', () => {
        expect(GraphQLLowerCaseDirective.name).to.a('string')
    });

    it('expected to have description property', () => {
        expect(GraphQLLowerCaseDirective.description).to.a('string')
    });

    it('expected to have args properties', () => {
        expect(GraphQLLowerCaseDirective.args).to.a('array')
    });

    it('expected to have locations list', () => {
        expect(GraphQLLowerCaseDirective.locations).to.a('array');
    });

    it('expected to have resolve function', () => {
        expect(GraphQLLowerCaseDirective.resolve).to.be.function;
    });

    it('expected regular execution of graphql', (done) => {
        const query = `{ input }`,
            expected = { "input": null };

        testNullEqual({ query, expected, done });
    });

    it('expected directive to alter execution of graphql and result lower cased string', (done) => {
        const query = `{ input(value: "AAA") @lowerCase }`,
            expected = { "input": "aaa" };

        testEqual({ directive: GraphQLLowerCaseDirective, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result empty string', (done) => {
        const query = `{ input @lowerCase }`,
            expected = { "input": "" };

        testEqual({ directive: GraphQLLowerCaseDirective, query, expected, done });
    });

});

describe('directives/string/upperCase', () => {

    it('expected to have name property', () => {
        expect(GraphQLUpperCaseDirective.name).to.a('string')
    });

    it('expected to have description property', () => {
        expect(GraphQLUpperCaseDirective.description).to.a('string')
    });

    it('expected to have args properties', () => {
        expect(GraphQLUpperCaseDirective.args).to.a('array')
    });

    it('expected to have locations list', () => {
        expect(GraphQLUpperCaseDirective.locations).to.a('array');
    });

    it('expected to have resolve function', () => {
        expect(GraphQLUpperCaseDirective.resolve).to.be.function;
    });

    it('expected regular execution of graphql', (done) => {
        const query = `{ input }`,
            expected = { "input": null };

        testNullEqual({ query, expected, done });
    });

    it('expected directive to alter execution of graphql and result upper cased string', (done) => {
        const query = `{ input(value: "aaa") @upperCase }`,
            expected = { "input": "AAA" };

        testEqual({ directive: GraphQLUpperCaseDirective, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result empty string', (done) => {
        const query = `{ input @upperCase }`,
            expected = { "input": "" };

        testEqual({ directive: GraphQLUpperCaseDirective, query, expected, done });
    });

});

describe('directives/string/template', () => {

    it('expected to have name property', () => {
        expect(GraphQLTemplateDirective.name).to.a('string')
    });

    it('expected to have description property', () => {
        expect(GraphQLTemplateDirective.description).to.a('string')
    });

    it('expected to have args properties', () => {
        expect(GraphQLTemplateDirective.args).to.a('array')
    });

    it('expected to have locations list', () => {
        expect(GraphQLTemplateDirective.locations).to.a('array');
    });

    it('expected to have resolve function', () => {
        expect(GraphQLTemplateDirective.resolve).to.be.function;
    });

    it('expected regular execution of graphql', (done) => {
        const query = `{ input }`,
            expected = { "input": null };

        testNullEqual({ query, expected, done });
    });

    it('expected directive to alter execution of graphql and result a template\'s output', (done) => {
        const query = '{ input(value: "AAA") @template(as:"${input} - ${toLower(input)} ${test}") }',
            expected = { "input": "AAA - aaa " };

        testEqual({ directive: GraphQLTemplateDirective, query, expected, done });
    });


    it('expected directive to alter execution of graphql and result a template\'s and pipeline of directives', (done) => {
        const query = '{ input(value: "AAA") @template(as:"${input} - ${toLower(input)} ${test}") @toLower @trim @toUpper @default(to:"N/A") }',
            expected = { "input": "AAA - AAA" };

        testEqual({ directive: [ GraphQLTemplateDirective, GraphQLToLowerDirective, GraphQLTrimDirective, GraphQLToUpperDirective, GraphQLDefaultToDirective ], query, expected, done });
    });
});