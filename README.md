# graphql-custom-directives
[![Build Status](https://travis-ci.org/lirown/graphql-custom-directives.svg?branch=master)](https://travis-ci.org/lirown/graphql-custom-directives)
[![Coverage Status](https://coveralls.io/repos/github/lirown/graphql-custom-directives/badge.svg?branch=master)](https://coveralls.io/github/lirown/graphql-custom-directives?branch=master)
[![npm version](https://badge.fury.io/js/graphql-custom-directives.svg)](https://badge.fury.io/js/graphql-custom-directives)
[![Dependency Status](https://david-dm.org/lirown/graphql-custom-directives.svg)](https://david-dm.org/lirown/graphql-custom-directives)
[![Known Vulnerabilities](https://snyk.io/test/github/lirown/graphql-custom-directives/e2453e0c95d82fb876c1da228920bf7966a10af8/badge.svg)](https://snyk.io/test/github/lirown/graphql-custom-directives/e2453e0c95d82fb876c1da228920bf7966a10af8)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)

A collection of custom graphql directives created with [Moment](https://github.com/moment/moment), [Lodash](https://github.com/lodash/lodash) and [Numeral-js](https://github.com/adamwdraper/Numeral-js).

Checkout [graphql-custom-directive](https://github.com/lirown/graphql-custom-directive) for creating your own graphql custom directives.

### Install
```
npm install --save graphql-custom-directives
```


### Usage
```javascript
import {
  GraphQLDateDirective,
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
  applySchemaCustomDirectives
} from 'graphql-custom-directives';

const query = new GraphQLObjectType({
   name: 'Query',
   fields: {
     input: {
       type: GraphQLString,
       args: {
         value: {
           type: GraphQLString
         }
       },
       resolve: (source, {value}) => value
     }
   }
});

const schema = new GraphQLSchema({
  directives: [
    GraphQLDateDirective,
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
    GraphQLTemplateDirective
  ],
  query
});

applySchemaCustomDirectives(schema);

graphql(schema, `{ input(value: "test") @upperCase }`)
  .then(({ result, errors }) => {
     console.log(result); // will print { input: "TEST }
  });
```
### Date formatting directives

Adding date directive to graphql query for formatting the result using [Moment](https://github.com/moment/moment).

- Using default date format:
```javascript
  query { 
    input(value: "2016-01-01T00:00:00") @date 
  } 
  // => { input: "01 Jan 2016 00:00" }
```
- Using specific moment format:
```javascript
  query { 
    input(value: "2016-01-01T00:00:00") @date(as:"YYYY") 
  }
// => { input: "2016" }
```
- Using days ago format
```javascript
  query { 
    input(value: "${(new Date).toISOString()}") @date(as:"days ago") 
  }
  // => { input: "0 days ago" }    
```

### Number formatting directives

Adding number directive to graphql query for formatting the result using [Numeral-js](https://github.com/adamwdraper/Numeral-js). 

- Using default format:
```javascript
  query { 
    input(value: "1500.404") @number 
  }
  // => { input: "1,500" }
```   
- Using specific numeral format:
```javascript
  query { 
    input(value: "-1500.404") @number(as:"(0,0.00)") 
  }
  // => { input: "(1,500.40)" }
```
-  Using default currency format:
```javascript
  query { 
    input(value: "1500") @currency 
  }
  // => { input: "$1,500)" }    
```

### String formatting directives

Adding string directive to graphql query for formatting the result using [Lodash](https://github.com/lodash/lodash). 

- Using lowerCase directive: 

```javascript
  query { 
    input(value: "FOO BAR") @lowerCase 
  }
  // => { input: "foo bar" }
```

- Using upperCase directive:

```javascript
  query { 
    input(value: "foo bar") @upperCase 
  }
  // => { input: "FOO BAR" }
```

- Using camelCase directive:

```javascript
  query { 
    input(value: "foo bar") @camelCase 
  }
  // => { input: "fooBar" }
```

- Using startCase directive: 

```javascript
  query { 
    input(value: "foo bar") @startCase 
  }
  // => { input: "Foo Bar" }
```

- Using capitalize directive:

```javascript
  query { 
    input(value: "foo bar") @capitalize 
  }
  // => { input: "Foo var" }
```

- Using kebabCase directive: 

```javascript
  query { 
    input(value: "foo bar") @kebabCase 
  }
  // => { input: "foo-bar" }
```

- Using trim directive:

```javascript
  query { 
    input(value: "  foo bar  ") @trim 
  }
  // => { input: "foo bar" }
```

- Using default directive:

```javascript
  query { 
    input @default(to:"N/A")
  }
  // => { input: "N/A" }
```

- Using toLower directive:

```javascript
  query { 
    input(value: "FOO BAR") @toLower 
  }
  // => { input: "foo bar" }
```

- Using toUpper directive:

```javascript
  query { 
    input(value: "foo bar") @toUpper 
  }
  // => { input: "FOO BAR" }
```

- Using template directive:

```javascript
  query { 
    input(value: "foo bar") @template(as:"${input} ${toUpper(input)}")
  }
  // => { input: "foo bar FOO BAR" }
```

- Using template together with trim and toUpper directives:

```javascript
  query { 
    input(value: "  foo bar   ") @trim @template(as:"${input} ${input}") @toUpper
  }
  // => { input: "FOO BAR FOO BAR" }
```

### License
```
The MIT License (MIT)

Copyright (c) 2016 Lirown

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
