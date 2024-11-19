const express=require('express');
const userController=require('../controller/usercontroller.js')
const middlware=require('../middlewares/authmiddleware.js')

const router=express.Router()
// route level middleware
router.use('/changepassword',middlware)
router.use('/getInfo',middlware)
router.use('/updateProfile',middlware)
router.use('/createRide',middlware)
router.use('/getRides',middlware)




// public route

router.post('/register',userController.userRegisteration)
router.post('/login',userController.userLogin)
router.post('/emailSent',userController.emailSent)
router.post('/driver',userController.driver) 

router.post('/resetPassword/:id/:token',userController.resetPassword)
// router.post('/bookRide',userController.bookRide)

// RIDE MANAGEMENT KA ROUTER
router.post('/createRide',userController.createRide)
router.get('/getRides',userController.getRides)





// private route

router.put('/changepassword',userController.changePassword);
// router.get('/getInfo',userController.getInfo);
router.put('/updateProfile',userController.updateProfile)




module.exports=router;