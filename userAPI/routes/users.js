const express= require("express");
const router=express.Router()
const User = require('../models/user');
router.get ('/', async(req, res) => {
    try {
        const users = await User.find()
        res.render('home', {
            title:"Home ",
            all_users: users 
        })
        
        res.json(users)
    } catch (error) {
       res.status(500).json({message:error.messg}) 
    }
})

router.get('/signup',(req, res) => {
    res.render('signup',{
        title:"Sign-Up"
    })
})

router.get('/profile/:id', getUser, async (req, res) => {
    
    try {
        let user = await User.findById(req.params.id);
        res.render('profile', {
            title:`${user.name}`+"'s Profile",
            user:user 
        })
        
        res.json(user)
    } catch (error) {
       res.status(500).json({message:error.messg}) 
    }
})

router.post('/signup', async (req, res) => {
    const user = User({
        name: req.body.name,
        email: req.body.email,
        password:req.body.password
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(400).json({ message: error.mssg });
    }
})
router.get('/edit/:id',async (req, res) => {
    let user = await User.findById(req.params.id);
    return res.render('edit', {
        title: "User's Profile",
        user: user
    });

})
router.post('/update/:id', getUser, async (req, res) => {
    try {
        let user = await User.findByIdAndUpdate(req.params.id, req.body);
        user.save();

        res.render('profile')
    } catch (error) {
       res.status(500).json({message:error.messg}) 
    }
   
})
router.get('/delete/:id',getUser,async (req, res) => {
    try {
        await res.user.remove()
        res.json({message:'Deleted succesfully'})
    } catch (error) {
        res.status(500).json({message:"User Deleted >>"})
    }
})

async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({message:"Cannot find user"})
        }
    }
    catch(error) {
        return res.json({message:error.message})
    }
    res.user = user
    next()
}

module.exports=router