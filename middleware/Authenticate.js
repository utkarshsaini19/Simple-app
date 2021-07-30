const jwt=require("jsonwebtoken");
const User = require("../model/userSchema");

const Authenticate = async(req,res,next) =>{
 try {
     //const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTAyZTQ3NTMzMmIwMjBjNzhlODdlYmUiLCJpYXQiOjE2Mjc1ODQwMjl9.Cuj5qNzYoLk8aoK84cawLDLo9DaSEPwI_fN45EC4yLk";
     const token=req.cookies.jwtoken;
     const verifyToken=jwt.verify(token,process.env.SECRET_KEY);

     const rootuser = await User.findOne({_id:verifyToken._id,"tokens.token":token});
     if(!rootuser)
     {
         throw new Error('User not Found');
     }
     
     req.token = token;
     req.rootuser = rootuser;
     req.userId = rootuser._id;

     next();
 } catch (error) {
     res.status(401).send("Unauthorized: No token provided");
     console.log(error);
 }
}

module.exports=Authenticate;