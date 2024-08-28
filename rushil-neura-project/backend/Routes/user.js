const express = require('express')
const router = express.Router()
const User = require('../Models/userModel')
//controller functions


const {loginUser, SignUpUser} = require('../Controllers/userControl')

//login route
router.post('/login', loginUser)


//signup route
router.post('/signup', SignUpUser)


module.exports = router