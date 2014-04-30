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
			recordObj.username = storage.encrypt(recordObj.username, credentials.password);
			recordObj.password = storage.encrypt(recordObj.password, credentials.password);
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
			console.log("Not implemented");
		},
		
		
		createRecord: function(credentials, newEntry, callback){
			console.log("Not implemented");
		},
		
		/**
			Delete a single record from raw register data and return the updated raw register
		*/
		deleteFromRegister: function(recordId, register){
			//Split file by lines		
			var rows = register.split(/\n/);
			//Remove the line at recordId
			rows.splice(recordId,1);

			//Repack entire register as string and overwrite file
			return rows.join("\n");
		},
		
		deleteRecord: function(credentials, recordId, callback){
			console.log("Not implemented");
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
		
		updateRecord: function(credentials, recordId, updatedEntry, callback){
			console.log("Not implemented");
		},

		/**
			Overwrite the content of a register
		*/
		overwriteRegister: function(credentials, newRegister, callback){
			console.log("Not implemented");
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
		    return data.split("\n").length;
		  /*
		    data =""; subString = "\n";
		    if(subString.length<=0) return data.length+1;

		    var n=0, pos=0;
		    var step = subString.length; //(allowOverlapping)?(1):(subString.length);
			
		    while(true){
			pos=data.indexOf(subString,pos);
			if(pos>=0){ n++; pos+=step; } else break;
		    }
		    return n;
		  */
		},
		
		//Convert a JSON record object to a string
		serializeRecord: function(record){
			
			var stringyfied = '"'+encodeURIComponent( record.name )+'",';
			stringyfied += '"'+encodeURIComponent( record.description )+'",';
			stringyfied += '"'+encodeURIComponent( record.url )+'",';
			stringyfied += '"'+encodeURIComponent( record.username )+'",';		
			stringyfied += '"'+encodeURIComponent( record.password )+'"';
						
			//stringyfied += '"'+encodeURIComponent( vigenere.encrypt( record.username, credentials.password ) )+'",';		
			//stringyfied += '"'+encodeURIComponent( vigenere.encrypt( record.password, credentials.password ) )+'"\n';
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
				//username: vigenere.decrypt( decodeURIComponent( row[storage.COL_USERNAME].replace(/"/g,'') ), credentials.password ),
				//password: vigenere.decrypt( decodeURIComponent( row[storage.COL_PASSWORD].replace(/"/g,'') ), credentials.password )
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
