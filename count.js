var mongoose = require("mongoose");


var schema = mongoose.Schema({
	email: String,
	user: String,
	password: String,
	token:String,
	tokentime:String,
	saved:Boolean
},{
	collection: "login"
});

var Article =module.exports = mongoose.model("Article",schema);
