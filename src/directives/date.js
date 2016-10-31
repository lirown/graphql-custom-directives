import { GraphQLString } from 'graphql';
import { DirectiveLocation } from 'graphql/type/directives';
import { GraphQLCustomDirective } from 'graphql-custom-directive';

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

            if (!Date.parse(input)) {
                return input;
            }

            return moment.utc(input).format(format);
        });
    }
});

