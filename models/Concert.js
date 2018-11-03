const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const passportLocalMongoose = require('passport-local-mongoose');

const concertSchema = new Schema(
  {
    name: String
    ,date: String
    ,bands: [String]
    ,venueName: String
    ,venue: {
      type: {
        type: String
        ,default: "Point"
      },
      coordinates: [Number]
    }
    ,review: String
    ,rate: Number
    ,photos: [String]
    ,setlist: [String]
  },
  {
    timestamps: {
      createdAt: "created_at"
      ,updatedAt: "updated_at"
    }
  }
);

concertSchema.index({ venue: "2dsphere" });

//userSchema.plugin(passportLocalMongoose, {usernameField: "email"});

module.exports = mongoose.model("Concert", concertSchema);
