import {
  GraphQLString,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  graphql,
  buildSchema,
} from 'graphql';
import {applySchemaCustomDirectives} from '../src/index';

import {expect} from 'chai';

const DEFAULT_TEST_SCHEMA = `type Query { value(input: String): String } schema { query: Query }`;

const _runQuery = function({
  directives,
  query,
  schema,
  input,
  passServer = false,
  done,
  context,
}) {
  let executionSchema = buildSchema(schema || DEFAULT_TEST_SCHEMA);

  if (!schema) {
    executionSchema._queryType._fields.value.resolve = (
      source,
      {input, context},
    ) => input;
    if (passServer) {
      executionSchema._queryType._fields.value.directives = {
        duplicate: {by: 2},
      };
    }
  }

  if (directives)
    executionSchema._directives = executionSchema._directives.concat(
      directives,
    );

  applySchemaCustomDirectives(executionSchema);

  return graphql(executionSchema, query, input, context);
};

exports.testEqual = function({
  directives,
  query,
  schema,
  input,
  passServer = false,
  expected,
  done,
  context,
}) {
  return _runQuery({
    directives,
    query,
    schema,
    input,
    passServer,
    done,
    context,
  })
    .then(({data, errors}) => {
      if (errors) {
        throw new Error(errors);
      }
      expect(data).to.eql(expected);
    })
    .then(done, done);
};

exports.runQuery = function({
  directives,
  query,
  schema,
  input,
  passServer = false,
  done,
  context,
}) {
  return _runQuery({
    directives,
    query,
    schema,
    input,
    passServer,
    done,
    context,
  })
    .then(({data, errors}) => {
      if (errors) {
        throw new Error(errors);
      }
    })
    .catch(e => {
      throw e;
    });
};
