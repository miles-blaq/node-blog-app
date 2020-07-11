var express = require("express"),
    router  = express.Router(),
    multer  = require("multer"),
    upload  = multer({ storage }),
    blogMod  = require("../models/blogScheme"),
    middleware = require("../middleware");



//create new campground ************************************************************************************
router.get("/blogs/new",middleware.isLoggedIn,function(req,res){
    res.render("newBlog")
});
router.post("/blogs",middleware.isLoggedIn,function(req,res){
    blogMod.create(req.body.blogInfo,function(err,newBlog){
        if(err){
            console.log(err)
        }else{
            newBlog.author.id = req.user._id;
            newBlog.author.username = req.user.username;
            newBlog.save();
            res.redirect("/blogs")
        }
    })
})
//show route ********************************************************
router.get("/blogs/:id",function(req,res){
    blogMod.findById(req.params.id).populate("comments").exec(
        function(err,foundBlog){
        if(err){
            console.log(err)
        }else{
            res.render("show",{blogsH : foundBlog})
        }
    })
})
//edit and update ********************************************************
router.get("/blogs/:id/edit",middleware.checkBlogOwner,function(req,res){
    res.render("editBlog")
})
router.put("/blogs/:id",middleware.checkBlogOwner,function(req,res){
    blogMod.findOneAndUpdate(req.params.id,req.body.blogInfo,function(err,foundBlog){
        if(err){
            console.log(err)
        }else{
            res.redirect("/blogs/"+req.params.id)
        }
    })
})
//destroy route *******************************************************
router.delete("/blogs/:id",middleware.checkBlogOwner,function(req,res){
    blogMod.findByIdAndRemove(req.params.id,function(err,deletedCamp){
        if(err){
            console.log(err)
        }else{
            //find all associated comments and delete
            commentMod.deleteMany( {_id:{ $in: deletedCamp.comments}},function(err){
                if(err){
                    console.log(err)
                }else{
                    res.redirect("/blogs")
                }
            })

            }
    })
})




// commentMod.deleteMany( {_id: { $in: removedCamp.comments } }, (err) => {
//     if (err) {
//         console.log(err);
//     }
//     req.flash("success","post removed")
//     res.redirect("/campgrounds")


module.exports = router;