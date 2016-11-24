'use strict';

var _graphql = require('graphql');

var _directives = require('graphql/type/directives');

var _custom = require('../custom');

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_NUMBER_FORMAT = '0,0';

exports.GraphQLNumberDirective = new _custom.GraphQLCustomDirective({
    name: 'number',
    description: 'Format the number value from resolving the field',
    locations: [_directives.DirectiveLocation.FIELD],
    args: {
        as: {
            type: _graphql.GraphQLString,
            description: 'A format given by numeral module'
        }
    },
    resolve: function resolve(_resolve, source, _ref) {
        var as = _ref.as;

        return _resolve().then(function (input) {

            var format = as || DEFAULT_NUMBER_FORMAT;

            if (format.indexOf('0') !== -1 && !Number.isNaN(Number(input))) {
                return (0, _numeral2.default)(input).format(format) || input;
            }

            return input;
        });
    }
});