define(['jquery','regis-counter'], function($, counter){
	

	//Login  action
	$('form.login').submit(function(event){
		event.preventDefault();
		var inputs = $(this).serializeArray();
		var formData = {};
		var tmp;
		
		for(var i in inputs){			
			formData[inputs[i].name] = inputs[i].value;
		}
		
		console.log(formData);

		$("input").removeClass("error");
		
		$.post("./login", formData, function( loginAnswer ) {
			
			//offline.checkForLocalRegister( function(error){ counter.loadRegister();  }  );
			/*
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
					}).fail(function(jqXHR, textStatus, errorThrown){
						var errors = jqXHR.responseJSON;
						var talkBubble = $(".talk-bubble");
						talkBubble.empty();
						for(var field in errors){
							talkBubble.append("<p>"+errors[field]+"</p>");
							$("input[name="+field+"]").addClass("error");
						} 	
					});
				}else{
					//Enable offline mode
					window.isOffline = true;
					//save credentials for offline usage
					localStorage['name'] = formData.name;
					localStorage['password'] = formData.password; 
				}
			}
			//show register view
                        counter.loadRegister();
			*/
		}).fail(function(jqXHR, textStatus, errorThrown){
			var errors = jqXHR.responseJSON;
			var talkBubble = $(".talk-bubble");
			talkBubble.empty();
			for(var field in errors){
				talkBubble.append("<p>"+errors[field]+"</p>");
				$("input[name="+field+"]").addClass("error");
			}
		});
	});
});
