const express = require('express')
const  router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Jwt_secret} = require("../keys");
const requireLogin = require('../middlewares/requireLogin');


router.post("/signup", (req,res) =>{
    const{name,userName, email, password} = req.body;
    if(!name || !userName || !email || !password ){
       return res.status(422).json({error:"please add all the fields"})
    }
    User.findOne({$or:[{email:email},{userName:userName}]}).then((savedUser)=>{
        if(savedUser){
            return res.status(409).json({"error":"UserName or Email Already Exists!"});
        }
        bcrypt.hash(password, 12).then((hashedPassword)=>{
            const user = new User({
                name,
                email,
                userName,
                password:hashedPassword
            })
            user.save()
            .then(user => {
                res.json({message : "Registered successfully"})
            })
            .catch(err => {
                console.log(err)
            })
        })
        //console.log('user already exists'+ savedUser)
    })
    //res.json("data posted successfully")
})
router.post("/signin",(req,res)=>{
    const{email , password}= req.body
    if (!email || !password ) {
        return res.status(422).json({'error': 'Please provide both username and Password'})
    }
    User.findOne({email:email}).then((savedUser)=>{
        if(!savedUser){
            return res.status(403).json({'error':'Invalid Credentials'});   
        }
        bcrypt.compare(password,savedUser.password).then((match)=>{
            if(match){

                //  return res.status(200).json({message:"Signed in Successfully"});
                const token = jwt.sign({_id:savedUser.id},Jwt_secret)
                const {_id,name,email,userName} =savedUser;
                //console.log({token,user:{_id,name,email,userName}})
                res.json({token,user:{_id,name,email,userName}})
            }
            else{
                return res.status(422).json({error:"Invalid password"});
            }
        })
    })

})
module.exports = router;