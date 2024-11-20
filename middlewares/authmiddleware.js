const userModel=require('../models/user.js')
const jwt=require('jsonwebtoken');
require('dotenv').config();


const userAuth = async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization; // lowercase 'authorization' ko check karein
    
    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            token = authHeader.split(' ')[1]; // Token ko split karke get karna
            
            // Token verify karen
            const decoded=jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log('decoded', decoded)
            req.userID = decoded.userID; // Attach userID to req object

               
            // id database say get krny k liay 
            // req.userModel = await userModel.findById(verify.id).select('-password');

            next();
        } catch (error) {
            return res.send({ 'status': 'failed', 'messages': 'Unauthorized user' });
        }
    }
    if (!token) {
        return res.send({ 'status': 'failed', 'message': 'Unauthorized user, No token' });
    }



    
};


module.exports=userAuth;