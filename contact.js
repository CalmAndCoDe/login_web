var mongoose = require("mongoose");



var schema1 = mongoose.Schema({
	sender: String,
	email: String,
	message:String,
	to:String
},{
	collection: "contact"
});
var Contact =module.exports = mongoose.model("Contact",schema1);
    
