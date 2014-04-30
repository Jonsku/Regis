define(function(){
	//How many code points in unicode ? 0x110000
	var unicodeSize = 0x110000;
	
	var vigenere = {
		
		/**
			Obfuscate a unicode string using the Vigenère cipher
			See: http://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher
		*/
		encrypt: function(input, key){
			var key_c, output = "";
			//cypher char by char
			for(var i=0; i < input.length; i++){
				key_c = key.charCodeAt(i % key.length);
				output += String.fromCharCode( (input.charCodeAt(i) + key_c) % unicodeSize );
			}
		
			return output;
		},
	
		/**
		Decode a unicode string obfuscated using the Vigenère cipher.
		*/
		decrypt: function(input, key){
			var key_c, output = "";
			//decypher char by char
			for(var i = 0; i < input.length; i++){
				key_c = key.charCodeAt(i % key.length);
				output += String.fromCharCode( ( unicodeSize + (input.charCodeAt(i) - key_c) ) % unicodeSize );
			}
		
			return output;
		}
	};
	
	return vigenere;
});