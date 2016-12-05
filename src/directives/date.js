import { GraphQLString, GraphQLBoolean } from 'graphql';
import { DirectiveLocation } from 'graphql/type/directives';
import { GraphQLCustomDirective } from '../custom';
import { _ } from 'lodash';

const moment = require('moment');

const DEFAULT_DATE_FORMAT = 'DD MMM YYYY HH:mm';

exports.GraphQLDateDirective = new GraphQLCustomDirective({
    name: 'date',
    description:
        'Format the date from resolving the field by moment module',
    locations: [
        DirectiveLocation.FIELD
    ],
    args: {
        as: {
            type: GraphQLString,
            description: 'A format given by moment module'
        }
    },
    resolve(resolve, source, { as }) {
        return resolve().then(input => {

            const format = as || DEFAULT_DATE_FORMAT;

            if (format.indexOf('days') !== -1 || format.indexOf('ago') !== -1) {
                return `${moment.utc().diff(input, 'days')} ${format}`;
            }

            if (`${input}`.length === 13) {
                input = Number(input);
            }

            if (!Date.parse(input) && `${input}`.length !== 13) {
                return input;
            }

            return moment.utc(input).format(format);
        });
    }
});


exports.GraphQLTimeOffsetDirective = new GraphQLCustomDirective({
    name: 'timeOffset',
    description: 'Add offset (in minutes) to a 13 digit unixtime',
    locations: [DirectiveLocation.FIELD],
    args: {
        offsetLocation: {
            type: GraphQLString,
            description: 'Path of offset in minutes within context object. e.g - "req.profile.utcOffset"'
        }
    },
    resolve: function resolve(_resolve, source, _ref, context, info) {
        var offsetMinutes = _.get(context, _ref.offsetLocation);
        var offsetMilliseconds = offsetMinutes * 60 * 1000;

        return _resolve().then(function (input) {

            if (('' + input).length === 13) {
                input  = Number(input) + offsetMilliseconds;
                return input;
            }
        });
    }
});