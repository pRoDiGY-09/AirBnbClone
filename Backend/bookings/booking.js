const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { storage } = require('../cloudinary/cloudinary');
const Listing = require('../models/listing');
const Booking = require('../models/booking');
const multer = require('multer');
const upload = multer({ storage });
const passport = require('passport');
const booking = require('../models/booking');


router.post('/booking', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { listingId, startDate, endDate, totalPrice, guests } = req.body;

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "listing not found" });
        }

        const conflict = await Booking.findOne({
            listingId,
            $or: [{
                startDate: { $lte: new Date(endDate) },
                endDate: { $gte: new Date(startDate) }
            }
            ]
        });
        if (guests > listing.maxGuests) {
            return res.status(404).json({ message: "too many guests!" })
        }
        if (conflict) {
            return res.status(409).json({ message: "already booked for the given dates" });
        }
        const nights = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

        if (nights < 1) return res.status(400).json({ message: 'Invalid date range' });

        const Price = nights * listing.price;

        const NewBoooking = new Booking({
            guestId: req.user._id,
            listingId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            totalPrice: Price,
            guests
        })

        await NewBoooking.save();
        return res.status(200).json({ message: "Booking created!", booking: NewBoooking });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "internal server error" })
    }
})

router.get('/mybookings',passport.authenticate('jwt',{session:false}),async(req,res)=>{
    try{
        const booking = await Booking.find({guestId: req.user._id}).populate('listingId');
        res.status(200).json({message:"Your bookings: ",data: booking});
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "internal server error" })
    }
});

router.get('/listingBooking/:listingId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId);
        if (!listing) return res.status(404).json({ message: "Listing not found" });

        if (listing.hostId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: Not your listing" });
        }
        const bookings = await Booking.find({ listingId: req.params.listingId }).populate('guestId');
        res.status(200).json({ message: "Bookings for this listing:", data: bookings });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" });
    }
});

router.delete('/listingBooking/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        if (booking.guestId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: Not your booking" });
        }
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Booking cancelled!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" });
    }
});

module.exports = router;