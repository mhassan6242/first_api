const mongoose=require('mongoose');
const url='mongodb://localhost:27017/Authentication';

const dbConnect=mongoose.connect(url,{}) //ya aik asychronous operation ha jo promise return krta ha 
.then(()=>{
    console.log("data base is connected successfully")
})
.catch(()=>{
    console.log("data base does not connect successfully ")
});



module.exports=dbConnect;