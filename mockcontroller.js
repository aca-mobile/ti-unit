function mockController(controllerPath){

    if(!controllerPath){
        console.warn('Please specify path to a controller');
        return;
    }

    var fs = require('fs');

    var controllerSourceCode = fs.readFileSync(controllerPath);
    var dollar;
    dollar = {};

    if(false) {
        console.info(`Current directory: ${process.cwd()}`);
        console.info('This is the source code of the controller: ' + controllerSourceCode);
    }

    // matches all functions only
    // \$(.[a-zA-Z.]+[(]+)+

    // matches all properties (followed by space or =) only
    // \$(.[a-zA-Z.]+[\s=])+

    // original regex
    // var re = /\$(.[a-zA-Z]+)+/g;


    var re = /\$(.[a-zA-Z]+)+/g;
    var reFunctions = /\$(.[a-zA-Z.]+[(]+)+/g ;
    var reProperties = /\$(.[a-zA-Z.]+[\s=])+/g ;

    var usedProperties = new String(controllerSourceCode).match(reProperties);
    var usedFunctions = new String(controllerSourceCode).match(reFunctions);

    usedProperties.forEach(function(item){

        if (item.indexOf('$.') == -1) return;

        var name = item.slice(2);
        var namespaces = name.split('.');
        var firstNamespace = namespaces.shift();
        if(firstNamespace != undefined){
            _pushNamespaces(dollar, firstNamespace, namespaces, true);
        }
    });

    usedFunctions.forEach(function(item){

        if (item.indexOf('$.') == -1) return;

        var name = item.slice(2);
        var namespaces = name.split('.');
        var firstNamespace = namespaces.shift();
        if(firstNamespace != undefined){
            _pushNamespaces(dollar, firstNamespace, namespaces, false);
        }
    });

    function _pushNamespaces(parentNamespace, namespace, list, isProperty){

        // we need to execute them at least twice, code could be improved though
        // eg. $.dateFoo.setValue(moment(selectedDate --> $.dateFoo.setValue

        namespace = namespace.replace(/\[.*$/g, '');
        namespace = namespace.replace(/\[.*$/g, '');
        namespace = namespace.replace(/\([a-zA-Z.]*/g, '');
        namespace = namespace.replace(/\([a-zA-Z.]*/g, '');

        if(!parentNamespace[namespace]){
            if(isProperty){
                parentNamespace[namespace] = {};
            } else {
                parentNamespace[namespace] = function(){};
            }
        }

        var shift = list.shift();
        if(shift != undefined){
            _pushNamespaces(parentNamespace[namespace], shift, list, isProperty);
        }
    }

    return dollar;
}

module.exports = {
    createControllerMock: mockController
}