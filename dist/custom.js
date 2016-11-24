'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _directives = require('graphql/type/directives');

var _graphql = require('graphql');

var DEFAULT_DIRECTIVES = ['skip', 'include'];

/**
 * If a resolve function is not given, then a default resolve behavior is used
 * which takes the property of the source object of the same name as the field
 * and returns it as the result, or if it's a function, returns the result
 * of calling that function.
 */
function defaultResolveFn(source, args, context, info) {
	var fieldName = info.fieldName;
	// ensure source is a value for which property access is acceptable.
	if ((typeof source === 'undefined' ? 'undefined' : _typeof(source)) === 'object' || typeof source === 'function') {
		return typeof source[fieldName] === 'function' ? source[fieldName]() : source[fieldName];
	}
}

/**
 * resolving field using directive resolver
 */
function resolveWithDirective(resolve, source, directive, context, info) {
	var directiveConfig = info.schema._directives.filter(function (d) {
		return directive.name.value === d.name;
	})[0];

	var args = {};

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = directive.arguments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var arg = _step.value;

			args[arg.name.value] = arg.value.value;
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return directiveConfig.resolve(resolve, source, args, context, info);
};

/**
 * parse directives from a schema defenition form them as graphql directive structure
 */
function parseSchemaDirectives(directives) {
	var schemaDirectives = [];

	if (!directives || !(directives instanceof Object) || Object.keys(directives).length === 0) {
		return [];
	}

	var _loop = function _loop(directiveName) {
		var argsList = [],
		    args = '';

		Object.keys(directives[directiveName]).map(function (key) {
			argsList.push(key + ':"' + directives[directiveName][key] + '"');
		});

		if (argsList.length > 0) {
			args = '(' + argsList.join(',') + ')';
		}

		schemaDirectives.push('@' + directiveName + args);
	};

	for (var directiveName in directives) {
		_loop(directiveName);
	}

	return (0, _graphql.parse)('{ a: String ' + schemaDirectives.join(' ') + ' }').definitions[0].selectionSet.selections[0].directives;
};

/**
 * If the directive is defined on a field it will execute the custom directive
 * resolve right after executing the resolve of the field otherwise it will execute
 * the original resolve of the field
 */
function resolveMiddlewareWrapper() {
	var resolve = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultResolveFn;
	var directives = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var serverDirectives = parseSchemaDirectives(directives);

	return function (source, args, context, info) {
		var directives = serverDirectives.concat(info.fieldASTs[0].directives);
		var directive = directives.filter(function (d) {
			return DEFAULT_DIRECTIVES.indexOf(d.name.value) === -1;
		})[0];

		if (!directive) {
			return resolve(source, args, context, info);
		}

		var defer = resolveWithDirective(function () {
			return Promise.resolve(resolve(source, args, context, info));
		}, source, directive, context, info);

		if (directives.length <= 1) {
			return defer;
		}

		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			var _loop2 = function _loop2() {
				var directiveNext = _step2.value;

				defer = defer.then(function (result) {
					return resolveWithDirective(function () {
						return Promise.resolve(result);
					}, source, directiveNext, context, info);
				});
			};

			for (var _iterator2 = directives.slice(1)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				_loop2();
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}

		return defer;
	};
};

/**
 * Scanning the shema and wrapping the resolve of each field with the support
 * of the graphql custom directives resolve execution
 */
function wrapFieldsWithMiddleware(fields) {

	for (var label in fields) {
		var field = fields.hasOwnProperty(label) ? fields[label] : null;

		if (!!field && (typeof field === 'undefined' ? 'undefined' : _typeof(field)) == 'object') {
			field.resolve = resolveMiddlewareWrapper(field.resolve, field.directives);
			if (field.type._fields) {
				wrapFieldsWithMiddleware(field.type._fields);
			} else if (field.type.ofType && field.type.ofType._fields) {
				wrapFieldsWithMiddleware(field.type.ofType._fields);
			}
		}
	}
}

/**
 * create a new graphql custom directive which contain a resolve
 * function for altering the execution of the graphql
 */
exports.GraphQLCustomDirective = function (config) {
	var directive = new _directives.GraphQLDirective(config);

	if (config.resolve) {
		directive.resolve = config.resolve;
	}

	return directive;
};

/**
 * Apply custom directives support in the graphql schema
 */
exports.applySchemaCustomDirectives = function (schema) {

	if (!(schema instanceof _graphql.GraphQLSchema)) {
		throw new Error('Schema must be instanceof GraphQLSchema');
	}

	wrapFieldsWithMiddleware(schema._queryType._fields);

	return true;
};