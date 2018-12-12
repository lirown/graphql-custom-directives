import {DirectiveLocation} from '../directiveLocation';
import {GraphQLString, GraphQLNonNull} from 'graphql';
import {GraphQLCustomDirective} from '../custom';

import {
  template,
  lowerCase,
  upperCase,
  camelCase,
  startCase,
  capitalize,
  kebabCase,
  trim,
  defaultTo,
  toLower,
  toUpper,
} from 'lodash';

function createCustomDirectiveByMethod(name, method) {
  return new GraphQLCustomDirective({
    name: name,
    description: `Format the input as using lodash ${name}`,
    locations: [DirectiveLocation.FIELD],
    args:
      name === 'default'
        ? {
            to: {
              type: GraphQLString,
              description: 'A default value for not filled field',
            },
          }
        : {},
    resolve(resolve, source, {to}) {
      return resolve().then(input => {
        if (
          input &&
          input instanceof Object &&
          !(input instanceof Array) &&
          Object.keys(input).length > 0
        ) {
          Object.keys(input).map(val => (input[val] = method(input[val], to)));
        }
        return method(input, to);
      });
    },
  });
}

export const GraphQLLowerCaseDirective = createCustomDirectiveByMethod(
  'lowerCase',
  lowerCase,
);

export const GraphQLUpperCaseDirective = createCustomDirectiveByMethod(
  'upperCase',
  upperCase,
);

export const GraphQLCamelCaseDirective = createCustomDirectiveByMethod(
  'camelCase',
  camelCase,
);

export const GraphQLStartCaseDirective = createCustomDirectiveByMethod(
  'startCase',
  startCase,
);

export const GraphQLCapitalizeDirective = createCustomDirectiveByMethod(
  'capitalize',
  capitalize,
);

export const GraphQLKebabCaseDirective = createCustomDirectiveByMethod(
  'kebabCase',
  kebabCase,
);

export const GraphQLTrimDirective = createCustomDirectiveByMethod('trim', trim);

export const GraphQLDefaultToDirective = createCustomDirectiveByMethod(
  'default',
  defaultTo,
);

export const GraphQLToLowerDirective = createCustomDirectiveByMethod(
  'toLower',
  toLower,
);

export const GraphQLToUpperDirective = createCustomDirectiveByMethod(
  'toUpper',
  toUpper,
);

export const GraphQLTemplateDirective = new GraphQLCustomDirective({
  name: 'template',
  description: `Format the input as using lodash template`,
  locations: [DirectiveLocation.FIELD],
  args: {
    as: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'A template given by lodash module',
    },
  },
  resolve(resolve, source, {as}) {
    return resolve().then(input => {
      let templateString = as;

      templateString = templateString
        .replace(/\({1}([a-z]{1,})\)\}/g, '(data.$1)}')
        .replace(/\$\{([a-z]{1,})/g, '${data.$1');

      let output = template(templateString, {variable: 'data'})(
        Object.assign(
          {
            lowerCase,
            upperCase,
            camelCase,
            startCase,
            capitalize,
            kebabCase,
            trim,
            defaultTo,
            toLower,
            toUpper,
          },
          {
            input,
          },
          source,
        ),
      );

      return output;
    });
  },
});
