const express = require("express");
const app = express();
const mongoose =  require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  console.log("Connected to DB");
}



app.listen(3000,()=>{
    console.log("Connected!");
});



//index route

app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index", {allListings});
}))

//new route
app.get("/listings/new", (req,res)=>{
  res.render("listings/new");
})

//Create route

app.post("/listings",wrapAsync(async(req,res)=>{
  const newListing = new Listing(req.body.listing);
   await newListing.save(); 
   res.redirect("/listings");

}))

//show route

app.get("/listings/:id", wrapAsync(async(req,res,next)=>{
  
    const {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});

  
}))

//edit route
app.get("/listings/:id/edit", wrapAsync(async(req,res,next)=>{
        const {id}= req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit", {listing});       
}))

//Update Route

app.put("/listings/:id", wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`)  
}))

//Delete Route

app.delete("/listings/:id", wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
 
}))
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
 let {status=500, message} = err;
 res.status(status).render("listings/error.ejs",{message});
})