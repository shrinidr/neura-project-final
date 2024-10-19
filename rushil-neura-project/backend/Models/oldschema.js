const mongoose = require('mongoose')

const data_schema = new mongoose.Schema({
    id: String,
    content: String
})

const daily_schema = new mongoose.Schema({
    date: {type: Date, required: true, unique: false},
    entries: [data_schema]
})

//this is the model which is basically like a blueprint.
const DataModel = mongoose.model("DataModel", daily_schema)
module.exports = DataModel;