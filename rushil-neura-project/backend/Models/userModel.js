const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { options } = require('../Routes/user')


const Schema = mongoose.Schema

const UserSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

//static signup method
UserSchema.statics.signup = async function(email, password){

    const passwordOptions = {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    };

    if(!email || !password){
        throw Error("You must enter both the email and password")
    }

    if(!validator.isEmail(email)){
        throw Error("Incorrect email")
    }

    if(!validator.isStrongPassword(password, passwordOptions)){
        throw Error("You must have a strong password. A strong password will have: Minimum Length: 8 chars, Atleast one Upper Case, Lower Case, Number and Symbol.")
    }
    const exists = await this.findOne({email})
    if(exists){
        throw Error("Email already in use")
    }
    //salting removes the bug of one-to-one plain text to hash
    //correspondence when different users have the same password.
    //It adds a unique string which is called salt to each unique password.

    //10 is the number of rounds.

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({email, password: hash})

    return user
}


module.exports = mongoose.model('User', UserSchema)