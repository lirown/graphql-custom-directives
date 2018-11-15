import {GraphQLString} from 'graphql';
import {DirectiveLocation} from '../directiveLocation';
import {GraphQLCustomDirective} from '../custom';

import numeral from 'numeral';

const DEFAULT_CURRENCY_FORMAT = '$0,0';

exports.GraphQLCurrencyDirective = new GraphQLCustomDirective({
  name: 'currency',
  description: 'Format the currency value from resolving the field',
  locations: [DirectiveLocation.FIELD],
  args: {
    as: {
      type: GraphQLString,
      description: 'A currency format given by numeral module',
    },
    currencySymbol: {
      type: GraphQLString,
      description: 'A currency symbol to attach to the output (Numeral supports only one currency at a time, so this is an override)'
    }
  },
  resolve(resolve, source, {as, currencySymbol = ''}) {
    return resolve().then(input => {
      const format = as || DEFAULT_CURRENCY_FORMAT;

      if (format.indexOf('0') !== -1 && !Number.isNaN(Number(input))) {
        return `${currencySymbol}${numeral(input).format(format) || input}`;
      }

      return input;
    });
  },
});
