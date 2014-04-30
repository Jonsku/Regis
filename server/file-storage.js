define(['common/storage', 'common/vigenere', 'fs','crypto', ], function(storage, vigenere, fs, crypto){
	
	return function(dataFolder){
	
		//Override	
		storage.getRegisterName = function(credentials){
			console.log(credentials);
			return crypto.createHash('md5').update( storage._getRegisterName(credentials)  ).digest("hex");
		};
		
		/**
			Read and return all records in a register file, optionally in reverse alphabetical order.
		*/
		storage.readAllRecords = function(credentials, callback, reverse){
			var fileName = dataFolder + storage.getRegisterName(credentials) + '.csv';
			
			fs.readFile( fileName, {encoding: "UTF-8"}, function (err, data) {
			  if (err){
				if(err.errno == 34){ //file not found
					callback([]); //return an empty list
					return;
				}
				throw err;
			  }

			  //parse each line as a record JSON object, set line number as id
			  var records = storage.deserializeRegister(credentials, data);

			  callback( storage.sortRecords(records, reverse) );
			 });
		};	
	
		/**
			Save a new record to a register file.
			Suppose that newEntry is populated with enough valid data
		*/
		storage.createRecord = function(credentials, newEntry, callback){
			var fileName = dataFolder + storage.getRegisterName(credentials) + '.csv';
			
			//Save to hard drive
			var stringyfied = storage.serializeRecord(newEntry, credentials);	
			
			fs.appendFile( fileName, stringyfied, function (err) {
			  	if (err) throw err;
				//read register back to get id
				fs.readFile( fileName, {encoding: "UTF-8"}, function (err, data) {
					if (err) throw err;
					newEntry.id = storage.getLastId( data );
					callback( newEntry );
				});
			});
		};
	
		/**
			Delete a record identified by its line number in the register file
		*/
		storage.deleteRecord = function(credentials, recordId, callback){
			var fileName = dataFolder + storage.getRegisterName(credentials) + '.csv';
			
			//update accounts file
			fs.readFile( fileName, {encoding: "UTF-8"}, function (err, data) {
			  if (err) throw err;
		  
			  
			  var stringyfied = storage.deleteFromRegister(recordId, data);
			  
			  console.log(stringyfied);
			  
			  //Overwrite file
			  fs.writeFile( fileName, stringyfied, function(err){
				  if (err) throw err;
				  callback();
			  })
			});
		};
		
	
		/**
			Update an existing record 
			Suppose that newEntry is populated with enough valid data
		*/
		storage.updateRecord = function(credentials, recordId, updatedEntry, callback){
			var fileName = dataFolder + storage.getRegisterName(credentials) + '.csv';
			
			//update accounts file
			fs.readFile( fileName, {encoding: "UTF-8"}, function (err, data) {
				if (err) throw err;

				stringyfied = storage.updateInRegister(credentials, recordId, updatedEntry, data);
				
				//Overwrite file
				fs.writeFile( fileName, stringyfied, function(err){
				  if (err) throw err;
				  callback();
				})
			});
		};	

		/**
			Overwrite the content of a register
		*/
		storage.overwriteRegister = function(credentials, newRegister, callback){
			
			var fileName = dataFolder + storage.getRegisterName(credentials) + '.csv';
			
			//Overwrite file
			fs.writeFile( fileName, newRegister, function(err){
				if (err) throw err;
				  callback();
			});
		};	
	
		return storage;
	};
});
