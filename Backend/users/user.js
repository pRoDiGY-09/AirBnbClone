const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();


router.post('/register', async (req, res) => {
    try {
        const checkEmail = await User.findOne({ email: req.body.email })
        if (!checkEmail) {
            const HashedPassword = bcrypt.hashSync(req.body.password, 10);
            const newuser = new User({
                name: req.body.name,
                email: req.body.email,
                password: HashedPassword,
                role: req.body.role,
                profileImage: req.body.profileImage
            })
            await newuser.save()
            res.status(200).json({ message: "User registered successfully" }, newuser)
        } else {
            res.status(200).json({ message: "Email already registered!" })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error!" })
    }
})
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const userNew = await User.findOne({ email })
        if (!userNew) {
            return res.json({ message: "user nOt found" })
        }

        const isMatch = await bcrypt.compare(password, userNew.password)
        if (!isMatch) {
            return res.json({ message: "Password incorrect" })
        } else {
            const payload = { id: userNew._id }
            const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' })
            res.json({
                success: true,
                token: 'Bearer ' + token,
                user: {
                    name: userNew.name,
                    email: userNew.email
                }
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error!" })
    }
})

router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({ user: req.user });
})

router.put('/updateProfile',passport.authenticate('jwt',{session:false}),async(req,res)=>{
    try{
        const update={}
        if (req.body.name) update.name =req.body.name;
        if (req.body.profileImage) update.profileImage =req.body.profileImage;
        if(req.body.password){
            update.password=bcrypt.hashSync(req.body.password,10);
        }

        const UpdateUser= await User.findByIdAndUpdate(
            req.user._id,
            {$set:update},
            {new:true}
        ).select('-password') 
        res.json({message:"profile Updated successfuly",user: UpdateUser})
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Internal Server Error!" })
    }
})

module.exports = router;