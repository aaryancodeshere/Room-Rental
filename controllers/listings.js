const Listing = require("../models/listing");


module.exports.index=async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index", {allListings});
}

module.exports.renderNewForm= (req,res)=>{
    res.render("listings/new");
  }

module.exports.showListing = async(req,res,next)=>{
  
    const {id}= req.params;
    const listing = await Listing.findById(id)
            .populate({
              path : 'reviews',
              populate: {
                path : "author",
              }
            }).populate('owner');
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});

  
}


module.exports.createListing = async(req,res)=>{
     const url = req.file.path;
     const filename = req.file.filename;

     const newListing = new Listing(req.body.listing);
     newListing.image = {url,filename};
     
     newListing.owner = req.user._id;
     await newListing.save(); 
     req.flash("success","New listing added!");
     res.redirect("/listings");
  
  }

module.exports.editListing=async(req,res,next)=>{
    const {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/edit", {listing});       
}

module.exports.updateListing = async(req,res,next)=>{
    let {id} = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(req.file){
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`)  
}

module.exports.deleteListing = async(req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
 
}