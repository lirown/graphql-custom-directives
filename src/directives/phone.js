import {GraphQLString} from 'graphql';
import {DirectiveLocation} from '../directiveLocation';
import {GraphQLCustomDirective} from '../custom';

import { parsePhoneNumber } from 'libphonenumber-js'

exports.GraphQLPhoneDirective = new GraphQLCustomDirective({
  name: 'phone',
  description: 'Format the phone value from resolving the field',
  locations: [DirectiveLocation.FIELD],
  args: {
    as: {
      type: GraphQLString,
      description: 'A phone format (NATIONAL, INTERNATIONAL, RFC3966)',
    },
  },
  resolve(resolve, source, {as}) {
    return resolve().then(input => {
      try {
        const phoneNumber = parsePhoneNumber(input);
        if (as) {
          return phoneNumber.format(as.toUpperCase());
        }
        return phoneNumber.formatInternational();
      } catch (e) {
        // In case of wrong format return the original value
        return input
      }
    });
  },
});
