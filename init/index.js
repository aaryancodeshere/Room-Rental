const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust').catch((err)=>{
    console.log("Error In connecting to DB");
  });
}

const initDB = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);

};
initDB();

