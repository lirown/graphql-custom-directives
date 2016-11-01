import { GraphQLString, GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLList, graphql, buildSchema, printSchema } from 'graphql';
import { applySchemaCustomDirectives } from '../src/index';

import { expect } from 'chai';

const DEFAULT_TEST_SCHEMA = `type Query { value(input: String): String } schema { query: Query }`;
const GRAPHQL_INPUT_ARGS_START_AT = /\(input:\s{0,}\"/g;
const GRAPHQL_INPUT_ARGS_END_AT = /\"/g;

exports.testEqual = function({ directives, query, schema, input, expected, done }) {

    let executionSchema = buildSchema(schema || DEFAULT_TEST_SCHEMA);

    let root = input;

    if (!schema && query.includes('input:')) {
        let value = query.split(GRAPHQL_INPUT_ARGS_START_AT)[1].split(GRAPHQL_INPUT_ARGS_END_AT)[0].trim();
        root = { value };
    }
    executionSchema._directives = directives;

    applySchemaCustomDirectives(executionSchema);

    graphql(executionSchema, query, root)
        .then(({data, errors }) => {
            if (errors) {
                console.error(errors);
                throw new Error(errors);
            }
            expect(data).to.eql(expected);
        })
        .then(done, done);
};
