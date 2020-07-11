var express = require("express"),
    router = express.Router();
    commentMod = require("../models/commentScheme"),
    blogMod     = require("../models/blogScheme"),
    middleware  = require("../middleware")

//adding comments to campground ************************************************************************************
router.get("/blogs/:id/comments/new",middleware.isLoggedIn,function(req,res){
    blogMod.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err)
        }else{
            res.render("newComment",{blogsH : foundBlog});
        }
    })
})

router.post("/blogs/:id/comments",middleware.isLoggedIn,function(req,res){
    //find by id
    blogMod.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err)
        }else{
            //create comment
            commentMod.create(req.body.commentInfo,function(err,createdComment){
                if(err){
                    console.log(err)
                }else{
                    //associate user data to comment
                    createdComment.author.id = req.user._id
                    createdComment.author.username = req.user.username
                    //save
                    createdComment.save();
                    //push comments to blog and save
                    foundBlog.comments.push(createdComment)
                    foundBlog.save();
                    //redirect
                    res.redirect("/blogs/" + req.params.id)
                }
            })
        }
    })
})  
//editing and updating comment ***********************************************************************************
router.get("/blogs/:id/comments/:comment_id/edit",middleware.checkCommentOwner,middleware.checkBlogOwner,function(req,res){
    res.render("editComment")
})
//update
router.put("/blogs/:id/comments/:comment_id",middleware.checkCommentOwner,function(req,res){
    commentMod.findByIdAndUpdate(req.params.comment_id,req.body.commentInfo,function(err,updatedComment){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/blogs/"+req.params.id)
        }
    })
})
//delete route **********************************************************************************
router.delete("/blogs/:id/comments/:comment_id",middleware.checkCommentOwner,function(req,res){
    commentMod.findOneAndDelete(req.params.comment_id,function(err){
        if(err){
            console.log(err)
        }
        res.redirect("/blogs/"+req.params.id)
    })
})



//***********************************************************************************
module.exports = router;