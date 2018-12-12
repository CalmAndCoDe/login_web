var Article = require("../count");
var nodemailer = require("nodemailer");
var bcrypt = require("bcryptjs");
var crypto = require("crypto");

var usertoken = null;
var Signup = function(req,res){}

Signup.prototype.getuser = function(req,res){
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
  Article.findOne({email:req.body.email},function(err,data){
    if(err){
      console.log(err);
    }else if(data) {
    	res.locals.error = "Your Email is Registered";
      res.redirect("login");
    }else {
    	
      req.checkBody("username","Username Required").notEmpty();
      req.checkBody("email","Email required").isEmail();
      module.exports = errors = req.validationErrors();
      
      //console.log(errors)
      if(errors){
      	res.locals.error= errors;
      	res.redirect("/home");
      	errors = undefined;
      	}else{
      		res.render("password",{data: req.body,email:req.user});
        
        
        bcrypt.genSalt(10, function(err, salt) {
          
          bcrypt.hash(req.body.password, salt, function(err, hash) {
            if(err){
              console.log(err);
            }else{
            	var tokenuser = createtoken();
              var Login = new Article({
                user: req.body.username,
                email: req.body.email,
                password : hash,
                token:tokenuser,
                saved:false
              });
              Login.save(function (err){
                if(err){
                  console.log(err);
                }
                else {
                	
                  console.log(req.body.password + " is submitted to database...");
                  var mail = nodemailer.createTransport({
                  	service:process.env.SERVICE,
                  	auth:{
                  		user:process.env.EMAIL,
                  		pass:process.env.PASS
                  	}
                  })
                  var mailtext = {
                  	from:"userauth-noreply@Logifi.com",
                  	to:req.body.email,
                  	subject:"Email Verify",
                  	text:"hello dear " + req.body.email +
                  	" you signed up with this email on our website if weren't you" +
                  	" just ignore this email otherwise you need to verify your email" +
                  	" by clicking the link below:" + 
                  	"https://logifi.herokuapp.com/verifyemail/" + tokenuser
                  	
                  }
                  mail.sendMail(mailtext,function(err,done){
                  	if(err){
                  		console.log(err)
                  	}else {
                  		console.log("Email sended...")
                  		console.log(done);
                  		setTimeout(function(){
                  			deletetoken(req.body.email)
                  		
                  		},60000)
                  		
                  	}
                  })
                }
              });
            }
            
          });
          
        });
        
        
      }
    }
  })
}
Signup.prototype.emailtoken = function(req,res){
	Article.findOneAndUpdate({token:req.params.token},{
		token:null,
		saved:true
	},function(err,done){
		if(err){
			console.log(err)
		}else if(!data || data === null){
			res.sendStatus(404)
		}else {
			res.redirect("/login");
		}
	})
}
function createtoken(){
	var key = crypto.randomBytes(48);
	var token = key.toString("hex");
	return token;
}
function deletetoken(user){
	Article.findOneAndUpdate({token:user},{token:null},function(err,done){
		if(err){
			console.log(err)
		}else {
			console.log("Token deleted...");
		}
	})
}
module.exports = Signup;
