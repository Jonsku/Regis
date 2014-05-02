requirejs.config({
    "baseUrl": "../js",
    "paths": {
      "test": '../tests/',
      //Regis lives on the bleeding edge, he does not care for IE < 9
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min"
    }           
});             
                        
// Load the main app module to start the app
requirejs(["test/utilities","common/vigenere","common/myers-md5","libs/chai","web-storage","libs/mocha"], function(testUtil, vigenere, md5, chai, storage){
  storage = storage();
  mocha.setup('bdd');
	var expect = chai.expect;
	
	var testCredentials = {name:"test", password:"123456789"};

	var register = [];
	
	 var addRecords = function(howManyRecordsToCreate, callback){
		var jsonRecord = testUtil.generateRecord();
		storage.createRecord(testCredentials, jsonRecord, function(addedRecord){
			register.push(addedRecord);
			if(howManyRecordsToCreate > 0){
				addRecords(--howManyRecordsToCreate, callback);
			}else{
				callback();
			}
		});
	};

	describe("Local-storage.js", function(){

		beforeEach(function(){
			register = [];
			delete localStorage[ vigenere.encrypt(testCredentials.name, testCredentials.password) ];
		});		
		
		afterEach(function(){
			delete localStorage[ vigenere.encrypt(testCredentials.name, testCredentials.password) ];
		});

		describe("createRecord", function(){

			var jsonRecord = testUtil.generateRecord();

			it("should add a record to the register and encrypt the username and password and increase the next id by one", function(done){

				(storage.createRecord(testCredentials, jsonRecord, function(addedRecord){
					expect( addedRecord.id ).to.equal( 1 );
					expect( storage.getNextId( localStorage[ vigenere.encrypt(testCredentials.name, testCredentials.password) ]  ) ).to.equal( addedRecord.id + 1 );
					expect( addedRecord.username ).to.equal( vigenere.encrypt(jsonRecord.username, testCredentials.password) );
					expect( addedRecord.password ).to.equal( vigenere.encrypt(jsonRecord.password, testCredentials.password) );
					expect( localStorage[ storage.getRegisterName(testCredentials) ] ).to.equal( storage.serializeRecord(addedRecord)+"\n" );
					done();
				}));
			});
		});

		describe("deleteRecord", function(){


			it("should delete a previously added record and decrease the next id by one", function(done){
				var howManyRecordsToCreate = testUtil.generateInteger(1,7);
				var idToDelete = testUtil.generateInteger(1, howManyRecordsToCreate + 1);

				addRecords(howManyRecordsToCreate, function(){
				
					//delete record
					register.splice(idToDelete-1, 1);
					var textRegister = testUtil.recordsToString( register );
					storage.deleteRecord(testCredentials, idToDelete, function(){
						expect( localStorage[ storage.getRegisterName(testCredentials) ] ).to.equal( textRegister );
						done();
					});
				} );
				
			});
		});
	
		describe("updateRecord", function(){

			var jsonRecord = testUtil.generateRecord();

			it("should udpate a previously added record", function(done){
				(storage.createRecord(testCredentials, jsonRecord, function(addedRecord){
					storage.deleteRecord(testCredentials, addedRecord.id, function(){
						expect( localStorage[ storage.getRegisterName(testCredentials) ] ).to.equal("");
						expect( storage.getNextId( localStorage[ storage.getRegisterName(testCredentials) ] ) ).to.equal( 1 );
						done();
					});
				}));
			});
		});

		describe("readAllRecords", function(){
			
			it("should return all records in a register key in local storage as an array of record objects ordered alphabetically", function(done){
				var howManyRecordsToCreate = testUtil.generateInteger(1,7);
				addRecords(howManyRecordsToCreate, function(){

                                        //sort records
                                        register.sort( function(a, b){
                                                if (a.name.toUpperCase() < b.name.toUpperCase() ) return -1;
                                                if (a.name.toUpperCase() > b.name.toUpperCase() ) return 1;
                                                return 0;
                                        } );
                                        var textRegister = testUtil.recordsToString( register );
                                        storage.readAllRecords(testCredentials,  function( records ){
                                                expect( records ).to.deep.equal( register );
                                                done();
                                        });
                                 });
			});
			
			it("should return all records in a register key in local storage as an array of record objects in reverse alphabetical order", function(done){
				var howManyRecordsToCreate = testUtil.generateInteger(1,7);
				addRecords(howManyRecordsToCreate, function(){

                                        //sort records
                                        register.sort( function(a, b){
                                                if (a.name.toUpperCase() < b.name.toUpperCase() ) return 1;
                                                if (a.name.toUpperCase() > b.name.toUpperCase() ) return -1;
                                                return 0;
                                        } );
                                        var textRegister = testUtil.recordsToString( register );
                                        storage.readAllRecords(testCredentials,  function( records ){
                                                expect( records ).to.deep.equal( register );
                                                done();
                                        }, true);
                                 });
			});			
		});

		describe("overwriteRegister", function(){
			it("should overwrite a register with record data provided as string",function(done){
				var howManyRecordsToCreate = testUtil.generateInteger(1,7);
				var newRegister = testUtil.recordsToString( testUtil.generateRecords( testUtil.generateInteger(1,10) ) );
				
				addRecords(howManyRecordsToCreate, function(){
					expect( localStorage[ storage.getRegisterName(testCredentials) ] ).to.not.equal( newRegister );
					storage.overwriteRegister(testCredentials, newRegister, function(){
						expect( localStorage[ storage.getRegisterName(testCredentials) ] ).to.equal( newRegister );
						done();
					});
				});
			});
		});
  });
  mocha.run();	
});
