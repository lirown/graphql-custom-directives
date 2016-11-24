'use strict';

var _graphql = require('graphql');

var _directives = require('graphql/type/directives');

var _custom = require('../custom');

var moment = require('moment');

var DEFAULT_DATE_FORMAT = 'DD MMM YYYY HH:mm';

exports.GraphQLDateDirective = new _custom.GraphQLCustomDirective({
    name: 'date',
    description: 'Format the date from resolving the field by moment module',
    locations: [_directives.DirectiveLocation.FIELD],
    args: {
        as: {
            type: _graphql.GraphQLString,
            description: 'A format given by moment module'
        }
    },
    resolve: function resolve(_resolve, source, _ref) {
        var as = _ref.as;

        return _resolve().then(function (input) {

            var format = as || DEFAULT_DATE_FORMAT;

            if (format.indexOf('days') !== -1 || format.indexOf('ago') !== -1) {
                return moment.utc().diff(input, 'days') + ' ' + format;
            }

            if (('' + input).length === 13) {
                input = Number(input);
            }

            if (!Date.parse(input) && ('' + input).length !== 13) {
                return input;
            }

            return moment.utc(input).format(format);
        });
    }
});