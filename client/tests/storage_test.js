requirejs.config({
    "baseUrl": "../js",
    "paths": {
      "test": './',
      //Regis lives on the bleeding edge, he does not care for IE < 9
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min"
    }           
});             
                        
// Load the main app module to start the app
requirejs(["common/vigenere","common/myers-md5","libs/chai","common/storage","libs/mocha"], function(vigenere, md5, chai, storage){
  mocha.setup('bdd');
	var expect = chai.expect;
	
	
	var jsonRecord = {
		id:0,
		name:'Account,name à!ç!"',
		description:'Some\ndescription 123,44 $ô-_\'\""',
		url:'http://www.google.com/test=1,234&var1=süpâ12!',
		username:'th3_u$er,näme*',
		password:'<br>A p4F,swç9ö,'
	};
	var updatedRecord = {
		id:1,
		name:"I'm changed",
		description:'1234Some\ndescription 123,44 $ô-_\'\""',
		url:'http://www.google.com/test=1,234&var1=süpâ12!',
		username:'th3_u$er,näme*',
		password:'<br>A p4F,swç9ö,'
	};


	var stringRecord = '"'+encodeURIComponent( jsonRecord.name )+'",';
	stringRecord +=  '"'+encodeURIComponent( jsonRecord.description )+'",';
	stringRecord +=  '"'+encodeURIComponent( jsonRecord.url )+'",';
	stringRecord +=  '"'+encodeURIComponent( jsonRecord.username )+'",';	
	stringRecord +=  '"'+encodeURIComponent( jsonRecord.password )+'"';

	
	var stringUpdatedRecord = '"'+encodeURIComponent( updatedRecord.name )+'",';
	stringUpdatedRecord +=  '"'+encodeURIComponent( updatedRecord.description )+'",';
	stringUpdatedRecord +=  '"'+encodeURIComponent( updatedRecord.url )+'",';
	stringUpdatedRecord +=  '"'+encodeURIComponent( updatedRecord.username )+'",';	
	stringUpdatedRecord +=  '"'+encodeURIComponent( updatedRecord.password )+'"';

	var jsonRegister = [ JSON.parse(JSON.stringify(jsonRecord)), JSON.parse(JSON.stringify(jsonRecord)), JSON.parse(JSON.stringify(jsonRecord)) ];
	for(var r in jsonRegister){ jsonRegister[r].id = Number(r)+1; };

	//Unsorted register
	var unsortedRegister = JSON.parse( JSON.stringify(jsonRegister) );
	unsortedRegister[0].name = 'e';
	unsortedRegister[1].name = 'a';
	unsortedRegister[2].name = 'b';

	var sortedRegister = JSON.parse( JSON.stringify(unsortedRegister) );
	var tmp = sortedRegister[0];
	sortedRegister[0] = sortedRegister[1];
	sortedRegister[1] = sortedRegister[2];
	sortedRegister[2] = tmp; 

	var reverseSortedRegister = [ sortedRegister[2], sortedRegister[1], sortedRegister[0] ];

	var register = stringRecord+"\n"+stringRecord+"\n"+stringRecord+"\n";
	var updatedRegister = stringRecord+"\n"+stringUpdatedRecord+"\n"+stringRecord+"\n";
	describe("Storage.js", function(){
		
		describe("encrypt", function(){

			it("should encrypt an unicode string using the vigenere cypher and a given password", function(){
				expect( storage.encrypt( jsonRecord.description, jsonRecord.password ) ).to.equal( vigenere.encrypt( jsonRecord.description, jsonRecord.password ) );
			});
		});

		describe("getRegisterName", function(){
			it("should return the register name as the username encrypted using the vigenere cypher using the user's password", function(){
				expect( storage.getRegisterName( {name: jsonRecord.username, password: jsonRecord.password } ) ).to.equal( vigenere.encrypt( jsonRecord.username, jsonRecord.password  )  );
			});
		});

		describe("validateRecord", function(){
			it("should return a validation error for the 'name' field if the record name is not set", function(){
				var record = {};
				expect( storage.validateRecord( record ) ).to.include.keys('name');
				record.name='';
				expect( storage.validateRecord( record ) ).to.include.keys('name');
				record.name = undefined;				
				expect( storage.validateRecord( record ) ).to.include.keys('name');
				record.name = null;
				expect( storage.validateRecord( record ) ).to.include.keys('name');
			});			
			it("should return a validation error for the 'username' field if the record username is not set", function(){
				var record = {};
				expect( storage.validateRecord( record ) ).to.include.keys('username');
				record.username='';
				expect( storage.validateRecord( record ) ).to.include.keys('username');
				record.username = undefined;				
				expect( storage.validateRecord( record ) ).to.include.keys('username');
				record.username = null;
				expect( storage.validateRecord( record ) ).to.include.keys('username');
			});			
			it("should return a validation error for the 'password' field if the record password is not set", function(){
				var record = {};
				expect( storage.validateRecord( record ) ).to.include.keys('password');
				record.password='';
				expect( storage.validateRecord( record ) ).to.include.keys('password');
				record.password = undefined;				
				expect( storage.validateRecord( record ) ).to.include.keys('password');
				record.password = null;
				expect( storage.validateRecord( record ) ).to.include.keys('password');
			});
			it("should return a validation error for each missing mandatory fields", function(){
				var record = {};
				expect( storage.validateRecord( record ) ).to.include.keys(['name', 'username', 'password']);
			});
			it("should return true if the record name, username and password are set", function(){
				expect( storage.validateRecord(jsonRecord) ).to.be.true;
			});	
		});

		describe("serializeRecord", function(){

			it("should return a record in JSON as comma separated, properly escaped and double quoted values string", function(){
				expect( storage.serializeRecord( jsonRecord ) ).to.equal(stringRecord);
			});
		});

		describe("deserializeRecord", function(){
			it("should return a record in a string format as a record in JSON format with its field properly unquoted and unescaped, and its ID set to specified one", function(){
				expect( storage.deserializeRecord( stringRecord, 0) ).to.deep.equal(jsonRecord);	
			});
		});

		describe("getRegisterHash", function(){
			it("should return the md5 sum of a register provided in string format", function(){
				expect( storage.getRegisterHash( register  )).to.equal( md5(register) );
			});
		});

		describe("getNextId", function(){
			it("should return the count + 1 of record in a register provided in string format", function(){
				expect( storage.getNextId( "" ) ).to.be.equal( 1 );
				expect( storage.getNextId( register ) ).to.be.equal( 4 );
			});
		});

		describe("updateInRegister", function(){
			it("should return the register in string format with the record specified by id  updated", function(){
				expect( storage.updateInRegister(2,updatedRecord,register) ).to.be.equal( updatedRegister );
			});
		});

		describe("deserializeRegister", function(){
			it("should return an array of records in JSON format from a register in string forma", function(){
				expect( storage.deserializeRegister( "" ) ).to.deep.equal( [] );
				expect( storage.deserializeRegister( register ) ).to.deep.equal( jsonRegister  );
			});
		});

		describe("sortRecords", function(){
			it("should sort an array of records alphabeticaly (and reverse) based on the names of the records ", function(){
				expect( storage.sortRecords(unsortedRegister) ).to.deep.equal( sortedRegister );
				expect( storage.sortRecords(unsortedRegister, true) ).to.deep.equal( reverseSortedRegister );
			});
		});
  });
  mocha.run();	
});
