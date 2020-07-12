var mongoose = require("mongoose");
// var commentMod = require("../models/commentScheme")

var blogSchema = new mongoose.Schema({
    title:String,
    image:{url:String, public_id: String},
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"userMod"
        },username:String},
    comments:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment"
    }],
    dayCreated:{type:Date, default:Date.now}
})

module.exports = mongoose.model ("blog",blogSchema);