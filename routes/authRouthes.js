var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    userMod  = require("../models/users");

// home page ***************************************************************************
router.get("/",function(req,res){
    res.redirect("/blogs")
})

router.get("/blogs",function(req,res){
    blogMod.find({},function(err,foundBlogs){
        if(err){
            console.log(err)
        }else{
            res.render("home",{blogsH : foundBlogs})
        }
    }).sort( {"_id": -1} )
})    


 //registration route **************************************************************************************
 router.get("/register",function(req,res){
     res.render("register")
 })
 router.post("/register",function(req,res){
     userMod.register(new userMod({username:req.body.username}),req.body.password,function(err,createdUser){
         if(err){
             console.log(err)
         }else{
             passport.authenticate("local")(req,res,function(){
                 req.flash("success","welcome: "+ req.user.username)
                 res.redirect("/blogs")
             })
         }
     })
 })

//login route **********************************************************************************************
router.get("/login",function(req,res){
    res.render("login")
})
// router.post("/login", passport.authenticate("local",{
//     successRedirect:"/blogs",
//     failureRedirect:"/login",
//     successFlash:"welcome back "
// }),function(req,res){
// })
router.post("/login",function(req,res,next){
    passport.authenticate("local",function(err,user,info){
        if(err){
            return next(err);
        }
        if(!user){
            return res.redirect("/login");
        }
        req.login(user,function(err){
            if(err){
                return next(err)
            }
             req.flash("success","welcome back " + " " + user.username)
             res.redirect("/blogs");  //user.username
        })
        
    })(req,res,next);
    
})

//logout route **********************************************************************************************
router.get("/logout",function(req,res){
    req.logOut();
    req.flash("succces","logged out")
    res.redirect("/blogs");
})



// **************************************************************************************************************

module.exports = router;