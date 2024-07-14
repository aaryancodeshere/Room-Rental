const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");




//search Route

router.get("/search",wrapAsync(async(req,res)=>{
    try {
        const query = req.query.q || '';
        const listings = await Listing.find({ title: new RegExp(query, 'i') });
        res.render('listings/search.ejs', { listings, query }); // Pass both listings and query to the template
      } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while searching');
        res.redirect('/listings');
      }
}))


module.exports = router;