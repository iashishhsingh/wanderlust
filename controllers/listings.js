
const Listing=require("../models/listing.js")
const maptiler = require("@maptiler/client");
maptiler.config.apiKey = process.env.MAP_KEY;


module.exports.index=async (req,res)=>{
    let allListing = await Listing.find({}) 
    // res.send(result);
    res.render("listings/index.ejs",{allListing});
}

module.exports.renderNewForm = async (req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.renderEditForm = async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","The Listing your are tryinng to accesss do not exists")
        return res.redirect("/listings")
    }
    let originalUrl = listing.image.url;
    originalUrl=originalUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing,originalUrl});
    }

module.exports.createListing = async (req,res,next)=>{

     try {
        if (!req.file) {
            req.flash("error", "Image upload failed");
            return res.redirect("/listings/new");
        }
        let url = req.file.path;
        let filename = req.file.filename;

          // 🔥 geocoding here
        const geoData = await maptiler.geocoding.forward(
            req.body.listing.location,
            { limit: 1 }
        );

         if (!geoData.features.length) {
        req.flash("error", "Invalid location");
        return res.redirect("/listings/new");
        }

        const newListing =new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image={url,filename};
        newListing.geometry = geoData.features[0].geometry;

        await newListing.save();
        req.flash("success","Added a new Listing");
        res.redirect("/listings");        
    }catch (err) {
        next(err); // VERY IMPORTANT
    }
};


module.exports.showListing = async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate:{path:"author"}}).populate("owner")
    if(!listing){
        req.flash("error","The Listing your are tryinng to accesss do not exists!")
        return res.redirect("/listings")
    } 
    // console.log(id);
    // console.log(listing);

    res.render("listings/show.ejs",{listing, mapKey:process.env.MAP_KEY})
    }

module.exports.updateListing= async (req,res)=>{
    let {id} = req.params;
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true})

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated Successfully")
    res.redirect(`/listings/${id}`);
    }

module.exports.deleteListing= async (req,res)=>{
        let {id}=req.params
        let deleted = await Listing.findByIdAndDelete(id);
        req.flash("success","Listing Deleted Successfully")
        console.log(deleted);
        res.redirect("/listings");
    }