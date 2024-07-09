const mongoose = require('mongoose')


const data_schema = new mongoose.Schema({
    id: String,
    content: String
})

//this is the model which is basically like a blueprint.
const DataModel = mongoose.model("DataModel", data_schema)
module.exports = DataModel;

