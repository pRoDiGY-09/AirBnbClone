const mongoose= require('mongoose');
const { type } = require('os');
const { title } = require('process');

const Listings =new mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    location:{
        address:String,
        city:String,
    },
    hostId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    images:[String],
    maxGuests:Number,
    availableDates:[Date]
})

module.exports=mongoose.model('Listings',Listings)