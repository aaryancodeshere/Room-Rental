if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}



const express = require("express");
const app = express();
const mongoose =  require("mongoose");
const path = require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


 

const listingsRouter = require("./routes/listing.js");
const reviewsRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");
const searchRouter = require("./routes/search.js");
const dbUrl = process.env.ATLAS_URL;

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60
})

store.on("error",()=>{
  console.log("Error in Mongo Session Store",err);
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 *7,
    maxAge: 1000 * 60 * 60 * 24 *7
  }
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currentUser = req.user || null;
    next(); 
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews/",reviewsRouter);
app.use("/",userRouter);
app.use("/",searchRouter);




//home route

app.get("/",(req,res)=>{
  res.redirect("/listings");
})



app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
 let {status=500, message} = err;
 res.status(status).render("listings/error.ejs",{message});
})


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connected to DB");
}

app.listen(3000,()=>{
  console.log("Connected!");
});