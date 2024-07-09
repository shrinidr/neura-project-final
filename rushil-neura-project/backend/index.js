const mongoose = require('mongoose');
const express = require('express')
const BodyParser =  require('body-parser')
const cors = require('cors')

const DataModel = require('./schema')

const app = express()
const PORT = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(BodyParser.json())
//connecting to database

mongoose.connect('mongodb://localhost:27017/neura-server')
.then(()=>{
    console.log("connected")})
.catch(()=>{
    console.log("Failed");
})


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a route to handle incoming data
app.post('/api/data', async (req, res) => {
  const { formData } = req.body;

  const dataArr = Object.keys(formData).map(key => ({
    id: key,
    content: formData[key]
  }));

  try {
    for (const dataCol of dataArr) {
      const existingData = await DataModel.findOne({ id: dataCol.id });
      if (existingData) {
        existingData.content = dataCol.content;
        await existingData.save();
      } else {
        const newData = new DataModel(dataCol);
        await newData.save();
      }
    }
    res.status(200).json({ message: 'Data submitted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})
//we already have imported the mongoose model based off of our dataschema and we can use it directly in our post
// request.



app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`)
})

