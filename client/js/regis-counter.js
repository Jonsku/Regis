define(['jquery','templates'], function($, templates){
	

	$(document).ready(function(){
		//Add action
		$('form.add').submit(function(event){
			event.preventDefault();
			var inputs = $(this).serializeArray();
			var formData = {};
			var tmp;
		
			for(var i in inputs){			
				formData[inputs[i].name] = inputs[i].value;
			}
		
			console.log(formData);
		
			$("input").removeClass("error");
		
			$.post("/regis/add", formData, function( data ) {
				//window.location = ".";
			}).fail(function(jqXHR, textStatus, errorThrown){
				var errors = jqXHR.responseJSON;
				var talkBubble = $(".talk-bubble");
				talkBubble.empty();
				for(var field in errors){
					talkBubble.append("<p>"+errors[field]+"</p>");
					$("form.add input[name="+field+"]").addClass("error");
				}
			});
		
		});
	
	
		//Save edit action
		$('form.update').submit(function(event){
			event.preventDefault();
			var inputs = $(this).serializeArray();
			var formData = {};
			var tmp;
		
			for(var i in inputs){			
				formData[inputs[i].name] = inputs[i].value;
			}
		
		
			console.log(formData);
		
			$("input").removeClass("error");
		
			$.post("/regis/update", formData, function( data ) {
				//window.location = ".";
			}).fail(function(jqXHR, textStatus, errorThrown){
				var errors = jqXHR.responseJSON;
				var talkBubble = $(".talk-bubble");
				talkBubble.empty();
				for(var field in errors){
					talkBubble.append("<p>"+errors[field]+"</p>");
					$("form.update input[name="+field+"]").addClass("error");
				}
			});
		});
	
	});
	
	var counter = {};

	counter.enableButtons = function(){	
		//Delete action
		$('button.delete').click(function(event){
			event.preventDefault();
			var recordId = $(this).parents('tr').data("id");
			var answer = confirm("Are you sure you want to delete record #"+recordId+" ?");
			if(!answer){
				return;
			}
			$.post("/regis/delete", {recordId: recordId}, function( data ) {
				counter.deleteRecord( data.deletedId );
			}).fail(function(jqXHR, textStatus, errorThrown){
				console.log(jqXHR);
				console.log(textStatus)
			});
		});
	
		//Edit action
		$('button.edit').click(function(event){
			event.preventDefault();
		
			var editedRow = $(".editMode");
			if( editedRow.length > 0){
				var goAhead = confirm("You are already editing a record.\n"+
					"If you edit another one all the unsaved changes will be lost.\n"+
					"Are you sure you want to edit another record without saving?");
				if(!goAhead){
					return;
				}
			
				//Cancel editing of the previous row
				editedRow.find(".cancel").click();
			}
		
			var row = $(this).parents('tr');
			row.addClass("editMode");
		
			//only modify cols that contain data		
			row.find('td[data-colname]').each(function(){
				//Save current data
				var columnName = $(this).data('colname');
				var currentValue = columnName == 'password' ? $(this).data('plain') : $(this).text();
				$(this).attr('data-saved', currentValue);
			
				//Show form input
				var inputHTML = "";
			
				if(columnName == "description"){
					inputHTML = '<textarea placeholder="Description" name="description">'+currentValue+'</textarea>'; 
				}else{
					inputHTML = '<input type="text" placeholder="'+columnName+'" name="'+columnName+'" value="'+(""+currentValue).replace(/"/g,'&quot;')+'">';
				}
			
				if(columnName == "name"){ //add hidden record id
					inputHTML += '<input type="hidden" name="recordId" value="'+row.data('id')+'">';
				}
			
				$(this).html(inputHTML);	
			});
		});
	
		//Cancel edit action
		$('button.cancel').click(function(event){
			event.preventDefault();
			var row = $(this).parents('tr');
			row.removeClass("editMode");
		
			row.find('td[data-colname]').each(function(){
				//Remove form input and reset values
				var columnName = $(this).data('colname');
			
				var contentHTML = "";
			
				if(columnName == "description"){
					contentHTML = '<pre>' + templates.escapeHtml( $(this).data('saved') ) + '</pre>';
				}else if(columnName == "password"){
					contentHTML = '********';
				}else{
					contentHTML =  templates.escapeHtml( $(this).data('saved') );			
				}
			
				$(this).html(contentHTML);
				$(this).removeAttr('data-saved');
			});	
		});
	};

	counter.loadRegister = function(){
		counter.clearRegister();
		$.post('/regis/download', function(answer){
			var row;
			var tbody = $("tbody");
			for(var i in answer.records){
				tbody.append(templates.renderRecord( answer.records[i] ));
			}			
			counter.enableButtons();
		}).fail(function(jqXHR, textStatus, errorThrown){
			var errors = jqXHR.responseJSON;
			var talkBubble = $(".talk-bubble");
			talkBubble.empty();
			for(var field in errors){
				talkBubble.append("<p>"+errors[field]+"</p>");
				$("form.update input[name="+field+"]").addClass("error");
			}
                });	
	};

	counter.deleteRecord = function(recordId){
		$('tr[data-id='+recordId+']').remove();
	};

	counter.addRecord = function(record){
		 $("tbody").append(templates.renderRecord( record ));
	};

	counter.replaceRecord = function(record){
                // $("tbody").append(templates.renderRecord( record ));
        };

	counter.clearRegister = function(){
		$("tbody").empty();
	};

	return counter;
});
