

const User = require('../Models/userModel')
const jwt = require('jsonwebtoken')


const createToken = (id) => {
    return jwt.sign({_id: id}, process.env.SECRET, {expiresIn: '3d'})

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
        res.status(200).json({email, user})

    }
    catch(error){
        res.status(400).json({error: error.message})

    }

    res.json({msg: 'signup user'})
}

module.exports = {loginUser, SignUpUser}