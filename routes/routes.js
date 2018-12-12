require('dotenv').config();
var router = require("express").Router();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Article = require('../count');
var Posts = require("../posts");
var Contact = require("../contact");
var bcrypt = require("bcryptjs");
var passport = require("passport");
var Password= require("./reset-password");
var Signup = require("./signup")
var resetPassword = new Password();
var useremail = new Signup();
//Database connection
mongoose.connect(process.env.DBHOST1);
var db1 = mongoose.createConnection(process.env.DBHOST2);
var db2 = mongoose.createConnection(process.env.DBHOST3);

var db = mongoose.connection;

db.on("open",function(){
  console.log("connected to database...");
});

//Middleware
var urlencodedparser = bodyParser.urlencoded({ extended: false });

//Authentication function
function pageAccess(req,res,next){
	if(req.isAuthenticated()){
		next();
	}
	else {
		res.redirect("/login");
	}
}
var errors = undefined;
//App Routes
router.get("/home" || "/",function(req,res){
  Posts.find({},function(err,posts){
    if(err){
      console.log(err);
    }
    else {
      res.render("index",{data: posts,user:req.user});
    }
  });
});

router.get("/login",function(req,res){
	   
		res.locals.error = errors;
		console.log(res.locals.error);
		res.render("login",{
  	user:req.user
  });
});
router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/login");
});
router.get("/users",function(req,res){
  Article.find({},function(err,users){
    if(err){
      console.log(err);
    }
    else {
      res.render("users",{data: users,user:req.user});
    }
  });
});
router.get("/users/:id",pageAccess,function(req,res){
  Posts.findOne({_id: req.params.id},function(err,data){
    if(err){
      console.log(err);
    }
    else {
      res.render("posts",{
        post:data,
        user:req.user
      });
    }
  });
  
});
router.get("/admin",pageAccess,function(req,res){
	var info = {
    username: req.user.username,
    email: undefined,
    password:undefined,
    posts:undefined
  };
	Article.findOne({email:req.user.email},function(err,data){
  	info.username = data.email;
  	info.email = data.email;
  	
  	//console.log(req.user)
  	console.log(data.email);
  	if(err){
  		console.log(err);
  	}
  	else{
  		
  	 Posts.find({"author":data.email},function(err,posts){
            if(err){
              //console.log(err)
            }
            else {
             author = data.email;
             console.log(data.email)
              postCount = posts;
              //console.log(postCount)
              if(postCount){
                var Cont;
                function contact(){
                  return new Promise(function(resolve,reject){
                    Contact.find({"to":data.email},function(err,data){
                      if(err){
                       // console.log(err);
                      }
                      else {
                        Cont = data;
                      }
                      resolve();
                    })
                  });
                }
                contact().then(function(){
                  res.render("admin",{data : info,post:postCount,contact:Cont,user:req.user});
                  
                });
                
              }
              else {
                res.redirect("home?nodata");
              }
              
            }
          });
          }
          });
})
router.get("/contact",function(req,res){
	res.locals.error = errors;
  res.render("contact",{data:"",user:req.user});
});
router.get("/dashboard/:id",pageAccess,function(req,res){
  
  Contact.findOne({_id: req.params.id},function(err,data){
    if(err || data === null){
      res.sendStatus(404);
    }
    else {
      res.render("dashboard",{
        contact:data,
        user:req.user
      });
    }
  });
});

router.get("/edit/:id",pageAccess,function(req,res){
	Posts.findOne({_id:req.params.id},function(err,data){
		if(err){
			console.log(err);
		}
		else if(data){
		    if(req.user.email == data.author){
			   res.render("edit",{post:data,user:req.user})
			}else {
				res.redirect("/home");
			}
	    }
		else {
			res.redirect("/login");
		}
	});
	
});
router.get("/reset",function(req,res){
	res.render("reset-password",{
		user:req.user
	});
})
router.get("/reset/:token",function(req,res){
	Article.findOne({"token":req.params.token},function(err,data){
		if(err){
			console.log(err)
		}else if(data === null || !data) {
			res.sendStatus(401);
		}else {
			console.log(data);
			res.locals.error= null;
			resetPassword.gettoken(req.params.token);
			res.render("password-input",{user:req.user})
			
		}
	})
})
router.get("/verifyemail/:token",function(req,res){
	useremail.emailtoken(req,res);
})

var author = undefined;
var postCount;


//POST Data Entry
router.post("/signup",urlencodedparser,function(req,res){
	useremail.getuser(req,res);
});


router.post("/posts",urlencodedparser,function(req,res){
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var Content = new Posts({
    title: req.body.title,
    post: req.body.post,
    author: author,
    time:(hours + ":" + minutes + ":" + seconds)
  });
  Content.save(function(err){
    if(err){
      console.log(err);
    }
    else {
      res.redirect("home?datasaved");
    }
  });
});


router.post("/login",passport.authenticate("local",{
	failureRedirect:"/login",
	successRedirect:"/admin"
}) ,function (req,res,next){
    next();
});




router.post("/contact",urlencodedparser,function(req,res){
	var sender = req.body.sender;
	var email = req.body.email;
	var message = req.body.message;
	var to = req.body.to;
	errors = undefined;
	
	req.checkBody("sender","Enter Sender").notEmpty();
	req.checkBody("email","Enter Valid Email").isEmail();
	req.checkBody("message","Enter Your Message").notEmpty();
	req.checkBody("to","Enter Valid Email").isEmail();
	errors = req.validationErrors();
	if(errors){
		res.locals.error = errors;
		res.redirect("/contact");
	}else{
		var contact = new Contact({
    sender:sender,
    email:email,
    message:message,
    to:to
  });
	
  Article.findOne({email:req.body.to},function(err,data){
    if(err){
      console.log(err);
    }
    else if(data === null){
      console.log(data);
      res.render("contact",{
        data:"No such a user found",
        user:req.user
      });
    }
    else {
      contact.save(function(err){
        if(err) throw err;
        console.log("Data saved...");
        res.redirect("home?data=sended");
      });
    }
  });
  }
});
router.post("/edit/",function(req,res){
	var title = req.body.title;
	var post = req.body.post;
	
	req.checkBody("title","Post Title").notEmpty();
	req.checkBody("text","Post Text").notEmpty();
	errors = null;
	errors = req.validationErrors();
	Posts.findOneAndUpdate({author:req.user.email},{
		title:title,
		post:post,
		author:req.user.email
	},function(err,data){
		if(err) throw err;
		else {
			console.log("done...");
			res.redirect("/home");
		}
	})
})
router.delete("/delete/:id",function(req,res){
	Posts.findOne({author:req.user.email},function(err,data){
		if(err) throw err;
		else if(!data || data === null){
			res.redirect("/login");
		}
		else{
	Posts.findByIdAndDelete({_id:req.params.id},function(err,data){
		if(err){
			console.log(err)
		}else{
		console.log("Post Deleted...");
		}
	}).then(function(data){
		console.log(data)
		res.send("Done");
	})
	}
	});
})
router.post("/reset",function(req,res){
	
	resetPassword.getusername(req,res);
	
})
router.post("/user/password",function(req,res){
	resetPassword.password(req,res);
})
module.exports = router;
    
    
    
    
    
    
    
    
    
    
