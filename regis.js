var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require,
    "paths": {
      "common": "./client/js/common",
    }
});

requirejs(['hello','express','body-parser', 'express-session', 'cookie-parser', 'consolidate','server/routes'], function(hello, express, bodyParser, session, cookieParser, cons, routes){
	var app = express();
	// assign the swig engine to .html files
	app.engine('html',cons.swig);
	//app.engine('tpl', cons.swig);
	
	// set .html as the default extension 
	app.set('view engine', 'html');
	app.set('views', __dirname + '/client/views');
	
	
	//Parse query body for POST request handling
	app.use(bodyParser());
	
	//Setup session
	app.use(cookieParser());
	app.use(session({ secret: '4679307774', key: 'regisid', cookie: { httpOnly: false }}))
	
	//Setup routes
	routes(app, __dirname, __dirname + '/server/data/');


	//Serve static files from the client dir
	app.use(express.static(__dirname + '/client'));

	//start HTTP server and listen for query
	var server = app.listen(3000, function() {
		hello.say("Hello Carole!");
    	console.log('Listening on port %d', server.address().port);
	});
});
