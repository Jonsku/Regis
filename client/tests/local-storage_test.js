requirejs.config({
    "baseUrl": "../js",
    "paths": {
      "test": './',
      //Regis lives on the bleeding edge, he does not care for IE < 9
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min"
    }           
});             
                        
// Load the main app module to start the app
requirejs(["common/vigenere","common/myers-md5","libs/chai","local-storage","libs/mocha"], function(vigenere, md5, chai, localStorage){
  mocha.setup('bdd');
	var expect = chai.expect;
	
	
	var jsonRecord = {
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

	var testCredentials = {name:"test", password:"123456789"};

	describe("Local-storage.js", function(){

		beforeEach(function(){
			localStorage[ vigenere.encrypt(testCredentials.name, testCredentials.password) ] = undefined;
		});		
		
		afterEach(function(){
			localStorage[ vigenere.encrypt(testCredentials.name, testCredentials.password) ] = undefined;
		});

		describe("createRecord", function(){

			it("should add a record to the register and encrypt the username and password and increase the next id by one", function(done){
				(localStorage.createRecord(testCredentials, jsonRecord, function(addedRecord){
					expect( addedRecord.id ).to.equal( 1 );
					expect( storage.getNextId() ).to.equal( addedRecord.id + 1 );
					expect( addedRecord.username ).to.equal( vigenere.encrypt(jsonRecord.username, testCredentials.password) );
					expect( addedRecord.password ).to.equal( vigenere.encrypt(jsonRecord.password, testCredentials.password) );
					expect( localStorage[ storage.getRegisterName(testCredentials) ] ).to.equal( storage.serializeRecord(addedRecord)+"\n" );
				}));
			});
		});

  });
  mocha.run();	
});
