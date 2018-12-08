var Article = require("../count");
var crypto = require("crypto");
var mailer = require("nodemailer");
var bcrypt = require("bcryptjs");

var key;
var tokentext;
var ResetPassword = function(){}

	ResetPassword.prototype.getusername = function(req,res){
		Article.findOne({email:req.body.email},function(err,data){
			if(err || data === null){
				console.log("No User Found...");
				res.locals.error = "No user found";
				res.sendStatus(404)
				return null;
			}
			else {
			var usertoken = token();
			var hours = new Date().getHours();
			var minutes = new Date().getMinutes();
			Article.findOneAndUpdate({email:data.email},{
				token:usertoken,
				tokentime: hours + ":" + minutes
			},function(err,done){
				if(err) throw err;
				
				
				var mail = mailer.createTransport({
					service: process.env.SERVICE,
					auth:{
						user: process.env.EMAIL,
						pass: process.env.PASS
					}
					
				});
				var mailText = {
					from: "resetpassword@Logifi.com",
					to: req.body.email,
					subject:"Reset Password",
					text:"Hi,dear " + req.body.email + 
						" password reset requested from this email if you weren't just ignore this email"
						+ " Click the link below to reset your password:"
						+ "https://logifi.herokuapp.com/reset/" + usertoken
				}
				mail.sendMail(mailText,function(err,info){
					
				
				if(err){
					console.log(err)
				}else {
					res.render("password",{data:req.body.email,user:req.user});
					setTimeout(function(){
						deletetoken(usertoken);
					},10 * 60000)
				}
				})
			});
			}
		})
	
	}
	
	
	ResetPassword.prototype.password = function(req,res){
		var password = req.body.password;
		req.checkBody("password","Password Required").notEmpty();
		var errors = req.validationErrors();
		
		if(!errors){
			
		
		bcrypt.genSalt(10,function(err,salt){
			bcrypt.hash(req.body.password,salt,function(err,hash){
				Article.findOneAndUpdate({"token":tokentext},{
			      password: hash,
			      token:null
		       },function(err,done){
			       if(err) throw err;
			       else {
				      res.redirect("/login");
			   }
		})
				
				
			})
		})
		}else {
			res.locals.error = errors;
			res.redirect("/reset");
		}
		
	}
	ResetPassword.prototype.gettoken = function(inputtoken){
		tokentext = inputtoken;
		console.log(tokentext);
	}
	
	function token(){
	       var key = crypto.randomBytes(48);
	       var token = key.toString("hex");
	       return token;
	}
	function deletetoken(user){
		Article.findOneAndUpdate({"token":user},{
			token:null
		}).then(function(data){
			console.log("Token Deleted");
		})
	}
	
	
	
module.exports = ResetPassword;


    
    
    
    
    
    
    
