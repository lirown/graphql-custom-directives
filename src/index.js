import { GraphQLDirective } from 'graphql/type/directives';
import { GraphQLSchema } from 'graphql';
import { applySchemaCustomDirectives, GraphQLCustomDirective } from 'graphql-custom-directive';

/**
 * create a new graphql custom directive which contain a resolve
 * function for altering the execution of the graphql
 */
exports.GraphQLCustomDirective = GraphQLCustomDirective;

/**
 * Apply custom directives support in the graphql schema
 */
exports.applySchemaCustomDirectives = applySchemaCustomDirectives;
