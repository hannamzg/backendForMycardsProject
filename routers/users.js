const express =require('express');
const router = express.Router();
const lodash =require("lodash")
const bcrypt =require("bcrypt")
const {User,validateUser} =require("../models/users")

const authMW = require("../middleware/auth");


router.get("/me", authMW, async (req, res) => {
    const user = await User.findById(req.user._id, { password: 0 });
    res.send(user);
});

  
router.post('/', async(req,res)=>{
    const {error} =validateUser(req.body);
      
    if (error) {
        res.status(400).send(error.details[0].massage);
        return
    }

    let user =await User.findOne({email:req.body.email});

    if (user) {
     res.status(400).send('user arlady regstier')  
     return 
    }

    user = await new User({
        ...req.body,
        password: await bcrypt.hash(req.body.password,12)
    }).save()

    res.send(lodash.pick(user,["_id","name","email","biz"]));

})

module.exports = router;
