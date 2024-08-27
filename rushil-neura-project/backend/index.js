const mongoose = require('mongoose');
const express = require('express')
const BodyParser =  require('body-parser')
const cors = require('cors')
const DataModel = require('./schema')
const UserRoutes = require('./user')

const app = express();
const PORT = process.env.PORT || 5000;


//User Routes connection
app.use('/api/user', UserRoutes)


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