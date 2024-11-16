const mongoose = require('mongoose')

const data_schema = new mongoose.Schema({
    id: String,
    content: String
})


const daily_schema = new mongoose.Schema({
    date: {type: Date, unique: false}, //add unique=true if we get conflicts later on
    entries: [data_schema],
    stravaData: []
})


const stravaSchema = new mongoose.Schema({
    stravaUserId: String,
    accessToken: String,
    refreshToken: String,
    expiresAt: Number,
});

// User schema (each user has multiple daily entries)
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Clerk user ID
  email: { type: String, required: true }, // Primary email address
  username: { type: String }, // Username (if available)
  profileImageUrl: { type: String }, // URL of the user's profile image
  journal: [daily_schema], // Array of daily entries for the user
  strava: { type: stravaSchema }
});

//this is the model which is basically like a blueprint.
const UserModel = mongoose.model("User", userSchema)
module.exports = UserModel;

