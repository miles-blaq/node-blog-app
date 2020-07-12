require('dotenv').config()
const express        = require("express"),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    blogMod        = require("./models/blogScheme"), //require blog scheme
    commentMod     = require("./models/commentScheme"),
    methodOverride = require("method-override"), //require method-override
    passport       = require("passport"),
    localStrategy  = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    userMod        = require("./models/users"),
    middleware     = require("./middleware"),
    flash          = require("connect-flash");


 mongoose.connect(process.env.DATABASEURL,{useNewUrlParser: true})
mongoose.set('useFindAndModify', false);

//require routes ***************************************************************************
var blogRoute = require("./routes/blogRoutes"),
    commentRoute = require("./routes/commentRoutes"),
    authRoute    = require("./routes/authRouthes");

//app config ************************************************************************
var app = express();  
app.set("view engine","ejs")  
//use body-parser
app.use(bodyParser.urlencoded({extended:true}))
//use public dir
app.use(express.static(__dirname+"/public"))

//use method-override
app.use(methodOverride("_method"))
//use flash
app.use(flash());

//passpotrt config ************************************************************************************
app.use(require("express-session")({
    secret:"hakuna matata",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(userMod.authenticate())); //autheticates user,facilitates login
passport.serializeUser(userMod.serializeUser())
passport.deserializeUser(userMod.deserializeUser());

//check current logged in user to use in .ejs*********************************************************
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error")
    res.locals.success     = req.flash("success")
    next();
})

//routes *************************************************************************************
app.use(blogRoute)
app.use(commentRoute);
app.use(authRoute);






//listen ********************************************
app.listen(3000,function(){
    console.log("rendering project 1")
});