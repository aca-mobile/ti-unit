# TiUnit
Real unit testing and mocking for Appcelerator Titanium

## INSTALLATION

See https://github.com/aca-mobile/ti-unit/wiki

Attention: after the module has been installed, the following manual steps should be executed:

- Copy the 2 files under <project>/node_modules/tiunit/helper/ to <project>/spec/helpers
- Copy the file <project>/node_modules/tiunit/support/parser.json to <project>/spec/support
- Add the entry "helpers/underscore-jasmine.js" to the helpers section of spec/helpers/jasmine.json

```
{
  "spec_dir": "spec",
  "spec_files": [
    "**/*[sS]pec.js"
  ],
  "helpers": [
    "helpers/**/*.js",
    "helpers/underscore-jasmine.js"
  ],
  "stopSpecOnExpectationFailure": false,
  "random": false
}
```

## How to use it

From now on, you can use the Ti mock and MockRequire like this:

```
// create a mock for the Ti namespace based on your own local api.jsca
Ti = require('./jsca.api.parser').parseFromConfig();

// or create on based on the embedded api.jsca
Ti = require('./jsca.api.parser').parse();

MockRequire = require('tiunit/mockrequire');
```
For more information, see https://github.com/aca-mobile/ti-unit/wiki

See PENDING:LINK for more information about Ti, MockRequire, L(), Alloy.CFG and Alloy.Global

