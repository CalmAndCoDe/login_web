var mongoose = require("mongoose");



var schema1 = mongoose.Schema({
	title: String,
	post: String,
	author:String,
	time:String
},{
	collection: "posts"
});
var Posts =module.exports = mongoose.model("Posts",schema1);
    