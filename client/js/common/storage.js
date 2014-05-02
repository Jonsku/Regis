define(['common/vigenere','common/myers-md5'], function(vigenere, md5){
	var storage = {
		//Constants matching records column name to column position (0 indexed)
		COL_NAME: 0,
		COL_DESCRIPTION: 1,
		COL_URL: 2,
		COL_USERNAME: 3,
		COL_PASSWORD: 4,

		encrypt: function(value, password){
			return vigenere.encrypt(value, password);
		},

		encryptRecord: function(recordObj, credentials){
			var encryptedRecord = JSON.parse(JSON.stringify(recordObj));
			encryptedRecord.username = storage.encrypt(recordObj.username, credentials.password);
			encryptedRecord.password = storage.encrypt(recordObj.password, credentials.password);
			return encryptedRecord;
		},

		decryptRecord: function(recordObj, credentials){
			recordObj.username = storage.decrypt(recordObj.username, credentials.password);
			recordObj.password = storage.decrypt(recordObj.password, credentials.password);
			return recordObj;
		},

		_getRegisterName: function(credentials){
			return storage.encrypt(credentials.name, credentials.password);
		},
				
		//Get a register name from credentials
		getRegisterName: function(credentials){
			return storage._getRegisterName(credentials);
		},
				
		readAllRecords: function(credentials, callback, reverse){
			throw "Not implemented: please use a concrete implementation of the storage module";
		},
		
		
		createRecord: function(credentials, newEntry, callback){
			throw "Not implemented: please use a concrete implementation of the storage module";
		},
		
		
		deleteRecord: function(credentials, recordId, callback){
			throw "Not implemented: please use a concrete implementation of the storage module";
		},
	
		updateRecord: function(credentials, recordId, updatedEntry, callback){
			throw "Not implemented: please use a concrete implementation of the storage module";
		},

		/**
			Overwrite the content of a register
		*/
		overwriteRegister: function(credentials, newRegister, callback){
			throw "Not implemented: please use a concrete implementation of the storage module";
		},
	
		/**
			Delete a single record from raw register data and return the updated raw register
		*/
		deleteFromRegister: function(recordId, register){
			//Split file by lines		
			var rows = register.split(/\n/);
			//Remove the line at recordId
			rows.splice(recordId - 1,1);

			//Repack entire register as string and overwrite file
			return rows.join("\n");
		},
		
		/**
			Update a single record in raw register data and return the updated raw register
		*/
		updateInRegister: function(recordId, updatedEntry, register){
			//Split file by lines		
			var rows = register.split(/\n/);
			
			var stringyfied = storage.serializeRecord(updatedEntry);
			//update the record
			rows[recordId - 1] = stringyfied;

			//Repack entire register as string and overwrite file
			return rows.join("\n");
		},

		//Validate record
		validateRecord: function(record){
			var validationError = true;
	
			if(!record.name || record.name == ""){
				if(validationError === true) validationError = {};
				validationError.name = "Could you be so kind as to provide a name for this account?";
			}
		
			if(!record.username || record.username == ""){
				if(validationError === true) validationError = {};
				validationError.username = "It appears you forgot to fill the username field...";
			}
		
			if(!record.password || record.password == ""){
				if(validationError === true) validationError = {};
				validationError.password = "I couldn't help to notice that you did not provide a password for this account.";
			}
			
			return validationError;
		},
		
		//Return the md5sum of a raw data register
		getRegisterHash: function(register){
			return md5(register);
		},

		getNextId: function(data){
		    return data ? data.split("\n").length : 1;
		},
		
		//Convert a JSON record object to a string
		serializeRecord: function(record){
			
			var stringyfied = '"'+encodeURIComponent( record.name )+'",';
			stringyfied += '"'+encodeURIComponent( record.description )+'",';
			stringyfied += '"'+encodeURIComponent( record.url )+'",';
			stringyfied += '"'+encodeURIComponent( record.username )+'",';		
			stringyfied += '"'+encodeURIComponent( record.password )+'"';
						
			return stringyfied;
		},
		
		deserializeRegister: function( register){
			 //parse each line as a record JSON object, set line number as id
			var records = [];

			var rows = register.split(/\n/);

			var record;
			for(var line in rows){
				//deserialize the string
				record = storage.deserializeRecord(rows[line], Number(line)+1);
				if( record === false ){
					break; //last line
				}
				records.push(record);
			}
			
			return records;
		},
		
		//Convert a record string to a JSON object
		deserializeRecord: function(recordString, id){
			var row = recordString.split(",");
			if(row.length < 5 ){
				return false; //last line
			}
	
			//Unquote
			return {
				id: Number(id),
				name: decodeURIComponent( row[storage.COL_NAME].replace(/"/g,'') ),
				description: decodeURIComponent( row[storage.COL_DESCRIPTION].replace(/"/g,'') ),
				url: decodeURIComponent( row[storage.COL_URL].replace(/"/g,'') ),
				username: decodeURIComponent( row[storage.COL_USERNAME].replace(/"/g,'') ),
				password:decodeURIComponent( row[storage.COL_PASSWORD].replace(/"/g,'') )
			};
		},
		
		//sort by name
		sortRecords: function(records, reverse){
			records.sort(function(a, b){
				if (a.name.toUpperCase() < b.name.toUpperCase() ) return -1;
				if (a.name.toUpperCase() > b.name.toUpperCase() ) return 1;
				return 0;
			});

			//reverse sort if required	  
			if(reverse){
				records.reverse();
			}
			
			return records;
		}

	};
		
	return storage;
});
