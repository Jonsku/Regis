define(['fs','crypto','common/vigenere'], function(fs, crypto, vigenere){
	//Constants matching records column name to column position (0 indexed)
	var COL_NAME = 0;
	var COL_DESCRIPTION = 1;
	var COL_URL = 2;	
	var COL_USERNAME = 3;
	var COL_PASSWORD = 4;	
		
	var dataStorage = {
		dataFolder : '',
		unicodeSize : 0x110000 //number of code points in unicode
	};
	
	/**
		Set the path to the folder to use to read/write register files.
	*/
	dataStorage.setDataFolder = function(pathToFolder){
		dataStorage.dataFolder = pathToFolder;
	};
	
	/**
		Create a register name.
	*/
	dataStorage.getRegisterName = function(credentials){
		console.log(credentials);
		return crypto.createHash('md5').update( vigenere.encrypt(credentials.name, credentials.password) ).digest("hex");
	}
	
	/**
		Read and return all records in a register file, optionally in reverse alphabetical order.
	*/
	dataStorage.readAllRecords = function(credentials, callback, reverse){
		  fs.readFile(dataStorage.dataFolder + dataStorage.getRegisterName(credentials) + '.csv', {encoding: "UTF-8"}, function (err, data) {
			  if (err){
			  	if(err.errno == 34){ //file not found
			  		callback([]); //return an empty list
			  		return;
			  	}
			  	throw err;
			  }
		  
			  //parse each line as a record JSON object, set line number as id
			  var records = [];
		
			  var rows = data.split(/\n/);

			  var row;
			  for(var line in rows){

				row = rows[line].split(",");
				if(row.length < 5 ){
					break; //last line
				}
				
				//Unquote
				records.push({
					id: line,
					name: decodeURIComponent( row[COL_NAME].replace(/"/g,'') ),
					description: decodeURIComponent( row[COL_DESCRIPTION].replace(/"/g,'') ),
					url: decodeURIComponent( row[COL_URL].replace(/"/g,'') ),
					username: vigenere.decrypt( decodeURIComponent( row[COL_USERNAME].replace(/"/g,'') ), credentials.password ),
					password: vigenere.decrypt( decodeURIComponent( row[COL_PASSWORD].replace(/"/g,'') ), credentials.password )
				});
			  }
			  
			  //sort by name
			  records.sort(function(a, b){
			  	if (a.name.toUpperCase < b.name.toUpperCase) return -1;
				if (a.name.toUpperCase > b.name.toUpperCase) return 1;
				return 0;
			  });
				
			  //reverse sort if required	  
			  if(reverse){
			  	records.reverse();
			  }
			  
			  callback(records);
		 });
	};	
	
	/**
		Save a new record to a register file.
		Suppose that newEntry is populated with enough valid data
	*/
	dataStorage.createRecord = function(credentials, newEntry, callback){
		//Save to hard drive
		var stringyfied = '"'+encodeURIComponent( newEntry.name )+'",';
		stringyfied += '"'+encodeURIComponent( newEntry.description )+'",';
		stringyfied += '"'+encodeURIComponent( newEntry.url )+'",';
		stringyfied += '"'+encodeURIComponent( vigenere.encrypt( newEntry.username, credentials.password ) )+'",';		
		stringyfied += '"'+encodeURIComponent( vigenere.encrypt( newEntry.password, credentials.password ) )+'"\n';		
			
		fs.appendFile(dataStorage.dataFolder + dataStorage.getRegisterName(credentials) + '.csv', stringyfied, function (err) {
		  if (err) throw err;
		  callback();
		});
	};		
	
	/**
		Delete a record identified by its line number in the register file
	*/
	dataStorage.deleteRecord = function(credentials, recordId, callback){
		//update accounts file
		fs.readFile(dataStorage.dataFolder + dataStorage.getRegisterName(credentials) + '.csv', {encoding: "UTF-8"}, function (err, data) {
		  if (err) throw err;
		  
		  //Split file by lines		
		  var rows = data.split(/\n/);
		  //Remove the line at recordId
		  rows.splice(recordId,1);
		  
		  //Repack as string and overwrite file
		  var stringyfied = rows.join("\n");
		  console.log(stringyfied);
		  fs.writeFile(dataStorage.dataFolder + dataStorage.getRegisterName(credentials) + '.csv', stringyfied, function(err){
			  if (err) throw err;
			  callback();
		  })
		});
	};
	
	/**
		Update an existing record 
		Suppose that newEntry is populated with enough valid data
	*/
	dataStorage.updateRecord = function(credentials, recordId, updatedEntry, callback){
		//update accounts file
		fs.readFile(dataStorage.dataFolder + dataStorage.getRegisterName(credentials) + '.csv', {encoding: "UTF-8"}, function (err, data) {
			if (err) throw err;

			//Split file by lines		
			var rows = data.split(/\n/);

			var stringyfied = '"'+encodeURIComponent(updatedEntry.name)+'",';
			stringyfied += '"'+encodeURIComponent( updatedEntry.description )+'",';
			stringyfied += '"'+encodeURIComponent( updatedEntry.url )+'",';
			stringyfied += '"'+encodeURIComponent( vigenere.encrypt( updatedEntry.username, credentials.password ) )+'",';		
			stringyfied += '"'+encodeURIComponent( vigenere.encrypt( updatedEntry.password, credentials.password ) )+'"';
		  
		  	//update the record
		  	rows[recordId] = stringyfied;
		  
			//Repack as string and overwrite file
			stringyfied = rows.join("\n");

			fs.writeFile(dataStorage.dataFolder + dataStorage.getRegisterName(credentials)+ '.csv', stringyfied, function(err){
			  if (err) throw err;
			  callback();
			})
		});
	};	
	
	return dataStorage;
});