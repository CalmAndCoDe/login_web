var express = require("express");
var router = express.Router();
var Article = require("../count");
var Posts = require("../posts");
var Contact = require("../contact");
var bcrypt = require("bcryptjs");
var LocalStrategy = require("passport-local").Strategy;

module.exports = function(passport){
	passport.serializeUser(function(user, done) {

  done(null, user);

});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(function(username,password,done){
	Article.findOne({user:username},function(err,data){
		if(err){
			done(err);
		}else{
			var pass = undefined;
			console.log(data)
			if(data){
				bcrypt.compare(password,data.password).then(function(pass){
					if(pass === true){
					done(null,{
						username:data.user,
						password:data.password,
						email:data.email
					});
				    }
				   else{
					   done(null,false)
				   }
				})
			}else{
				done(null,false)
			}
		}
	})
}));
}
    
