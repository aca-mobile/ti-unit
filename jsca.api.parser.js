/**
 * Parses the jsca.api and returns a mock implementation of the Titanium api.
 *
 * credits to and inspired by mockti.js (https://github.com/janruehling/mockti)
 */
function jscaApiParser(apiPath = __dirname){

    var fs = require('fs');

    var data = JSON.parse(fs.readFileSync(apiPath + '/api.jsca'));

    var Ti;
    Ti = {};

    function _pushNamespaces(parentNamespace, namespace, list, functions, properties){

        if(!parentNamespace[namespace]){
            parentNamespace[namespace] = {};
        }

        var shift = list.shift();
        if(shift != undefined){
            _pushNamespaces(parentNamespace[namespace], shift, list, functions, properties);
        } else {
            functions.forEach(function(func){
                parentNamespace[namespace][func.name] =  function(){};
            });

            properties.forEach(function(prop){
                if(prop.isClassProperty){
                    parentNamespace[namespace][prop.name] = prop.name;
                }
                if(prop.isInstanceProperty){
                    var funcForPropName = prop.name;
                    funcForPropName = funcForPropName.replace(/(^[a-z])/,function (p) { return p.toUpperCase(); } );
                    funcForPropName = 'get' + funcForPropName;
                    parentNamespace[namespace][funcForPropName] = function(){};
                }
            });

        }
    }

    data.types.forEach(function (item) {
        if (item.name.indexOf('Titanium.') == -1) return;

        var name = item.name.slice(9);
        var namespaces = name.split('.');
        var firstNamespace = namespaces.shift();
        if(firstNamespace != undefined){
            _pushNamespaces(Ti, firstNamespace, namespaces, item.functions ? item.functions : [], item.properties ? item.properties : []);
        }
    });

    return Ti;
}

/**
 * In order to parse your local sdk's api.jsca, you have to:
 * - create /spec/support/parser.json
 * - add a property 'path' with as value the folder of your SDKs api.jsca
 * - add /spec.support/parser.json to .gitignore so that it does not conflict with other developers
 *
 * .. or you can call #parse and copy your SDKs api.jsca to your /spec folder.
 */
function parseFromConfig(){
    var fs = require('fs');
    var data = JSON.parse(fs.readFileSync('./spec/support/parser.json'));
    if(data.path){
        return jscaApiParser(data.path);
    } else {
        throw "path to local Titanium jsca.json is not correctly defined";
    }

}

module.exports = {
    parse: jscaApiParser,
    parseFromConfig: parseFromConfig
}