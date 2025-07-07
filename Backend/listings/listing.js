const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { storage } = require('../cloudinary/cloudinary');
const Listing = require('../models/listing');
const multer = require('multer');
const upload = multer({ storage });
const passport = require('passport');

router.post('/create', passport.authenticate('jwt', { session: false }),
    upload.array('images', 5), async (req, res) => {
        try {
            const availableDatesRaw = req.body.availableDates;
            const availableDatesFinal = availableDatesRaw.split(',').map(date => new Date(date.trim()));
            const imageUrls = req.files.map(file => file.path)
            const newListings = new Listing({
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                location: {
                    address: req.body.address,
                    city: req.body.city
                },
                hostId: req.user._id,
                images: imageUrls,
                maxGuests: req.body.maxGuests,
                availableDates: availableDatesFinal
            })

            await newListings.save();
            res.status(200).json({ message: "Listings created successfully", newListings })
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Internal Server Error!" })
        }
    })


router.get('/allListings', async (req, res) => {
    try {
        const listing = await Listing.find();
        res.status(200).json({ message: "all Listings fetched", data: listing })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error!" })
    }
})

router.get('/filteredListings', async (req, res) => {
    try {
        const { city, minPrice, maxPrice, maxGuests, hostId } = req.query;
        const filter = {}

        if (city) filter['location.city'] = city;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (maxGuests) filter.maxGuests = { $gte: Number(maxGuests) };
        if (hostId) filter.hostId = hostId;

        const listings = await Listing.find(filter);
        res.status(200).json({ message: "filtered listings are:", data: listings })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error!" })
    }
})

router.get('/listings/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" })
        }
        res.status(200).json({ message: "Listing fetched", data: listing });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error!" })
    }
})

router.put('/listings/:id', passport.authenticate('jwt', { session: false }), upload.array('images', 5), async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" })
        }
        if (listing.hostId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: Not your listing" });
        }

        const updateFields = {}

        if (req.body.title) updateFields.title = req.body.title;
        if (req.body.description) updateFields.description = req.body.description;
        if (req.body.price) updateFields.price = req.body.price;
        if (req.body.address || req.body.city) {
            updateFields.location = {
                address: listing.location.address,
                city: listing.location.city,
            }
            if (req.body.address) updateFields.location.address = req.body.address;
            if (req.body.city) updateFields.location.city = req.body.city;
        }

        if (req.body.maxGuests) updateFields.maxGuests = req.body.maxGuests;
        if (req.body.availableDates) updateFields.availableDates = req.body.availableDates.split(',').map(date => new Date(date.trim()));
        if (req.files && req.files.length > 0) {
            updateFields.images = req.files.map(files => file.path);
        }

        const UpdatedListing = await Listing.findByIdAndUpdate(req.params.id,
            { $set: updateFields },
            { new: true }
        );
        res.status(200).json({ message: "Listing updated", data: UpdatedListing });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error!" })
    }
})

router.delete('/deleteListing/:id',passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const id= req.params.id
    try{
        const listing= await Listing.findById(id);

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" })
        }
        if (listing.hostId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: Not your listing" });
        }

        await Listing.findByIdAndDelete(id);
        res.status(200).json({message:"deleted successfully!"});
    }catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error!" })
    }
})
module.exports = router;

