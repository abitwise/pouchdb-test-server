# PouchDB Test Server

PouchDB Test Server is meant to be used for testing or automated testing. It starts up fast, stores data in memory
and when you close it, data will be deleted. No hassle, no command line parameters, it just works.

## Features

- Runs as express.js application, uses default port (5984)
- Supports CouchDB/PouchDB API (express-pouchdb), you can use nano library
- Supports Map & reduce and also list functions (pouchdb-list plugin), pouchdb-server doesn't support list functions
- Web interface is Fauxton, accessible via [/_utils/](http://localhost:5984/_utils/)  

## How to install

```
npm install
```

## How to start
```
npm start
```

## Worth mentioning
- log.txt stores logs about DB operations, so you can delete it when you don't need it anymore. It's useful for debugging your code.
- config.json stores configuration for express-pouchdb, you can delete this file
