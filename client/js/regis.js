define(['jquery','regis-counter','regis-offline'], function($, counter, offline){

  var genericErrorHandler = function(jqXHR, textStatus, errorThrown){
		var errors = jqXHR.responseJSON;
		var talkBubble = $(".talk-bubble");
		talkBubble.empty();
		for(var field in errors){
			talkBubble.append("<p>"+errors[field]+"</p>");
			$("input[name="+field+"]").addClass("error");
		}
   };
 
  $(document).ready(function(){
	//Check if the user is logged in
	$.get('/isLoggedIn', function(answer){
		if( answer.status ){
			//Check if the user has local changes
			if( localStorage[answer.registerName ] ){
				//local changes found, show login form
				return;
			}
			//show register view in online mode
                        counter.loadRegister();
		}else{
			//show login form
		}
	});

	//register the error handler
	window.regisErrorHandler = genericErrorHandler;

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
                
                $.post("/login", formData, function( loginAnswer ) {
                        offline.checkForLocalRegister( formData, function(error){ counter.loadRegister();  }  );
                }).fail( genericErrorHandler );
        });

  });

});
