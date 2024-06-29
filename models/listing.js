const mongoose= require("mongoose");
const Schema= mongoose.Schema;
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
            default: "default-url"
        }
    },
    price: Number,
    location: String,
    country: String,
});
const Listing= mongoose.model("Listing", listingSchema);
module.exports = Listing;
