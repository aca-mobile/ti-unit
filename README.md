# TiUnit
Real unit testing and mocking for Appcelerator Titanium

## INSTALLATION

Currently, the package is not available in a (private) npm repository. Therefore, we have to package it ourselves
before it can be installed.

```
// from within the TiUnit folder (this will create an artifact eg. tiunit-1.0.0.tgz)
npm pack
```

Install it in your project:
```
// from within your project folder
npm install <path.to.your.artifact>/tiunit-1.0.0.tgz --save-dev
```

The above commands should package the module and install it in your projects node_modules folder(will be created if it
does not exist).

From now on, you can use the Ti mock and MockRequire like this:

```
    Ti = require('tiunit/jsca.api.parser').parse();
    MockRequire = require('tiunit/mockrequire');
```

Attention: after the module has been installed, the following

Manual steps:

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

- Configure parser json PENDING explain the difference


    Ti = require('tiunit/jsca.api.parser').parse();
    MockRequire = require('tiunit/mockrequire');


```
Ti = require('./jsca.api.parser').parseFromConfig();
```
or
```
Ti = require('./jsca.api.parser').parse();
```

## How to use it

See PENDING:LINK for more information about Ti, MockRequire, L(), Alloy.CFG and Alloy.Global

