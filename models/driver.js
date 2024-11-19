const mongoose=require('mongoose')

const driverSchema=new mongoose.Schema({
    driverName:{
        type:String,
        required:true
    },
    licenseNumber: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    vehicleDetails: {
        
            type: String,
            required: true
        },
})


const driver=mongoose.model('driver',driverSchema)
module.exports=driver