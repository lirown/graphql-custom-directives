// Import all directives and utilities

import {
  GraphQLDateDirective,
  GraphQLTimeOffsetDirective,
} from './directives/date';

import { GraphQLNumberDirective } from './directives/number';

import { GraphQLPhoneDirective } from './directives/phone';

import { GraphQLCurrencyDirective } from './directives/currency';

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
  GraphQLTemplateDirective,
} from './directives/string';

// Export all directives in an array as the default export
// Usage:
// CJS: const GraphQLCustomDirectives = require("graphql-custom-directives");
// or
// ESM: import GraphQLCustomDirectives from "graphql-custom-directives";

export default [
  GraphQLDateDirective,
  GraphQLTimeOffsetDirective,
  GraphQLNumberDirective,
  GraphQLCurrencyDirective,
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
  GraphQLTemplateDirective,
  GraphQLPhoneDirective
]

// Export Directives Individually (same as exports. syntax)
// Usage:
// CJS: const { GraphQLDateDirective, applySchemaCustomDirectives } = require("graphql-custom-directives");
// or
// ESM: import { GraphQLDateDirective, applySchemaCustomDirectives } from "graphql-custom-directives";

export { GraphQLCustomDirective, applySchemaCustomDirectives } from './custom';

export {
  GraphQLDateDirective,
  GraphQLTimeOffsetDirective,
} from './directives/date';

export { GraphQLNumberDirective } from './directives/number';

export { GraphQLPhoneDirective } from './directives/phone';

export { GraphQLCurrencyDirective } from './directives/currency';

export {
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
  GraphQLTemplateDirective,
} from './directives/string';
