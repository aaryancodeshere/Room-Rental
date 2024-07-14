const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const Review = require("./review");
const listingSchema= new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "default-filename"
        },
        url: {
            type: String,
            required: false,
        }
        
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing.reviews.length>0){
        const reviews= await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing= mongoose.model("Listing", listingSchema);
module.exports = Listing;
