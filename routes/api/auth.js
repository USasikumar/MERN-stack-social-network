const express = require('express');
const router = express.Router();
const auth =  require('../../middleware/auth');
const User = require('../../models/User')
const config = require('config')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

router.get('/', auth, async (req,res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch{
        console.log(err.message);
        res.status(500).send('Server Error')
    }
});

router.post('/', [
    check('email','please include a valid email').isEmail(),
    check('password','password is requid').exists()
], async (req,res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email, password} = req.body;
    try {
        let user = await User.findOne({ email })
        if (!user){
            return res.status(400).json({errors:[{msg:"invalid credentials"}]})
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch){
            return res.status(400).json({errors:[{msg:"invalid password"}]})
        }

        const payload = {
            user:{
                id: user.id
            }
        }
        jwt.sign(payload,config.get('jwtToken'),{
            expiresIn: 360000
        },(err, token)=>{
            if(err) throw err;
            res.json({token})
        });
    } catch(err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }
});

module.exports = router;