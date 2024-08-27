



//login user
const loginUser = async (req, res) => {

    res.json({msg: 'login user'})
}

//signup user
const SignUpUser = async (req, res) => {

    res.json({msg: 'signup user'})
}

module.exports = {loginUser, SignUpUser}