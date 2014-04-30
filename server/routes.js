define(['server/file-storage','common/controller'], function(fileStorage, controller){

	var isLoggedIn = function(session){
		if(session.atTheServiceOf){
			return true;
		}
		
		return false;
	};	

	var routes = function(app, __dirname, dataFolder){
		//Interface to  register data on the hard drive
	    	data = fileStorage(dataFolder);


		
		app.all('*', function(req, res, next){
			app.set('views', __dirname + '/client/views');	
			next();
		});		
		

		//No session routes
		app.get('/', function(req, res){
			  //return view filled with data
			  res.render('regis');
		});
		
		app.post('/login', function(req, res){
			var credentials = {
				name: req.body["name"] ? req.body["name"].trim() : "",
				password: req.body["password"] ? req.body["password"].trim() : "",				
			}
			
			if(credentials.name != "" && credentials.password != ""){
			     	var sess = req.session;
				sess.atTheServiceOf = credentials;
				res.send(200,{});
				return;
			}
			
			res.send(400, {name: 'You must provide a user name and a password.'});
		});

		app.get('/isLoggedIn', function(req, res){
			res.set('Content-Type','application/json');
			var loggedIn = isLoggedIn(req.session);
			res.send(200,{
				status: loggedIn ? true : false,
				registerName: loggedIn ? data._getRegisterName(req.session.atTheServiceOf) : null
			});
		});
		
		app.get('/logout', function(req, res){	
			var sess = req.session;
			sess.atTheServiceOf = undefined;
			res.redirect('/');				 
		});
		
		//Logged in routes
		app.all('/regis/*', function(req, res, next){
			//Will answer with some JSON
			res.set('Content-Type','application/json');
			
			if( !isLoggedIn(req.session) ){
				console.log("Not logged in");
				res.send(400, {login: 'You must login before you can do any operation!' });
				return;
			}
			
			var successCallback = function( returnValue  ){
				res.send(200, returnValue);
			};

			var errorCallback = function( returnValue ){
				res.send(400, returnValue );
			};

			controller = controller(data, successCallback, errorCallback);
			controller.process(req.url, req.body, req.session.atTheServiceOf);
		});

		//Test routes
		app.all('/tests/*', function(req, res, next){
			console.log(req)
			if( req.route.params[0] == '' || req.route.params[0].match(/\.html$/)){
				app.set('views', __dirname + '/client/tests/views');	
				res.render( req.route.params[0] );
			}else{
				next();
			}

		});

	};
	
	return routes;
});
