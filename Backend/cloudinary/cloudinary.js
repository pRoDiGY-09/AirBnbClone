const cloudinary=require('cloudinary').v2;
require('dotenv').config();
const {CloudinaryStorage} =require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
});

const storage= new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'airbnb-listings',
        allowed_formats:['jpg', 'jpeg', 'png','avif']
    },
});

module.exports={cloudinary,storage};
