const mongoose =require("mongoose");
const joi = require('joi')
const jwt = require("jsonwebtoken");
const { JWTSecretToken } = require("../configs/config");


const userSchema =new mongoose.Schema({
    name:{
        type:String,
        require:true,
        minlength:2,
        maxlength:255,
    },
    email:{
        type:String,
        require:true,
        minlength:6,
        maxlength:1777,
    },
    password:{
        type:String,
        require:true,
        minlength:6,
        maxlength:1777,
    },
    biz:{
        type:Boolean,
        require:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
})

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, biz: this.biz }, JWTSecretToken);
};


const User =mongoose.model("User",userSchema,"users");



function validateUser(user){
   
    const schema =joi.object({
        name:joi.string().min(2).max(255).required(),
        email:joi.string().min(6).max(1777).required(),
        password:joi.string().min(6).max(1777).required(),
        biz:joi.boolean().required(),
    })

    return schema.validate(user);
}


module.exports={
    User,
    validateUser
}