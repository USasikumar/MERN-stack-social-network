const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator')
const Post = require('../../models/Posts')
const Profile = require('../../models/Profile')

router.post('/', [auth,[
    check('text','Text is required').not().isEmpty()
]], async (req,res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    
    try {
        const user = await User.findById(req.user.id).select('-password')
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        await newPost.save()
        res.json({newPost})
    } catch(err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }

});

router.get('/', auth , async (req,res) => {
    try {
        const post = await Post.find({user:req.user.id}).sort({date:-1});
        res.json({post})
    } catch(err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }

});

router.get('/:id', auth , async (req,res) => {
    try {
        const post = await Post.findOne({_id:req.params.id});
        if(!post){
            return res.status(404).json({msg:'Post not found'})
        }
        res.json({post})
    } catch(err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }

});

router.delete('/:id', auth , async (req,res) => {
    try {
        const post = await Post.findById({_id:req.params.id});
        if(!post){
            return res.status(404).json({msg:'Post not found'})
        }
        if(post.user.toString()==req.user.id){
            await post.remove();
            return res.status(404).json({msg:'Post deleted'})
        }else{
            return res.status(404).json({msg:'Cannot delete post'})
        }
    } catch(err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }

});

//to be done
router.put('/likes/:id', auth , async (req,res) => {
    try {
        const post = await Post.find({user:req.user.id}).sort({date:-1});
        res.json({post})
    } catch(err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }

});

module.exports = router;