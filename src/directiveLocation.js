/**
 * Resolve DirectiveLocation with fallback due to graphql breacking changes of module location
 */
let DirectiveLocation;
try {
  DirectiveLocation = require('graphql/language/directiveLocation')
} catch (e) {
  /* istanbul ignore next */
  DirectiveLocation = require('graphql/type/directives')
}

module.exports = DirectiveLocation
