import { GraphQLDirective } from 'graphql/type/directives';
import { GraphQLSchema } from 'graphql';
import { applySchemaCustomDirectives, GraphQLCustomDirective } from 'graphql-custom-directive';

import {
    GraphQLDateDirective
} from './directives/date';

import {
    GraphQLNumberDirective
} from './directives/number';

import {
    GraphQLCurrencyDirective
} from './directives/currency';

import {
    GraphQLLowerCaseDirective,
    GraphQLUpperCaseDirective,
    GraphQLCamelCaseDirective,
    GraphQLStartCaseDirective,
    GraphQLCapitalizeDirective,
    GraphQLKebabCaseDirective,
    GraphQLTrimDirective,
    GraphQLDefaultToDirective,
    GraphQLToLowerDirective,
    GraphQLToUpperDirective,
    GraphQLTemplateDirective
} from './directives/string';

/**
 * create a new graphql custom directive which contain a resolve
 * function for altering the execution of the graphql
 */
exports.GraphQLCustomDirective = GraphQLCustomDirective;

/**
 * Apply custom directives support in the graphql schema
 */
exports.applySchemaCustomDirectives = applySchemaCustomDirectives;

exports.GraphQLDateDirective = GraphQLDateDirective;

exports.GraphQLNumberDirective = GraphQLNumberDirective;
exports.GraphQLCurrencyDirective = GraphQLCurrencyDirective;

exports.GraphQLLowerCaseDirective = GraphQLLowerCaseDirective;
exports.GraphQLUpperCaseDirective = GraphQLUpperCaseDirective;
exports.GraphQLCamelCaseDirective = GraphQLCamelCaseDirective;
exports.GraphQLStartCaseDirective = GraphQLStartCaseDirective;
exports.GraphQLCapitalizeDirective = GraphQLCapitalizeDirective;
exports.GraphQLKebabCaseDirective = GraphQLKebabCaseDirective;
exports.GraphQLTrimDirective = GraphQLTrimDirective;
exports.GraphQLDefaultToDirective = GraphQLDefaultToDirective;
exports.GraphQLToLowerDirective = GraphQLToLowerDirective;
exports.GraphQLToUpperDirective = GraphQLToUpperDirective;
exports.GraphQLTemplateDirective = GraphQLTemplateDirective;