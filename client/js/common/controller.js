define( function(){

	return function(dataStorage, successCallback, errorCallback){
		var controller = {};

		var actions = {};
		actions['/regis/delete'] = function(params, credentials){
			var recordId = params["recordId"] ? params["recordId"] : "";

			var validationError = false;

			if(recordId == ""){
				if(!validationError) validationError = {};
				validationError.recordId = "You did not tell me which record to delete.";
			}

			if( validationError ){
				console.log("validation failed");
				errorCallback(validationError);
				return;
			}

			dataStorage.deleteRecord( credentials, recordId, function(){
				successCallback( {deletedId: recordId} );
			});
		};

		actions['/regis/add'] = function(params, credentials){
			console.log('/regis/add');
			//The new dataStorage
			var newEntry = {
				name: params["name"] ? params["name"].trim() : "", 
				description: params["description"] ? params["description"].trim() : "", 
				url: params["url"] ? params["url"].trim() : "", 
				username: params["username"] ? params["username"].trim() : "", 
				password: params["password"] ? params["password"].trim() : ""
			};

			//Validate
			if( dataStorage.validateRecord(newEntry) !== true ){
				errorCallback(validationError);
				return;
			}

			dataStorage.createRecord( credentials, newEntry, function(newRecord){
			  console.log('New account record registered');
			  successCallback( { newRecord: newRecord } );
			});
		};

		actions['/regis/update'] = function(params, credentials){
			console.log('/regis/update');
                        console.log(params);

                        var recordId = params["recordId"] ? params["recordId"] : "";

                        //The new dataStorage
                        var updatedEntry = {
                                name: params["name"] ? params["name"].trim() : "",
                                description: params["description"] ? params["description"].trim() : "",
                                url: params["url"] ? params["url"].trim() : "",
                                username: params["username"] ? params["username"].trim() : "",
                                password: params["password"] ? params["password"].trim() : ""
                        };

                        //Validate
                        if( dataStorage.validateRecord(updatedEntry) !== true ){
                                errorCallback(validationError);
				return;
                        }

                        dataStorage.updateRecord( credentials, recordId, updatedEntry, function(){
                          console.log('Account record updated');
			  updatedEntry.id = recordId;
                          successCallback( { updatedEntry: updatedEntry  } );
                        });
		};

		actions['/regis/download'] = function(params, credentials){
			dataStorage.readAllRecords( credentials, function(records){
				//return view filled with dataStorage       
				successCallback({records: records});
			});
		};

                //Overwrite the user register with the provided raw data
                actions['/regis/upload'] = function(params, credentials){
                        var uploadedData = params['register'] ? params['register'] : "";
                        var hash = params['hash'] ? params['hash'] : "";
                        if( dataStorage.getRegisterHash( uploadedData  ) != hash ){
                                errorCallback( {msg: 'Data was corrupted during upload'} );
                                return;
                        }

                        dataStorage.overwriteRegister(credentials, uploadedData, function(){
                                console.log("Data from client uploaded successfully");
                                successCallback( {} );
                        });

                };    

		controller.process = function(endpoint, params, credentials){
			if( !actions[endpoint]  ){
				errorCallback({msg: 'Not implemented: '+endpoint});
				return;
			}
			console.log(endpoint);
			actions[endpoint](params, credentials);
		};

		return controller;
	};

});
