const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const storage = cloudinaryStorage({
  cloudinary
  ,folder: 'subastas'
  ,allowedFormats: ['jpg', 'jpeg', 'png']
});


// const upload = multer({
//   dest: './public/images/uploads'
// });

module.exports = multer({storage});