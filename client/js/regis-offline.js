define(['jquery','web-storage','common/controller'],function($, storage, controller){
	var offlineCredentials = false;
	var data = storage();

	var errorCallback = function(errorData){
		window.regisErrorHandler({ responseJSON: errorData });
	};


	//Load the records from the table to local storage
	var localeLoadCurrentRegister = function( callback ){
		var records = [];
		$('tbody tr').each(function(){
			var record = {};
			record.id = $(this).data("id");
			$(this).find('td').each(function(){
				record[$(this).data('colname')] = $(this).text();
				if( $(this).data('colname') === 'password' ){
					record[$(this).data('colname')] = $(this).data('plain');
				}
			});
			records.push(record);
		});

		//sort by ids
		records.sort(function(a, b){
			if( a.id < b.id ) return -1;
			if( a.id > b.id ) return 1;
			return 0;	
		});

		//Serialize
		var newRegister = '';
		for(var i in records){
			newRegister += data.serializeRecord( records[i], offlineCredentials );
		}
		
		data.overwriteRegister( offlineCredentials, newRegister, callback );
	};

	function deserializeAjaxData(params){
       		  if(!params){
			return {};
		  } 
		  //deserialize params string
		  params = params.split('&');
		  var tmp, dataObj = {};
		  for(var i in params){
			tmp = params[i].split('=');
			dataObj[tmp[0]] = tmp[1];
		  }
		return dataObj;
	};
	
	//Trap AJAX requests when in offline mode
	$( document ).ajaxSend(function( event, jqxhr, ajaxSettings ) {
		if( !window.isOffline  ){
			return;
		}
		
		//abort the request
		jqxhr.abort();
		
		var action = ajaxSettings.url;
        
          	//deserialize params string
          	var dataObj = deserializeAjaxData( ajaxSettings.data );

		var myController = controller(data, ajaxSettings.success, errorCallback);
                myController.process(action, dataObj, offlineCredentials );

	});

	//Detect lose of connection
	$( document ).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
	
 	  //Don't handle ajax errors in offline mode
	  if( window.isOffline  ){
		return;
	  } 

	  var action = ajaxSettings.url;
	
	  //deserialize params string
	  var dataObj = deserializeAjaxData( ajaxSettings.data );

	  var myController = controller(data, ajaxSettings.success, errorCallback);

	  if(!offlineCredentials){
	  	var offlineMode = confirm(
	  		"It appears you lost connection to the server.\n"+
	  		"You can choose to continue and work offline, all the changes you make to the register "+
	  		"will be stored locally on your device.\n"+
	  		"Next time you connect to the server your local changes will be applied to the online register.\n"+
	  		"Do you want to work offline?"
	  	);
	  
	  	if(!offlineMode){
	  		alert("Your last action was cancelled!");
	  		return;
	  	}
		
		var username = prompt("Please enter your user name to continue.");
		if(username === null){
	  		alert("Your last action was cancelled!");
	  		return;
	  	}

		var password = prompt("Please enter your password to continue.");
		if(password === null){
	  		alert("Your last action was cancelled!");
	  		return;
	  	}

		//Save credentials
		
		offlineCredentials = {
			name: username,
			password: password
		};

		//Load the register to locale storage and continue the action
		localeLoadCurrentRegister(function(){
          		myController.process(action, dataObj, offlineCredentials );
		});
		return;
	  }
	
	 	  
          myController.process(action, dataObj, offlineCredentials );
	  
	});

	var offline = {};

	offline.checkForLocalRegister = function(credentials, callback){
		var registerKey = data.getRegisterName(credentials);
                var registerData = localStorage[registerKey];
		if( registerData ){
                                var uploadLocal = confirm(
                                        "You have unsynchronized local changes in your register, would you like to "+
                                        "upload your changes now? If you do not upload your changes now, you'll"+
                                        "be logged into your offline register where you can consult and edit "+
                                        "the records stored locally and synchronize them with the server later on." 
                                );

                                if( uploadLocal ){
                                        var regHash = data.getRegisterHash( registerData );
                                        $.post("./regis/upload",{register: registerData, hash: regHash}, function( answer ){
                                                console.log( answer );
						callback();
                                        }).fail(function(jqXHR, textStatus, errorThrown){
                                                var errors = jqXHR.responseJSON;
                                                var talkBubble = $(".talk-bubble");
                                                talkBubble.empty();
                                                for(var field in errors){
                                                        talkBubble.append("<p>"+errors[field]+"</p>");
                                                        $("input[name="+field+"]").addClass("error");
                                                }
						callback(true);
                                        });
                                }else{
                                        //Enable offline mode
                                        window.isOffline = true;
                                        //save credentials for offline usage
					offlineCredentials = {
						name: credentials.name,
						password: credentials.password
					};                             
                                }
                        }
                        //show register view
                        callback();
	};

	return offline;
});
