requirejs.config({
    "baseUrl": "./js",
    "paths": {
      //Regis lives on the bleeding edge, he does not care for IE < 9
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min"
    }
});

// Load the main app module to start the app
requirejs(["regis"]);
