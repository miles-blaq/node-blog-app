var blogMod     = require("../models/blogScheme"),
    commentMod  = require("../models/commentScheme");

var middlewareObj = {}
//auhtorization
//checkBlogOwner *******************************************************************
middlewareObj.checkBlogOwner = function(req,res,next){
    if(req.isAuthenticated()){
        blogMod.findById(req.params.id,function(err,foundBlog){
            if(err || !foundBlog){
                res.status(400).send("item not found")
            }else{
                //check if current user id matches id of the user that created post
                if(foundBlog.author.id.equals(req.user._id)){
                    res.locals.blogsH = foundBlog; //setting blogsH to foung blog globally,so as not to call it again in routes {blogsH : foundBlog}
                    next();
                }else{
                    req.flash("error","permission denied");
                    res.redirect("back")
                }
            }
        })
    }else{
        //login
        req.flash("error","please login to continue");
        res.redirect("/login")
    }
}
//check comment owner *******************************************************************
middlewareObj.checkCommentOwner = function(req,res,next){
    if(req.isAuthenticated()){
        commentMod.findById(req.params.comment_id,function(err,foundComment){
            if(err || !foundComment){
                res.status(400).send("item not found")
            }else{
                //check if current user id matches id of user that created the comment
                if(foundComment.author.id.equals(req.user._id)){
                    res.locals.commentsH = foundComment;
                    next()
                }else{
                    req.flash("error","permission denied");
                    res.redirect("back");
                }
            }
        })
    }else{
        //redirect to comment
        req.flash("err","please login to add comment");
        res.redirect("/login")
    }
}

 //is logged in ************************************************************   
 middlewareObj.isLoggedIn = function(req,res,next){
     if(req.isAuthenticated()){
         return next();
     }else{
         req.flash("error","please login to add a post")
         res.redirect("/login")
     }
 }

 module.exports = middlewareObj;