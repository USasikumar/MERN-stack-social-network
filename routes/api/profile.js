const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const request = require('request');
const {check, validationResult} = require('express-validator')
const config = require('config')

router.get('/me', auth, async (req,res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user',['name','avatar'])
        if (!profile){
            return res.status(400).json({msg:'there is no profile for this user'})
        }
    } catch(err){
        console.log(err)
        res.status(500).send('server error')
    }
});

router.post('/', [auth,[
    check('status','status is required').not().isEmpty(),
    check('skills','skills is required').not().isEmpty(),
]], async (req,res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {company, website, location, bio, status, githubusename, skills, youtube, facebook, twitter, instagram, linkedin} = req.body;
    const profileFields={};
    profileFields.user=req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusename) profileFields.githubusename = githubusename;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill=>skill.trim());
    }
    profileFields.social={}
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    
    try {
        let profile = await Profile.findOne({ user:req.user.id })
        if (profile){
            profile = await Profile.findOneAndUpdate(
                { user:req.user.id },
                { $set:profileFields },
                { new:true }
                )
                return res.json(profile)
        }
        profile =  new Profile(profileFields)
        await profile.save()
        res.json(profile)
    } catch(err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }
});

router.get('/', async (req,res) => {
    try {
        const profile = await Profile.find().populate('user',['name','avatar'])
        res.json(profile)
    } catch(err){
        console.log(err)
        res.status(500).send('server error')
    }
});

router.get('/user/:user_id', async (req,res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user',['name','avatar'])
        if(!profile){
            return res.status(400).json({msg:"there is no profile"})
        }
        res.json(profile)
    } catch(err){
        console.log(err)
        res.status(500).send('server error')
    }
});

router.delete('/',auth, async (req,res) => {
    try {
        console.log(req.user)
        await Profile.findOneAndDelete({user: req.user.id})
        await User.findOneAndDelete({_id: req.user.id})
        res.status(200).json({msg:"deleted user"})
    } catch(err){
        console.log(err)
        res.status(500).send('server error')
    }
});

router.delete('/',auth, async (req,res) => {
    try {
        console.log(req.user)
        await Profile.findOneAndDelete({user: req.user.id})
        await User.findOneAndDelete({_id: req.user.id})
        res.status(200).json({msg:"deleted user"})
    } catch(err){
        console.log(err)
        res.status(500).send('server error')
    }
});

router.put('/experience',[auth,[
    check('title','Title is required').not().isEmpty(),
    check('company','Company is required').not().isEmpty(),
    check('from','from date is required').not().isEmpty()
]], async (req,res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {company, title, from, to, current, description} = req.body;
    const experienceField={};
    experienceField.user=req.user.id;
    if (company) experienceField.company = company;
    if (title) experienceField.title = title;
    if (from) experienceField.from = from;
    if (to) experienceField.to = to;
    if (current) experienceField.current = current;
    if (description) experienceField.description = description;
    try {
        const profile = await Profile.findOne({ user: req.user.id});
        profile.experience.unshift(experienceField)
        await profile.save()
        res.status(200).json({msg:"updated user"})
    } catch(err){
        console.log(err)
        res.status(500).send('server error')
    }
});

router.delete('/experience/:exp_id',auth, async (req,res) => {
    try {
        const experienceField={};
        const profile = await Profile.findOne({ user: req.user.id});
        const removeIndex = profile.experience.map(item => item.id).indexOf
        profile.experience.splice(removeIndex,1)
        res.status(200).json({msg:"experience removed"})
    } catch(err){
        console.log(err)
        res.status(500).send('server error')
    }
});

router.get('/github/:username', async (req,res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent':'node.js' }
        }
        request(options,(error,response,body)=>{
            if(error) console.error(error);
            if(response.statusCode!==200){
                return res.status(404).json({msg:'No Github profile found'})
            }
            res.json(JSON.parse(body))
        })
    } catch(err){
        console.log(err)
        res.status(500).send('server error')
    }
});

module.exports = router;