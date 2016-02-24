var express = require('express');
var pouchdb = require('pouchdb').defaults({db: require('memdown')});
var pouchApp = require('express-pouchdb')(pouchdb);
pouchdb.plugin(require('pouchdb-list'));

var app = express();
app.use(pouchApp);
app.listen(5984);
console.log("PouchDB Test Server started on default port (5984)");
