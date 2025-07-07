const mongoose = require('mongoose');
const { type } = require('os');

const Bookings= new mongoose.Schema({
    guestId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    listingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Listings',
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    totalPrice:Number,
    guests:Number,
    createdAt: { type: Date, default: Date.now }
})

module.exports=mongoose.model('Bookings',Bookings)