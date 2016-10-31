var chai = require('chai');
chai.use(require('chai-as-promised'));

import { GraphQLString, GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLList, graphql } from 'graphql';
import { applySchemaCustomDirectives } from '../src/index';

import { expect } from 'chai';

exports.createGraphQLQueryDeepObject = function() {
    return new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
            test: {
                type: new GraphQLObjectType({
                    name: 'Test',
                    fields: () => ({
                        input: {
                            type: GraphQLString,
                            resolve: () => '5'
                        },
                        output: {
                            type: GraphQLString,
                            resolve: () => "1"
                        }
                    })
                })
            },
            test2: {
                type: new GraphQLList(new GraphQLObjectType({
                    name: 'Test2',
                    fields: () => ({
                        input: {
                            type: new GraphQLNonNull(GraphQLString)
                        },
                        output: {
                            type: GraphQLString
                        }
                    })
                }))
            }
        })
    });
};


exports.createGraphQLQueryDeepObject = function() {
    return new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
            test: {
                type: new GraphQLObjectType({
                    name: 'Test',
                    fields: () => ({
                        input: {
                            type: GraphQLString,
                            resolve: () => '5'
                        },
                        output: {
                            type: GraphQLString,
                            resolve: () => "1"
                        }
                    })
                })
            },
            test2: {
                type: new GraphQLList(new GraphQLObjectType({
                    name: 'Test2',
                    fields: () => ({
                        input: {
                            type: new GraphQLNonNull(GraphQLString)
                        },
                        output: {
                            type: GraphQLString
                        }
                    })
                }))
            }
        })
    });
};

const createGraphQLQueryVariableObject = exports.createGraphQLQueryVariableObject = function() {
    return new GraphQLObjectType({
        name: 'Query',
        fields: {
            input: {
                type: GraphQLString,
                args: {
                    value: {
                        type: GraphQLString
                    }
                },
                resolve: (_, {value}) => value
            }
        },
        resolve: () => { input: null }
    })
};

const createGraphQLQueryNullObject = exports.createGraphQLQueryNullObject = function() {
    return new GraphQLObjectType({
        name: 'Query',
        fields: {
            input: {
                type: GraphQLString,

                args: {
                    value: {
                        type: GraphQLString,
                        defaultValue: 'N/A'
                    }
                }
            }
        }
    })
};


exports.testNullEqual = function({ directive, query, expected, done }) {
    return testEqual({ directive, query, expected, done, isNull: true })
};

const testEqual = exports.testEqual = function({ directive, query, expected, done, isNull=false }) {

    let schema = new GraphQLSchema({
        directives: directive instanceof Array ? directive : !directive ? [] : [
            directive
        ],
        query: isNull ? createGraphQLQueryNullObject() : createGraphQLQueryVariableObject(),
        resolve: () => {}
    });

    applySchemaCustomDirectives(schema);

    graphql(schema, query, {})
        .then(({data, errors }) => {
            if (errors) {
                console.error(errors);
                throw new Error(errors);
            }
            expect(data).to.eql(expected);
        })
        .then(done, done);
};