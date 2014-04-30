var express = require('express');
var app = express();

//start HTTP server and listen for query
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
