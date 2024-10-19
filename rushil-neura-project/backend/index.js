require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser'); // Make sure to use raw body parsing
const cors = require('cors')
const UserModel = require('./Models/schema')
const {Svix, Webhook} = require('svix');
const fs = require('fs');
const DataModel = require('./Models/oldschema')

const app = express();
const PORT = 3000

// Middleware
app.use(cors())
app.use(bodyParser.raw({ type: 'application/json' }));  // Raw body parsing for webhook

//app.use(BodyParser.json());
///app.use(express.json())

const uri = process.env.MONGO_URI;
const journalData = JSON.parse(
  fs.readFileSync('C:/Users/rushi/Downloads/neura-react-server.datamodels.json', 'utf8')
);
//mongoose connection string for local compass: 'mongodb://localhost:27017/neura-react-server

mongoose.connect(uri).then(()=>{
    console.log("connected")})
.catch(()=>{
    console.log("Failed");
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.post('/api/webhooks/signupclerk', async (req, res) => {
  try {
    console.log("Received webhook request");

    // Step 1: Check the raw body
    const payload = req.body.toString();
    console.log("Raw Payload:", payload); // Log the raw payload

    // Step 2: Check headers and ensure they’re valid
    const headers = req.headers;
    console.log("Headers:", headers);

    // Step 3: Verify the webhook payload (temporarily disable if necessary)
    const wh = new Webhook(process.env.WEBHOOK_SECRET);
    const evt = wh.verify(payload, headers);
    console.log("Webhook verified:", evt); // Log the verified event

    // Extract data from the verified event
    const { id: userId, email_addresses, username, image_url } = evt.data;
    const email = email_addresses[0].email_address;
    const eventType = evt.type;

    console.log(`Event Type: ${eventType}`);

    if (eventType === "user.created") {
      console.log(`Creating user with ID: ${userId}`);

      // Create a new user
      const newUser = new UserModel({
        userId,
        email,
        username: username || null,
        profileImageUrl: image_url || null,
        journal: [],
      });

      await newUser.save(); // Save the user to MongoDB
      console.log("User saved successfully");

      // Send success response
      return res.status(200).json({ success: true, message: "Webhook received" });
    } else {
      console.log("Invalid event type");
      return res.status(400).json({ success: false, message: "Invalid event type" });
    }
  } catch (err) {
    console.error("Error during webhook processing:", err); // Log the error details
    return res.status(400).json({ success: false, message: "webhook not rcd", error: err.message });
  }
});

function preprocessJournalData(data) {
  return data.map((entry) => ({
    ...entry,
    date: new Date(entry.date["$date"]), // Convert $date to Date object
    entries: entry.entries.map((e) => ({
      ...e,
      _id: e._id["$oid"], // Convert _id to string if needed
    })),
    _id: entry._id["$oid"], // Convert outer _id to string if needed
  }));
}


const userId = 'user_2nfHQVBgWgA5kOhtOYwyHEuKkrn';
async function assignJournalToUser() {
  try {
    const processedJournalData = preprocessJournalData(journalData);

    const updatedUser = await UserModel.findOneAndUpdate(
      { userId: userId }, // Find the user by their unique ID
      { $set: { journal: processedJournalData } }, // Set the journal field
      { new: true }
    );

    if (updatedUser) {
      console.log('User journal updated successfully:', updatedUser);
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error updating user journal:', error);
  }
}

assignJournalToUser();



app.post('/api/signup', async (req, res) => {
  console.log(req.body)
  const { userId, email } = req.auth.sessionClaims;
  //const { userId, email } = req.body; // Clerk provides userId and email from the session

  try {
    // Check if the user already exists (prevent duplicate users)
    const existingUser = await UserModel.findOne({ _id: userId });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user document with an empty dailyEntries array
    const newUser = new UserModel({
      _id: userId, // Clerk userId as the MongoDB document _id
      email: email, // User's email from Clerk
      dailyEntries: [] // Initialize with no daily entries
    });

    // Save the user document to the database
    await newUser.save();
    console.log(newUser)
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

//Still follows old schema.
app.post('/api/data', async (req, res) => {
  const { formData, date } = req.body;

  const dataArr = Object.keys(formData).map(key => ({
    id: key,
    content: formData[key],
  }));

  try {
      // Create a new entry for the day
      const newEntry = new DataModel({entries: dataArr, date })
      await newEntry.save();

    res.status(200).json({ message: 'Data submitted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/getItems', async (req, res) => {

  const {date} = req.query;
  try{
    const response = await DataModel.find({date: new Date(date)})
    const newResp = response[0]['entries']
    const sendingResp = newResp.map(item => ({ id: item.id, content: item.content }));
    res.json(sendingResp)
  }
  catch(err){
    res.status(500).json({ message: err.message });
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});