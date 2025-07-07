const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const passport = require('passport');
require('./users/passportStrat')(passport);
const UserRoute= require('./users/user');
const bcrypt = require('bcryptjs');
const listingRoute= require('./listings/listing');
const bookingRouter=require('./bookings/booking');

port = 3000;

const app=express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use('/api',UserRoute);
app.use('/api',listingRoute);
app.use('/api',bookingRouter);

const URL= process.env.MONGO_URL;

mongoose.connect(URL)
.catch((err)=>{
    console.log(err)
})

app.listen(port,()=>{
    console.log("server up at port 3000");
})