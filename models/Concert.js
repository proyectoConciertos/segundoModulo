const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const passportLocalMongoose = require('passport-local-mongoose');

const concertSchema = new Schema(
  {
    owner: {
        type: Schema.Types.ObjectId
        ,ref: 'User'
        ,required: true
      }
    ,name: String
    ,date: String
    ,bands: [String]
    ,venue: {
      type: {
        type: String
        ,default: "Point"
      },
      coordinates: [Number]
    }
    ,rate: Number
    ,photos: [String]
    ,Setlist: [String]
  },
  {
    timestamps: {
      createdAt: "created_at"
      ,updatedAt: "updated_at"
    }
  }
);

//userSchema.plugin(passportLocalMongoose, {usernameField: "email"});

module.exports = mongoose.model("User", concertSchema);
