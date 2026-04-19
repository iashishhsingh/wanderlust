const mongoose=require('mongoose')
const initData=require('./data.js');
const Listing=require("../models/listing.js");


const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust'

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
.then(()=>{console.log("DB connected")})
.catch((err)=>console.log(err)); 

const initDB=async ()=>{
    await Listing.deleteMany({});
    // console.log(initData.data) array
    initData.data=initData.data.map((obj)=>({
      ...obj,
      owner:"699ee339696088626c088936"
    }))
    await Listing.insertMany(initData.data);
    console.log("Data was saved")

}

initDB(); 