const express = require("express"),
    router  = express.Router(),
    multer  = require("multer"),
    {cloudinary,storage}  = require("../cloudinary"),
    // upload    =multer({"dest":"uploads/"});
    upload  = multer({ storage }),
    blogMod  = require("../models/blogScheme"),
    middleware = require("../middleware");

    //create new campground ************************************************************************************
router.get("/blogs/new",middleware.isLoggedIn,function(req,res){
    res.render("newBlog")
});
router.post("/blogs",upload.single("image"),middleware.isLoggedIn,function(req,res){
    req.body.blogInfo.image ={}
    console.log(req.file)
    cloudinary.uploader.upload(req.file.path,function(error, result){
        if(error){
            console.log(error)
            return res.redirect("back")
        }
            req.body.blogInfo.image.url=result.secure_url,
            req.body.blogInfo.image.public_id=result.public_id
            
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
router.put("/blogs/:id",upload.single("image"),middleware.checkBlogOwner,function(req,res){
    blogMod.findById(req.params.id,async function(err, foundBlog){
        if(err){
            req.flash("error",err.message);
            res.redirect("back")
        }else{
            if(req.file){
                try {
                    await cloudinary.uploader.destroy(foundBlog.image.public_id);
                    let result = await cloudinary.uploader.upload(req.file.path);
                    foundBlog.image.url = result.secure_url;
                    foundBlog.image.public_id= result.public_id;
                } catch (error) {
                    req.flash("error",err.message);
                    res.redirect("back")
                }
            }
            foundBlog.title = req.body.blogInfo.title;
            foundBlog.description = req.body.blogInfo.description
            await foundBlog.save();    
            req.flash("success","post Updated");
            res.redirect("/blogs/"+req.params.id)
        }
    });
    
})
//destroy route *******************************************************
router.delete("/blogs/:id",middleware.checkBlogOwner,function(req,res){
    blogMod.findById(req.params.id,async function(err,deletedCamp){
        if(err){
            req.flash("error",err.message);
            return res.redirect("back");
        }
        try {
            await cloudinary.uploader.destroy(deletedCamp.image.public_id);
            await commentMod.deleteMany( {_id:{ $in: deletedCamp.comments}})
            await deletedCamp.remove();
            req.flash("success","post deleted");
            res.redirect("/blogs")
        } catch (error) {
            req.flash("error",err.message);
            return res.redirect("back");
        }
    })
})


module.exports = router;