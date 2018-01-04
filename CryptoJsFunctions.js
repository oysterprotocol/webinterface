


var buildOysterHandle = function(fileName, entropy){

	var fileNameTrimmed = parseEightCharsOfFilename(fileName);
		
	var salt = getSalt(8);
	
	var primordialHash = getPrimordialHash(entropy);
	
	var handle = fileNameTrimmed + primordialHash + salt;

	return handle;	
}

//pad and trim
var parseEightCharsOfFilename = function(fileName){
	
	//pad WE CAN REPLACE THIS
	fileName = fileName + "________";
	
	//trim
	fileName = fileName.substr(0,8);
	
	return fileName;
}


var getSalt = function(numChars){
	
	//we can replace this
	var salt = Math.random().toString(36).substr(2, 5);

	return salt;

}

var getPrimordialHash = function(entropy){
	
	return CryptoJS.SHA256(entropy);
}


var encrypt = function(message,secretkey){
	var ciphertext = CryptoJS.AES.encrypt(message, secretkey);
	return ciphertext.toString();
}


 var decrypt = function(ciphertext,secretkey){
	var bytes  = CryptoJS.AES.decrypt(ciphertext, secretkey);
	return bytes.toString(CryptoJS.enc.Utf8);
}




//test salt
console.log("salt");
console.log(getSalt(8));


//oyster handle  NEED TESTS FOR LESS THAN AND MORE THAN 8 CHAR Fname
var h = buildOysterHandle("test1","abc");

console.log("handle");
console.log(h);

//TESTING:  MOVE TO DIFFERENT FILE