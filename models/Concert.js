const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

module.exports = mongoose.model("Concert", concertSchema);
