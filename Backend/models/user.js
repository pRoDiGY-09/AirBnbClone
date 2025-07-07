const mongoose= require('mongoose');

const User= new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role: {
    type: String,
    enum: ["guest", "host", "admin"],
    default: "guest"
  },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profileImage:String
})

module.exports=mongoose.model('User',User);