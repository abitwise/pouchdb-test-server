# PouchDB Test Server

PouchDB Test Server is meant to be used for testing or automated testing. It starts up fast, stores data in memory
and when you close it, data will be deleted. No hassle, no command line parameters, it just works.

## Features

- Runs as express.js application, uses default port (5984)
- Supports CouchDB/PouchDB API (express-pouchdb), you can use CouchDB [nano](https://www.npmjs.com/package/nano) library in your project
- Supports map & reduce and also [list functions](http://guide.couchdb.org/editions/1/en/transforming.html) (pouchdb-list plugin), pouchdb-server doesn't support list functions
- Web interface is Fauxton, accessible via [/_utils/](http://localhost:5984/_utils/)  

## How to install

``` bash
npm install
```

## How to start
``` bash
npm start
```

## Worth mentioning
- log.txt stores logs about DB operations, so you can delete it when you don't need it anymore. It's useful for debugging your code.
- config.json stores configuration for express-pouchdb, you can delete this file

## How to use PouchDB in your integration tests
Sometimes there is a need for integration tests that test designs (views and lists) together with some other logic which form a solution.
So you identify a need to test, but you still want these tests to run reasonably fast so the feedback cycle isn't more than few seconds.

Add following function to helper module used by your automated tests:

``` javascript
function startPouchDbServer() {
    var express = require('express');
    var pouchdb = require('pouchdb').defaults({db: require('memdown')});
    var pouchApp = require('express-pouchdb')(pouchdb);
    pouchdb.plugin(require('pouchdb-list'));

    var app = express();
    app.use(pouchApp);
    return app.listen(5984);
};
```

This function returns server, which you can store in a variable to close the server later with following command:

``` javascript
server.close();
```

## How to migrate data to CouchDB/PouchDB
You should create a migration module, I may create library for this in near future. Unfortunately I did not find any migration
library for CouchDB/PouchDB. I'll explain some steps.

### Step 1: Creating database (if it does not exist)

``` javascript
var name = 'example_db';
nano.db.get(name, function(err, body) {
    if (err) {
        nano.db.create(name, function(err, body) { /*Defer or call callback*/ });
    }
});
```

### Step 2: Creating designs
Designs can be overwritten and it will not cause index rebuild if the design is not changed. If the design is
changed, index will be rebuilt and it can take time depending on the setup and data size. So please take this
into consideration when you change designs.

```javascript
var designObject = {
    _id: "_design/example_design",
    views: {
        count: {
            map: "function(doc) { emit(doc, 1); }",
            reduce: "function(keys, values) { return sum(values); }"
        }
    },
    lists: {}
};

var exampleDb = nano.db.use('example_db');

exampleDb.get(designObject._id, function(err, body) {
    if (err) {
        exampleDb.insert(designObject, function(err, body) { /*Defer or call callback*/ });
    } else {
        designObject._rev = body._rev;
        exampleDb.insert(designObject, function(err, body) { /*Defer or call callback*/ })
    }
});
```
