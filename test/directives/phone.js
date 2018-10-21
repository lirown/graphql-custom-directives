import {GraphQLPhoneDirective} from '../../src/index';
import {testEqual} from '../utils';

import {expect} from 'chai';

describe('directives/currency', () => {
  it('expected to have name property', () => {
    expect(GraphQLPhoneDirective.name).to.a('string');
  });

  it('expected to have description property', () => {
    expect(GraphQLPhoneDirective.description).to.a('string');
  });

  it('expected to have args properties', () => {
    expect(GraphQLPhoneDirective.args).to.a('array');
  });

  it('expected to have locations list', () => {
    expect(GraphQLPhoneDirective.locations).to.a('array');
  });

  it('expected to have resolve function', () => {
    expect(GraphQLPhoneDirective.resolve).to.be.function;
  });

  it('expected regular execution of graphql', done => {
    const query = `{ value }`,
      directives = [GraphQLPhoneDirective],
      expected = {value: null};
    testEqual({directives, query, expected, done});
  });

  it('expected regular execution of graphql in case of wrong format', done => {
    const query = `{ value(input: "abc") @phone }`,
      directives = [GraphQLPhoneDirective],
      expected = {value: 'abc'};
    testEqual({directives, query, expected, done});
  });


  it('expected directive to alter execution of graphql and result international formatted phone as default', done => {
    const query = `{ value(input: "+12133734253") @phone }`,
      directives = [GraphQLPhoneDirective],
      expected = {value: '+1 213 373 4253'};

    testEqual({directives, query, expected, done});
  });

  it('expected directive to alter execution of graphql and result international formatted phone', done => {
    const query = `{ value(input: "+12133734253") @phone(as: "INTERNATIONAL") }`,
      directives = [GraphQLPhoneDirective],
      expected = {value: '+1 213 373 4253'};

    testEqual({directives, query, expected, done});
  });

  it('expected directive to alter execution of graphql and result uri formatted phone', done => {
    const query = `{ value(input: "+12133734253") @phone(as: "RFC3966") }`,
      directives = [GraphQLPhoneDirective],
      expected = {value: 'tel:+12133734253'};

    testEqual({directives, query, expected, done});
  });

  it('expected directive to alter execution of graphql and result national formatted phone', done => {
    const query = `{ value(input: "+12133734253") @phone(as: "NATIONAL") }`,
      directives = [GraphQLPhoneDirective],
      expected = {value: '(213) 373-4253'};

    testEqual({directives, query, expected, done});
  });


  it('expected directive to alter execution of graphql and result the original value', done => {
    const query = `{ value(input: "test") @phone }`,
      directives = [GraphQLPhoneDirective],
      expected = {value: 'test'};

    testEqual({directives, query, expected, done});
  });
});
