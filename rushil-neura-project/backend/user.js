const express = require('express')
const router = express.Router()
const User = require('./userModel')
//controller functions


const {loginUser, SignUpUser} = require('./userControl')

//login route
router.post('/login', loginUser)


//signup route
router.post('/signup', SignUpUser)


module.exports = router