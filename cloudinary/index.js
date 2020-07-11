const   crypto         = require("crypto"),
        cloudinary     = require("cloudinary");
cloudinary.config({
    cloud_name: "the-virtuoso",
    api_key: "121925842273717",
    api_secret: process.env.CLOUDINARY_SECRET
})
const cloudinaryStorage = require("multer-storage-cloudinary");
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "node-blog" ,
    allowedFormats : ["jpeg","jpg","png"],
    filename:function(req,file,cb){
        let buf = crypto.randomBytes(16);
        buf = buf.toString("hex");
        let uniqueFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, "");
        uniqueFileName += buf;
        cb(undefined,uniqueFileName)
    }
});

module.exports = { cloudinary, storage}