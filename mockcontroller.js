function mockController(controllerPath) {
	var START_SLICE_POSITION = 2;

	if (!controllerPath) {
		console.warn('Please specify path to a controller');
		return;
	}

	var fs = require('fs');

	var controllerSourceCode = fs.readFileSync(controllerPath);
	var dollar = {};

	// matches all functions only
	var reFunctions = /\$(.[a-zA-Z.]+[(]+)+/g;

	// matches all properties (followed by space or =) only
	var reProperties = /\$(.[a-zA-Z.]+[\s=])+/g;

	var usedProperties = _findAndReturnMatchesArray(controllerSourceCode, reProperties);
	var usedFunctions = _findAndReturnMatchesArray(controllerSourceCode, reFunctions);

	usedProperties.forEach(function(item){
		_handleNameSpaces(item, true);
	});

	usedFunctions.forEach(function(item){
		_handleNameSpaces(item, false);
	});

	function _handleNameSpaces(item, isProperty) {
		if (item.indexOf('$.') == -1) return;

		var name = item.slice(START_SLICE_POSITION);
		var namespaces = name.split('.');
		var firstNamespace = namespaces.shift();

		if(!_.isUndefined(firstNamespace)){
			_pushNamespaces(dollar, firstNamespace, namespaces, isProperty);
		}
	}

	function _pushNamespaces(parentNamespace, namespace, list, isProperty) {
		// in order to isolate the namespace without any additional characters, the regex must be executed twice.
		// otherwise, function calls within a function call on a root namespace object, will be contained within the namespace too.
		// eg. in the first run, the expression captures the following result:
		// $.dateFoo.setValue(moment(selectedDate
		// to get rid of the function call within our namespace function call, we need to execute the regex a second time, giving us:
		// $.dateFoo.setValue

		namespace = namespace.replace(/\[.*$/g, '');
		namespace = namespace.replace(/\[.*$/g, '');
		namespace = namespace.replace(/\([a-zA-Z.]*/g, '');
		namespace = namespace.replace(/\([a-zA-Z.]*/g, '');

		if (!parentNamespace[namespace]) {
			if (isProperty) {
				parentNamespace[namespace] = {};
			} else {
				parentNamespace[namespace] = function () {
				};
			}
		}

		var shift = list.shift();
		if (shift != undefined) {
			_pushNamespaces(parentNamespace[namespace], shift, list, isProperty);
		}
	}

	function _findAndReturnMatchesArray(source, regEx) {
		var matches = new String(source).match(regEx);
		matches = _.isNull(matches) ? [] : matches;
		return matches;
	}

	return dollar;
}

module.exports = {
	createControllerMock: mockController
};