require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser'); // Make sure to use raw body parsing
const cors = require('cors')
const UserModel = require('./Models/schema')
const {Svix, Webhook} = require('svix');
const fs = require('fs');
const DataModel = require('./Models/oldschema')
const axios = require('axios');
const { requireAuth } = require('@clerk/express');
//const { ClerkExpressRequireAuth } = require('@clerk/express');

const app = express();
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors());
//app.use(bodyParser.raw({ type: 'application/json' }));  // This is the correct one.
//app.use(express.json())
//app.use(BodyParser.json());
///app.use(express.json())



/*app.use(requireAuth({
apiKey: process.env.CLERK_API_KEY, // Clerk API Key
}));*/


const uri = process.env.MONGODB_URI;


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

app.post('/api/webhooks/signupclerk', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
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

app.post('/api/signup', async (req, res) => {
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
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message});
}
});

//Still follows old schema.
app.post('/api/data', express.json(), requireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  console.log("Request Body:", req.body); // Log entire req.body for debugging
  const { formData, formattedDate: date } = req.body;
  console.log("User ID:", userId);
  console.log("data:", formData);
  console.log("date:", date);
  try {
    let user = await UserModel.findOne({ userId });
    const entry = {
      date,
      entries: Object.entries(formData).map(([id, content]) => ({ id, content })),
    };

    user.journal.push(entry);
    await user.save();
    res.status(200).json({ message: "Entry saved successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error saving entry" });
  }
});

app.get('/api/getItems', requireAuth(),  async (req, res) => {

  const { date } = req.query;
  const userId = req.auth.userId;
  try{
    const startDate = new Date(date); 
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1); 

    const user = await UserModel.findOne({ userId });
    if (!user) {
      return res.status(200).json([]); // Return an empty array instead of 404
    }
    const entry = user.journal.find(j =>
      j.date >= startDate && j.date < endDate
    );

    if (!entry) {
      return res.status(404).json({ message: 'No entries found for the specified date' });
    }
    // Prepare the response
    const sendingResp = entry.entries.map(item => ({
      id: item.id,
      content: item.content,
    }));
    res.json(sendingResp);
  }
  catch(err){
    res.status(500).json({ message: err.message });
  }
})



app.post('/api/auth/strava/callback', express.json(),  requireAuth(),  async (req, res) => {

  const userId = req.auth.userId; // Securely extracted from the session
  const { code } = req.body;

  if (!userId || !code) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

  try {
    // Exchange the authorization code for an access token
    const payload = {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    code: code,
    grant_type: 'authorization_code',
    };

    const stravaResponse = await axios.post('https://www.strava.com/oauth/token', payload);

    const stravaData = {
    stravaUserId: stravaResponse.data.athlete.id,
    accessToken: stravaResponse.data.access_token,
    refreshToken: stravaResponse.data.refresh_token,
    expiresAt: stravaResponse.data.expires_at,
    };

    const result = await UserModel.updateOne(
      { userId: userId }, // Match the current signed-in user
      { $set: { strava: stravaData } }, // Add or update the "strava" object
      { upsert: true } // Create the document if it doesn't exist
    );

    console.log(result)

    res.status(200).json({ message: 'Strava account linked successfully!' });
  }
  catch (error) {
        console.error('Error linking Strava:', error);
        res.status(500).json({ message: 'Failed to link Strava account' });
    }
});

app.get('/auth/strava', (req, res) => {
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.STRAVA_REDIRECT_URI)}&response_type=code&scope=read&approval_prompt=force`;

  // Redirect the user to the Strava authorization page
    res.redirect(authUrl);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});