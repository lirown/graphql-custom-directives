import { DirectiveLocation } from 'graphql/type/directives';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { GraphQLCustomDirective } from '../custom';

import { template, lowerCase, upperCase, camelCase, startCase, capitalize, kebabCase, trim, defaultTo, toLower, toUpper } from 'lodash';

function createCustomDirectiveByMethod(name, method) {
    return new GraphQLCustomDirective({
        name: name,
        description: `Format the input as using lodash ${name}`,
        locations: [
            DirectiveLocation.FIELD
        ],
        args: name === 'default' ? {
            to: {
                type: GraphQLString,
                description: 'A default value for not filled field'
            }
        } : {},
        resolve(resolve, source, { to }) {
            return resolve().then(input => {
                if (input && input instanceof Object && !(input instanceof Array) && Object.keys(input).length > 0) {
                    Object.keys(input).map((val) => input[val] = method(input[val], to));
                }
                return method(input, to);
            });
        }
    });
}

exports.GraphQLLowerCaseDirective = createCustomDirectiveByMethod('lowerCase', lowerCase);

exports.GraphQLUpperCaseDirective = createCustomDirectiveByMethod('upperCase', upperCase);

exports.GraphQLCamelCaseDirective = createCustomDirectiveByMethod('camelCase', camelCase);

exports.GraphQLStartCaseDirective = createCustomDirectiveByMethod('startCase', startCase);

exports.GraphQLCapitalizeDirective = createCustomDirectiveByMethod('capitalize', capitalize);

exports.GraphQLKebabCaseDirective = createCustomDirectiveByMethod('kebabCase', kebabCase);

exports.GraphQLTrimDirective = createCustomDirectiveByMethod('trim', trim);

exports.GraphQLDefaultToDirective = createCustomDirectiveByMethod('default', defaultTo);

exports.GraphQLToLowerDirective = createCustomDirectiveByMethod('toLower', toLower);

exports.GraphQLToUpperDirective = createCustomDirectiveByMethod('toUpper', toUpper);

exports.GraphQLTemplateDirective =  new GraphQLCustomDirective({
    name: 'template',
    description: `Format the input as using lodash template`,
    locations: [
        DirectiveLocation.FIELD
    ],
    args: {
        as: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'A template given by lodash module'
        }
    },
    resolve(resolve, source, { as }) {
        return resolve().then(input => {
            let templateString = as;

            templateString = templateString.replace(/\({1}([a-z]{1,})\)\}/g,'(data.$1)}').replace(/\$\{([a-z]{1,})/g,'${data.$1');

            let output = template(templateString, { variable: 'data' })
                (Object.assign({
                    lowerCase, upperCase, camelCase,
                    startCase, capitalize, kebabCase,
                    trim, defaultTo, toLower, toUpper
                }, {
                    input
                }, source));

            return output;
        });
    }
});