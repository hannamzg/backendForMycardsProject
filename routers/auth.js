const express = require("express");
const bcrypt = require("bcrypt");
const router =express.Router();
const joi = require("joi");

const {User} =require("../models/users")

router.post("/",async(req,res)=>{
    const {error} =validate(req.body);
    
    if (error) {
        res.status(400).send(error.details[0].massage);
        return
    }

    const user = await User.findOne({email:req.body.email})
    if (!user) {
        res.status(400).send("Invalid email")
        return
    }

    
    const inValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
    )

    if (!inValidPassword) {
        res.status(400).send("invalid password");
        return
    }

    const token = user.generateAuthToken();

    res.send({token});

})

function validate(user){
   
    const schema =joi.object({
        email:joi.string().min(6).max(1777).required(),
        password:joi.string().min(6).max(1777).required(),
    })

    return schema.validate(user);
}

module.exports = router;