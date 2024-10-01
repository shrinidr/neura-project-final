

const User = require('../Models/userModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})

}


//login user
const loginUser = async (req, res) => {

    res.json({msg: 'login user'})
}

//signup user
const SignUpUser = async (req, res) => {
    const {email, password} = req.body
    try{
        const user = await User.signup(email, password)

        //create a token
        const token = createToken(user._id)
        res.status(200).json({email, token})

    }
    catch(error){
        res.status(400).json({error: error.message})

    }

    res.json({msg: 'signup user'})
}

module.exports = {loginUser, SignUpUser}