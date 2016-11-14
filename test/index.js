import { GraphQLCustomDirective, applySchemaCustomDirectives } from '../src/index';
import { GraphQLInt, GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLList, graphql, buildSchema } from 'graphql';
import { DirectiveLocation } from 'graphql/type/directives';
import { createGraphQLQueryDeepObject, testEqual, testNullEqual } from './utils';

import { expect } from 'chai';

let GraphQLTestDirective, schema;


describe('GraphQLCustomDirective', () => {

    before(() => {
        GraphQLTestDirective = new GraphQLCustomDirective({
            name: 'duplicate',
            description:
              'duplicate the string sperating them with space',
            locations: [
                DirectiveLocation.FIELD
            ],
            args: {
                by: {
                    type: GraphQLInt,
                    description: 'the times to duplicate the string'
                }
            },
            resolve: function(resolve, source, { by }, schema, info) {
                return resolve().then(result => {

                    if (!result) {
                        return result;
                    }

                    let times = [];

                    for (let i = 0; i < (by || 2); i++) {
                        times.push(result);
                    }

                    return times.join(' ');
                });
            }
        });
    });

    it('expected to have name property', () => {
        expect(GraphQLTestDirective.name).to.eql('duplicate');
    });

    it('expected to have description property', () => {
        expect(GraphQLTestDirective.description).to.eql('duplicate the string sperating them with space');
    });

    it('expected to have args properties', () => {
        expect(GraphQLTestDirective.args).to.a('array');
    });

    it('expected to have locations list', () => {
        expect(GraphQLTestDirective.locations).to.a('array');
    });

    it('expected to have resolve function', () => {
        expect(GraphQLTestDirective.resolve).to.be.function;
    });


    it('expected regular execution of graphql', (done) => {
        const query = `{ value }`,
          input = { "value": null},
          expected = { "value": null };

        testEqual({ query, expected, input, done });
    });

    it('expected directive to alter execution of graphql and result test test', (done) => {
        const query = `{ value(input: "test") @duplicate }`,
          passServer = true,
          directives = [ GraphQLTestDirective],
          expected = { "value": "test test test test" };

        testEqual({ directives, query, expected, done, passServer });
    });

    it('expected directive to alter execution of graphql and result test test', (done) => {
        const query = `{ value(input: "test") @duplicate @duplicate(by:3) }`,
          directives = [ GraphQLTestDirective],
          expected = { "value": "test test test test test test" };

        testEqual({ directives, query, expected, done });
    });

    it('expected directive to alter execution of graphql and result test test test', (done) => {
        const query = `{ value @duplicate @duplicate(by:3) }`,
          schema = `type Query { value: String } schema { query: Query }`,
          input = { value: 'test'},
          directives = [ GraphQLTestDirective],
          expected = { "value": "test test test test test test" };

        testEqual({ directives, query, schema, input, expected, done });
    });

    it('expected directive to alter execution of graphql and result null', (done) => {
        const query = `{ value @duplicate }`,
          directives = [ GraphQLTestDirective],
          expected = { "value": null };

        testEqual({ directives, query, expected, done });
    });

});

describe('applySchemaCustomDirectives', () => {

    it('expected to throw error when invalid schema', () => {
        expect(applySchemaCustomDirectives.bind({})).throw(/Schema must be instanceof GraphQLSchema/);
    });

    it('expected to apply custom directives to schema', () => {
        let schema = `type Test { input: String!, output: String } type Query { test1: Test, test2: [Test] } schema { query: Query }`
        let executionSchema = buildSchema(schema);

        expect(applySchemaCustomDirectives(executionSchema)).to.eql(true);
    });
});
