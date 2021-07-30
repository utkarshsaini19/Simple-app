const express = require('express');
const jwt = require('jsonwebtoken');
const bcryptjs=require('bcryptjs');
const router = express.Router();
require('../Database/db');
const User = require('../model/userSchema');
const authentication = require('../middleware/Authenticate');

router.get('/', (req,res) => {
    res.send(`<b>Hello World from the Router server</b>`);
});

//Using async,await
router.post('/register', async(req,res) => {
    const {name,email,password}=req.body;
    
    if(!name || !email || !password)
    {
        return res.json({error:"Please fill all details"});
    }
    try
    {
    const userExists= await User.findOne({email:email});
    
    if(userExists)
        {
           return res.status(422).json({error:"Email already registered"});
        }
        //console.log(userExists);
        
        const user= new User({name,email,password});
        //middleware
        await user.save();
        
        
        res.status(201).json({message : "User registered successfully"})
       
    }
    catch(err)
    { 
        console.log(err);
    }
    });

//login route
router.post('/signin',async (req,res)=>{
        try
        {
        let token;
        const {email,password}=req.body;
        if(!email || !password)
        {
            return res.status(400).json({error:"Please enter all the fields"});
        }
        
        const userLogin=await User.findOne({email:email});

        if(userLogin)
        {
            //return res.status(422).json({message:"Sign Up First"});
            const isMatch=await bcryptjs.compare(password,userLogin.password);
            if(!isMatch)
            {
                res.status(400).json({ error: "Invalid credentials" });
            }
            else
            {
                token = await userLogin.generateAuthToken();
                res.cookie("jwtoken", token, {
                    expires:new Date(Date.now() + 25892000000),
                    httpOnly:true
                });
                
                  res.json({message:"Logged in successfully"});
            }
        }else
                {
                    res.status(400).json({ error: "Invalid credentials" });
                }
        
        }
        catch(error)
        {
        console.log(error);
        }
});



//about us ka page
router.get('/about',authentication,(req,res)=>{
res.send(req.rootuser);
})

module.exports = router;