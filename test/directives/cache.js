const {GraphQLCacheDirective, cacheStore} = require('../../dist/index');
const {testEqual} = require('../utils');

const {expect} = require('chai');
const schema = `
  type Query { 
    value(input: String, id: String, ids: [String]): String 
  } 
  schema { 
    query: Query 
  }
`;

const resolve = (source, {input, id}) =>
  new Promise(resolve => {
    setTimeout(() => resolve(`${id}-${input * 10}`), 2000);
  });

describe.only('directives/cache', function() {
  this.timeout(10000);
  it('expected to have name property', () => {
    expect(GraphQLCacheDirective.name).to.a('string');
  });

  it('expected to have description property', () => {
    expect(GraphQLCacheDirective.description).to.a('string');
  });

  it('expected to have args properties', () => {
    expect(GraphQLCacheDirective.args).to.a('array');
  });

  it('expected to have locations list', () => {
    expect(GraphQLCacheDirective.locations).to.a('array');
  });

  it('expected to have resolve function', () => {
    expect(GraphQLCacheDirective.resolve).to.be.function;
  });

  it('expected regular execution of graphql', done => {
    const query = `{ value }`,
      directives = [GraphQLCacheDirective],
      expected = {value: null};

    testEqual({directives, query, expected, done});
  });

  it('expected directive to alter execution of graphql and store result in cache', done => {
    const query = `{ value(id: "a1", input: "10") @cache(path: "id") }`,
      directives = [GraphQLCacheDirective],
      expected = {value: 'a1-100'};

    expect(cacheStore.get('a1')).to.be.equal(undefined);
    testEqual({
      resolve,
      directives,
      query,
      schema,
      expected,
    }).then(() => {
      expect(cacheStore.get('a1')).to.be.equal('a1-100');
      done();
    });
  });

  it('expected directive to alter execution of graphql and pick result from cache', done => {
    const query = `{ value(id: "a1", input: "10") @cache(path: "id") }`,
      directives = [GraphQLCacheDirective],
      expected = {value: 'a1-100'};

    expect(cacheStore.get('a1')).to.be.equal('a1-100');
    testEqual({
      resolve,
      directives,
      schema,
      query,
      expected,
    }).then(x => {
      expect(cacheStore.get('a1')).to.be.equal('a1-100');
      done();
    });
  });

  it('expected directive to warm cache execution of graphql and store result in cache', done => {
    const query = `{ value(id: "b1", input: "5", ids: ["a2", "a3"]) @cache(path: "id", warmPath: "ids") }`,
      directives = [GraphQLCacheDirective],
      expected = {value: 'b1-50'};

    expect(cacheStore.get('b1')).to.be.equal(undefined);
    testEqual({
      resolve,
      directives,
      query,
      schema,
      expected,
    }).then(() => {
      expect(cacheStore.get('b1')).to.be.equal('b1-50');
      done();
    });
  });

  it('expected directive to fast execute the first key stored from cache', done => {
    const query = `{ value(id: "a2", input: "5") @cache(path: "id") }`,
      directives = [GraphQLCacheDirective],
      expected = {value: 'a2-50'};

    expect(cacheStore.get('a2')).to.be.equal('a2-50');
    testEqual({
      resolve,
      directives,
      query,
      schema,
      expected,
    }).then(() => {
      expect(cacheStore.get('a2')).to.be.equal('a2-50');
      done();
    });
  });

  it('expected directive to fast execute the second key stored from cache', done => {
    const query = `{ value(id: "a3", input: "5") @cache(path: "id") }`,
      directives = [GraphQLCacheDirective],
      expected = {value: 'a3-50'};

    expect(cacheStore.get('a3')).to.be.equal('a3-50');
    testEqual({
      resolve,
      directives,
      query,
      schema,
      expected,
    }).then(() => {
      expect(cacheStore.get('a3')).to.be.equal('a3-50');
      done();
    });
  });
});
