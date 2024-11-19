const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true   // ya is liay use kia ha q k agr koi space wgara ay to wo khud remove ho jay 
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    
});



const userModel=mongoose.model('user',userSchema);



module.exports=userModel