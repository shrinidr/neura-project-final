const mongoose = require('mongoose');
const express = require('express')
const BodyParser =  require('body-parser')
const cors = require('cors')
const DataModel = require('./schema')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(BodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/neura-react-server').then(()=>{
    console.log("connected")})
.catch(()=>{
    console.log("Failed");
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


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


})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});