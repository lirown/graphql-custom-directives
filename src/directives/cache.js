const {graphql, GraphQLString, GraphQLInt, GraphQLList} = require('graphql');
const {GraphQLCustomDirective} = require('../custom');
const {DirectiveLocation} = require('../directiveLocation');
const lru = require('lru-cache');

let cacheStore = lru({maxAge: 10000, max: 10000});

// Native getter
const get = (obj, path, defaultValue) => {
  const result = String.prototype.split
    .call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce(
      (res, key) => (res !== null && res !== undefined ? res[key] : res),
      obj,
    );
  return result === undefined || result === obj ? defaultValue : result;
};

function keyByPath({fieldNodes, path}) {
  let [key] = fieldNodes[0].arguments
    .filter(({name: {value}}) => value === path)
    .map(({value: {value, values}}) => value || values.map(({value}) => value));

  return key;
}

function resolveFromCacheOrNot({fieldNodes, resolve, path}) {
  const key = keyByPath({fieldNodes, path});

  // TODO: supoprt more levels
  // console.log('cache get', key);
  const cachedData = cacheStore.get(key);

  if (cachedData) {
    // console.log('taken from cache:', path, cachedData);
    return Promise.resolve(cachedData);
  } else {
    return resolve().then(result => {
      // console.log('cache set', key, result);
      cacheStore.set(key, result);
      return result;
    });
  }
}

function executeWarmCacheQueries({ path, warmPath, context, info }) {
  const { fieldNodes, schema } = info
  const key = keyByPath({fieldNodes, path});
  const keys = keyByPath({fieldNodes, path: warmPath});
  const warmCacheQueries = [];

  keys.map(value => {
    const requestQuery = context.req.body.query
      .replace(key, value)
      .replace(`, warmPath: "${warmPath}"`, '');
      // console.log(requestQuery);
    warmCacheQueries.push(graphql(schema, requestQuery));
  });
  Promise.all(warmCacheQueries);
}

exports.cacheStore = cacheStore;

exports.GraphQLCacheDirective = new GraphQLCustomDirective({
  name: 'cache',
  locations: [DirectiveLocation.FIELD],
  description: 'Fetch resolved result from cache',
  args: {
    maxAge: {
      type: GraphQLInt,
      description: 'A time defined when the cache expire',
    },
    max: {
      type: GraphQLInt,
      description: 'A limit of the number of elements in cache',
    },
    path: {
      type: GraphQLString,
      description: 'A path in variables to extract the key for the cache',
    },
    warmPath: {
      type: new GraphQLList(GraphQLString),
      description: 'A path in variables to extract the keys to pre-warm cache',
    },
  },
  resolve: (
    resolve,
    root,
    {maxAge = 15000, max = 1000, path, warmPath},
    context,
    info,
  ) => {
    const {fieldNodes} = info;

    if (!path) {
      return resolve();
    }

    if (!cacheStore) {
      cacheStore = lru({maxAge, max});
      // console.log('create cache');
    }

    if (warmPath) {
      executeWarmCacheQueries({info, path, warmPath, context});
    }
    return resolveFromCacheOrNot({fieldNodes, resolve, path});
  },
});
