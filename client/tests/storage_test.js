requirejs.config({
    "baseUrl": "../js",
    "paths": {
      "test": '../tests/',
      //Regis lives on the bleeding edge, he does not care for IE < 9
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min"
    }           
});             
                        
// Load the main app module to start the app
requirejs(["test/utilities", "common/vigenere","common/myers-md5","libs/chai","common/storage","libs/mocha"], function(testUtil, vigenere, md5, chai, storage){
  mocha.setup('bdd');
	var expect = chai.expect;
	
	describe("Storage.js", function(){
		
		describe("encrypt", function(){
			var jsonRecord = testUtil.generateRecord();
			it("should encrypt an unicode string using the vigenere cypher and a given password", function(){
				expect( storage.encrypt( jsonRecord.description, jsonRecord.password ) ).to.equal( vigenere.encrypt( jsonRecord.description, jsonRecord.password ) );
			});
		});

		describe("getRegisterName", function(){
			var credentials = {
				name: testUtil.generateString( testUtil.generateInteger(5,10), true),
				password: testUtil.generateString( testUtil.generateInteger(5,10) )
			};
			
			it("should return the register name as the username encrypted using the vigenere cypher using the user's password", function(){
				expect( storage.getRegisterName( credentials  ) ).to.equal( vigenere.encrypt( credentials.name, credentials.password  )  );
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
				expect( storage.validateRecord( testUtil.generateRecord() ) ).to.be.true;
			});	
		});

		describe("serializeRecord", function(){
			var jsonRecord = testUtil.generateRecord();
			it("should return a record in JSON as comma separated, properly escaped and double quoted values string", function(){
				expect( storage.serializeRecord( jsonRecord ) ).to.equal( testUtil.recordToString( jsonRecord ) );
			});
		});

		describe("deserializeRecord", function(){
			var jsonRecord = testUtil.generateRecord();
			jsonRecord.id = testUtil.generateInteger(0,1000);
			it("should return a record in a string format as a record in JSON format with its field properly unquoted and unescaped, and its ID set to specified one", function(){
				expect( storage.deserializeRecord( testUtil.recordToString( jsonRecord ), jsonRecord.id) ).to.deep.equal(jsonRecord);	
			});
		});

		describe("getRegisterHash", function(){
			var registerJson = testUtil.generateRecords( testUtil.generateInteger(0,20) );
			var registerTxt =  testUtil.recordsToString( registerJson  );

			it("should return the md5 sum of a register provided in string format", function(){
				expect( storage.getRegisterHash( registerTxt  )).to.equal( md5(registerTxt) );
			});
		});

		describe("getNextId", function(){
			var registerJson = testUtil.generateRecords( testUtil.generateInteger(0,20) );
                        var registerTxt =  testUtil.recordsToString( registerJson  );
			it("should return the count + 1 of record in a register provided in string format", function(){

				expect( storage.getNextId( undefined ) ).to.be.equal( 1 );
				expect( storage.getNextId( null ) ).to.be.equal( 1 );
				expect( storage.getNextId( false ) ).to.be.equal( 1 );
				expect( storage.getNextId( "" ) ).to.be.equal( 1 );
				expect( storage.getNextId( registerTxt ) ).to.be.equal( registerJson.length + 1 );
			});
		});

		describe("deleteFromRegister", function(){
			
			it("should delete a record specified by its ID from a string register and return the updated register string", function(){
				var registerJson = testUtil.generateRecords( testUtil.generateInteger(1,10) );
				var idToDelete = testUtil.generateInteger(1, registerJson.length + 1);
				var beforeRegister = testUtil.recordsToString( registerJson );
				registerJson.splice(idToDelete - 1, 1);
				var afterRegister = testUtil.recordsToString( registerJson );
				expect( storage.deleteFromRegister( idToDelete, beforeRegister ) ).to.equal( afterRegister );
			});
		});

		describe("updateInRegister", function(){
			var registerJson = testUtil.generateRecords( testUtil.generateInteger(1,7) );
			var registerTxtBefore =  testUtil.recordsToString( registerJson  );
			//update a record
			var updatedId = testUtil.generateInteger(1, registerJson.length + 1);
			var updatedRecord = testUtil.generateRecord();
			registerJson[updatedId - 1] = updatedRecord;
			var registerTxtAfter =  testUtil.recordsToString( registerJson  );

			var storageRes = storage.updateInRegister(updatedId, updatedRecord, registerTxtBefore);
			it("should return the register in string format with the record specified by its id updated", function(){
				expect( storageRes ).to.be.equal( registerTxtAfter );
			});
		});

		describe("deserializeRegister", function(){
			 var registerJson = testUtil.generateRecords( testUtil.generateInteger(0,7) );
			var registerTxt =  testUtil.recordsToString( registerJson  );
			it("should return an array of records in JSON format from a register in string format", function(){
				expect( storage.deserializeRegister( "" ) ).to.deep.equal( [] );
				expect( storage.deserializeRegister( registerTxt ) ).to.deep.equal( registerJson  );
			});
		});

		describe("sortRecords", function(){
			var unsortedRegister = testUtil.generateRecords( testUtil.generateInteger(0,7) );
			var sortedRegister = JSON.parse( JSON.stringify(unsortedRegister) );
			sortedRegister.sort( function(a, b){
                                if (a.name.toUpperCase() < b.name.toUpperCase() ) return -1;
                                if (a.name.toUpperCase() > b.name.toUpperCase() ) return 1;
                                return 0;
                        } );
			var reverseSortedRegister = JSON.parse( JSON.stringify(sortedRegister) );
			reverseSortedRegister.reverse(); 
			it("should sort an array of records alphabeticaly (and reverse) based on the names of the records ", function(){
				expect( storage.sortRecords(unsortedRegister) ).to.deep.equal( sortedRegister );
				expect( storage.sortRecords(unsortedRegister, true) ).to.deep.equal( reverseSortedRegister );
			});
		});
  });
  mocha.run();	
});
