function MockRequire() {

    (function (module) {
        var rL = module._load;
        module._load = function (request, parent, isMain) {
            if(_hasMock(request)) {
                console.info('\n[INFO] Require is returning a mock implementation for: ' + request);
                return  _getMock(request);
            }

            // we always need to bypass/reset the cache - if not, some strange errors can occur during the execution of a test suite
            module._cache = [];

            return rL(request, parent, isMain);
        };
    }(require('module')));

    var _mocks = [];

    this.addMock = function(path, mock){
        _mocks[path] = mock;
    };

    function _hasMock(path){
        return _mocks[path] != undefined;
    };

    function _getMock(path){
        return _mocks[path];
    };

    this.resetMocks = function(){
        _mocks = [];
    }

}

module.exports = new MockRequire();