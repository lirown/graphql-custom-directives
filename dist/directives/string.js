'use strict';

var _directives = require('graphql/type/directives');

var _graphql = require('graphql');

var _custom = require('../custom');

var _lodash = require('lodash');

function createCustomDirectiveByMethod(name, method) {
    return new _custom.GraphQLCustomDirective({
        name: name,
        description: 'Format the input as using lodash ' + name,
        locations: [_directives.DirectiveLocation.FIELD],
        args: name === 'default' ? {
            to: {
                type: _graphql.GraphQLString,
                description: 'A default value for not filled field'
            }
        } : {},
        resolve: function resolve(_resolve, source, _ref) {
            var to = _ref.to;

            return _resolve().then(function (input) {
                if (input && input instanceof Object && !(input instanceof Array) && Object.keys(input).length > 0) {
                    Object.keys(input).map(function (val) {
                        return input[val] = method(input[val], to);
                    });
                }
                return method(input, to);
            });
        }
    });
}

exports.GraphQLLowerCaseDirective = createCustomDirectiveByMethod('lowerCase', _lodash.lowerCase);

exports.GraphQLUpperCaseDirective = createCustomDirectiveByMethod('upperCase', _lodash.upperCase);

exports.GraphQLCamelCaseDirective = createCustomDirectiveByMethod('camelCase', _lodash.camelCase);

exports.GraphQLStartCaseDirective = createCustomDirectiveByMethod('startCase', _lodash.startCase);

exports.GraphQLCapitalizeDirective = createCustomDirectiveByMethod('capitalize', _lodash.capitalize);

exports.GraphQLKebabCaseDirective = createCustomDirectiveByMethod('kebabCase', _lodash.kebabCase);

exports.GraphQLTrimDirective = createCustomDirectiveByMethod('trim', _lodash.trim);

exports.GraphQLDefaultToDirective = createCustomDirectiveByMethod('default', _lodash.defaultTo);

exports.GraphQLToLowerDirective = createCustomDirectiveByMethod('toLower', _lodash.toLower);

exports.GraphQLToUpperDirective = createCustomDirectiveByMethod('toUpper', _lodash.toUpper);

exports.GraphQLTemplateDirective = new _custom.GraphQLCustomDirective({
    name: 'template',
    description: 'Format the input as using lodash template',
    locations: [_directives.DirectiveLocation.FIELD],
    args: {
        as: {
            type: new _graphql.GraphQLNonNull(_graphql.GraphQLString),
            description: 'A template given by lodash module'
        }
    },
    resolve: function resolve(_resolve2, source, _ref2) {
        var as = _ref2.as;

        return _resolve2().then(function (input) {
            var templateString = as;

            templateString = templateString.replace(/\({1}([a-z]{1,})\)\}/g, '(data.$1)}').replace(/\$\{([a-z]{1,})/g, '${data.$1');

            var output = (0, _lodash.template)(templateString, { variable: 'data' })(Object.assign({
                lowerCase: _lodash.lowerCase, upperCase: _lodash.upperCase, camelCase: _lodash.camelCase,
                startCase: _lodash.startCase, capitalize: _lodash.capitalize, kebabCase: _lodash.kebabCase,
                trim: _lodash.trim, defaultTo: _lodash.defaultTo, toLower: _lodash.toLower, toUpper: _lodash.toUpper
            }, {
                input: input
            }, source));

            return output;
        });
    }
});