define(['common/storage', 'common/vigenere'], function(storage, vigenere){
	return function(){
	
		/**
			Read and return all records in a register key in local storage, optionally in reverse alphabetical order.
		*/
		storage.readAllRecords = function(credentials, callback, reverse){
			var registerKey = storage.getRegisterName(credentials);
			var data = localStorage[registerKey];
			if(!data){
				callback([]); //return an empty list
				return;
			}
			
			//parse each line as a record JSON object, set line number as id
			var records = storage.deserializeRegister( data );

			callback( storage.sortRecords(records, reverse) );
		};	
	
		/**
			Save a new record to a register key in local storage.
			Suppose that newEntry is populated with enough valid data
		*/
		storage.createRecord = function(credentials, newEntry, callback){
			
			var registerKey = storage.getRegisterName(credentials);
			newEntry = storage.encryptRecord( newEntry, credentials )
			newEntry.id = storage.getNextId( localStorage[registerKey] );

			var stringyfied = storage.serializeRecord( newEntry );			

			localStorage[registerKey] +=  stringyfied + "\n"	
			callback( newEntry );
		};
	
		/**
			Delete a record identified by its line number in a register key in local storage
		*/
		storage.deleteRecord = function(credentials, recordId, callback){
			var registerKey = storage.getRegisterName(credentials);
			var data = localStorage[registerKey];
			
			localStorage[registerKey] = storage.deleteFromRegister(recordId, data);
			callback();
		};
		
	
		/**
			Update an existing record 
			Suppose that newEntry is populated with enough valid data
		*/
		storage.updateRecord = function(credentials, recordId, updatedEntry, callback){
			var registerKey = storage.getRegisterName(credentials);
			var data = localStorage[registerKey];
			
			localStorage[registerKey] = storage.updateInRegister(credentials, recordId, updatedEntry, data);
			
			callback();
		};

		/**
			Overwrite the content of a register
		*/
		storage.overwriteRegister = function(credentials, newRegister, callback){
			var registerKey = storage.getRegisterName(credentials);
			
			localStorage[registerKey] = newRegister;
			callback();

		};	
	
		return storage;
	};
});
