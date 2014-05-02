define(function(){
	
	var alphanum = " \nabcdefghijklmnopqrstuvwxyzéèçàùöüäôûâîï1234567890";	
	var unicodeSize = 0x036F;//0x110000;

	var testUtils = {};

	testUtils.generateInteger = function( min, max){
		return min + Math.floor( Math.random() * (max-min)  );
	},

	testUtils.generateString = function(size, onlyAlphanum){
		var str = "";
		var getChar;
		if(onlyAlphanum){
			getChar = function(){
				return alphanum.charAt( testUtils.generateInteger(0,alphanum.length) );
			};
		}else{
			getChar = function(){
				return String.fromCharCode( testUtils.generateInteger(0,unicodeSize) );
			};
		}
		while(str.length < size){
			str += getChar();
		}
		return str;
	};

	testUtils.generateRecord = function(){
		return {
			name: testUtils.generateString( testUtils.generateInteger(10,20), true),
			description: testUtils.generateString( testUtils.generateInteger(100,255) ),
			url: "http://"+testUtils.generateString( testUtils.generateInteger(1,10), true)+".com",
			username: testUtils.generateString( testUtils.generateInteger(1,10) ),
			password: testUtils.generateString( testUtils.generateInteger(1,10) )
		};
			
	};

	testUtils.recordToString = function(record){
		var stringRecord = '"'+encodeURIComponent( record.name )+'",';
        	stringRecord +=  '"'+encodeURIComponent( record.description )+'",';
        	stringRecord +=  '"'+encodeURIComponent( record.url )+'",';
        	stringRecord +=  '"'+encodeURIComponent( record.username )+'",';
        	stringRecord +=  '"'+encodeURIComponent( record.password )+'"';
		return stringRecord;
	};

	testUtils.generateRecords = function(size){
		var record, records = [];
		while(records.length < size){
			record = testUtils.generateRecord();
			record.id = records.length + 1;
			records.push( record  );
		}
		return records;
	};

	testUtils.recordsToString = function( records ){
		 var registerTxt = "";
                 for(var i in records){
                 	registerTxt += testUtils.recordToString( records[i] )+"\n";
                 }
		return registerTxt;
	};

	return testUtils;
});
