const userModel = require('../models/user.js');
const Driver = require('../models/driver.js')
const Ride = require('../models/ride.js');
const Booking = require('../models/booking.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { assign } = require('nodemailer/lib/shared/index.js');
const { default: mongoose } = require('mongoose');


class userController {
    static userRegisteration = async (req, res) => {
        const { name, email, password, password_confirmation } = req.body
        const user = await userModel.findOne({ email: email })
        if (user) {

            res.send({ 'status': 'failed', 'message': 'Email already exist ' })
        } else {
            if (name && email && password && password_confirmation) {
                if (password === password_confirmation) {


                    // logic for hash password
                    try {


                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password, salt)
                        const newUser = new userModel({
                            name: name,
                            email: email,
                            password: hashPassword
                        });
                        await newUser.save();

                        res.send({ 'status': 'Success', 'message': 'Successful Register', })
                    } catch (error) {

                        return res.send({ 'status': 'failed', 'message': 'unable to register' });

                    }

                } else {
                    res.send({ 'status': 'failed', 'message': 'Password and confirm password does not match ' })

                }

            } else {

                res.send({ 'status': 'failed', 'message': 'All fields are required ' })

            }





        }

    }

    // Login


    static userLogin = async (req, res) => {
        try {
            const { email, password, userType } = req.body;
            console.log(userType)
            if (email && password) {
                if (userType == '2') {
                    const driver = await Driver.findOne({ email: email })
                    if (driver !== null) {

                        // yha dono paswword ko compare kr k check krna ha k both are sam or not q k dtatbase password hamy password hash form may day ga hmy pehly hash may convert krna ha

                        const isMatch = await bcrypt.compare(password, driver.password)
                        if ((driver.email === email) && isMatch) {

                            // generate token
                            console.log('driver._id', driver._id)
                            const token = jwt.sign({ userID: driver._id }, process.env.JWT_SECRET_KEY, { expiresIn: '30h' })

                            return res.send({ id: driver._id, 'status': 'succes', 'message': 'Driver Login Successful', 'token': token })

                        } else {
                            res.send({ 'status': 'failed', 'message': ' Email or Password Is not valid' })

                        }

                    } else {
                        res.send({ 'status': 'failed', 'message': ' You are not register' })

                    }
                } else {
                    const user = await userModel.findOne({ email: email })
                    if (user !== null) {

                        // yha dono paswword ko compare kr k check krna ha k both are sam or not q k dtatbase password hamy password hash form may day ga hmy pehly hash may convert krna ha

                        const isMatch = await bcrypt.compare(password, user.password)
                        if ((user.email === email) && isMatch) {
                            console.log('user._id', user._id)
                            // generate token
                            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '30h' })

                            return res.send({ 'status': 'succes', 'message': 'Login Successful', 'token': token })

                        } else {
                            res.send({ 'status': 'failed', 'message': ' Email or Password Is not valid' })

                        }

                    } else {
                        res.send({ 'status': 'failed', 'message': ' You are not register' })

                    }
                }

            } else {
                res.send({ 'status': 'failed', 'message': ' email and password are required' })
            }
        } catch (error) {

        }

    };







    // CREATE RIDE API


    static createRide = async (req, res) => {
        try {
            const { pickupLocation, dropLocation, price, date } = req.body;

            // Validate the received data
            if (!pickupLocation || !dropLocation || !price || !date) {
                return res.status(400).json({ error: 'All fields are required.' });
            }
            const userID = await userModel.findById(userModel._id)


            const newRide = new Ride({
                userID,
                pickupLocation,
                dropLocation,
                price,
                date
            });

            // Save the new ride to the database
            await newRide.save();

            // Return the created ride as a response
            return res.status(201).json({ message: 'Ride created successfully', 'message': newRide });
        } catch (err) {
            console.error('Error creating ride:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };



    // GET RIDE API



    // static getRides = async (req, res) => {
    //     try {
    //         const authHeader = req.headers.authorization; // Authorization header se token lo
    //         const token = authHeader.split(' ')[1]; // Token ko extract karo

    //         // Token ko verify karo
    //         const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //         // User ko find karo using decoded._id
    //         const user = await Ride.find({ userId: verify.userID });
    //         if (!user) {
    //             return res.status(404).json({ message: 'User not found' });
    //         }

    //         const id = user._id;  // User ki ID ko store karo

    //         // Ride fetch karen jahan user rider ya driver ho
    //         const rides = await Ride.find({
    //             $or: [{ id }, { driverId: id }]
    //         });

    //         // Agar rides nahi milti, toh 404 response bhejein
    //         if (!rides.length) {
    //             return res.status(404).json({ error: 'No rides found.' });
    //         }

    //         // Rides ko response mein bhejein
    //         return res.status(200).json({ rides });
    //     } catch (err) {
    //         console.error('Error fetching rides:', err);
    //         return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    //     }
    // };






    // driver

    static driver = async (req, res) => {
        console.log('first')
        const { driverName, phone, licenseNumber, vehicleDetails, email, password } = req.body;

        // Validation check
        if (!driverName || !phone || !licenseNumber || !vehicleDetails || !email || !password) {
            return res.status(400).send({
                status: 'failed',
                message: 'All driver details are required'
            });
        }

        try {
            // Creating a new driver

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            const newDriver = await new Driver({
                driverName,
                phone,
                licenseNumber,
                vehicleDetails,
                email,
                password: hashPassword
            });

            // Saving the driver
            await newDriver.save();

            // Successful response
            return res.status(201).send({
                status: 'success',
                message: 'Driver added successfully',
                data: newDriver
            });
        } catch (error) {
            // Error handling with the actual error message
            console.error(error);  // Log the error for debugging
            return res.status(500).send({
                status: 'error',
                message: 'Internal server error',
                error: error.message  // Include the actual error message
            });
        }
    };





    // BOOK RIDE API
    static bookRide = async (req, res) => {
        try {
            // User ki ID token se extract karo
            const userId = req.userID;
            // const driverId = req.body.driverId
            if (!userId) {
                res.send("user not found!")
            }

            // const ride = await Booking.findOne({ userid: userId || driverId:userId })
            const ride = await Booking.findOne({
                $and: [
                    {
                        $or: [
                            { userId: userId },
                            { driverId: userId }
                        ]
                    },
                    { orderStatus: false }
                ]
            });
            if(ride){
                return res.status(400).send("You arleady have a rid.")
            }else{
                // Body se ride details lo
            const { driverId, pickupLocation, dropLocation } = req.body;

            // Required fields validate karo
            if (!driverId || !pickupLocation || !dropLocation) {
                return res.status(400).json({ message: "Incomplete ride details!" });
            }

            // Check if driver exists and is available
            const driver = await Driver.findById(driverId);
            if (!driver) {
                return res.status(404).json({ message: "Driver not available!" });
            }

            // Booking create karo
            const newBooking = new Booking({
                userId,
                driverId,
                pickupLocation,
                dropLocation,
            });

            await newBooking.save();

            // // Driver ko "not available" mark karo
            // driver.isAvailable = false;
            // await driver.save();

            res.status(201).json({
                message: "Ride booked successfully!",
                rideDetails: newBooking,
            });
            }
            
        } catch (error) {
            console.error("Error details:", error.message);
            res.status(500).json({ message: "Failed to book ride, please try again." });

        }
    };




    // CANCEL RIDE

    static cancelRide = async (req, res) => {
        try {

            const userId = req.userID
            if (!userId) {
                res.send("user not found!")
            }
            console.log('userId', userId)

            // const ride = await Booking.findOne({ userid: userId || driverId:userId })
            const ride = await Booking.findOne({
                $and: [
                    {
                        $or: [
                            { userId: userId },
                            { driverId: userId }
                        ]
                    },
                    { orderStatus: false }
                ]
            });
            
            console.log('ride', ride)
            if (!ride) {
                res.send('ride dont available in indrive')
            }
            if (ride) {
                console.log('first', ride.userId.equals(userId))
                if (ride.userId.equals(userId)) {
                    console.log("Matched with userid");
                    const update = await Booking.updateOne({
                        cancelByUser: false,
                        orderStatus: false
                    }, {
                        $set: {
                            cancelByUser: true,
                            orderStatus: true
                        }
                    })
                    res.send({ result: update })
                } else if (ride.driverId.equals(userId)) {
                    const update = await Booking.updateOne({
                        cancelByDriver: false,
                        orderStatus: false
                    }, {
                        $set: {
                            cancelByDriver: true,
                            orderStatus: true
                        }
                    })
                    res.send({ result: update })
                }
                else {
                    return res.send("No matching ride found");
                }


            }
        }
        catch (error) {
            res.send(error)
        }
    }













    // Get user Information 

    // static getInfo = async (req, res) => {
    //     const user = await user.findById(req.user._id);

    //     if (!user) {
    //         return res.status(401).json({ status: 'failed', message: 'User not authenticated' });
    //     }

    //     const userData = {
    //         name: user.name,
    //         email: user.email
    //     };

    //     res.status(200).json({ status: 'success', message: userData });
    // };










    // Change password 

    static changePassword = async (req, res) => {
        const { password, password_confirmation } = req.body;
        if (password && password_confirmation) {
            if (password !== password_confirmation) {
                res.send({ 'status': 'failed', 'message': ' Old and new password does not match ' })


            } else {
                // agr dono same ho jy gay phir pasword ko hash krna hota

                const salt = await bcrypt.genSalt(10);
                const newhashPassword = await bcrypt.hash(password, salt);
                // jo passsword change hua usy hash password ki form may save krwana ha
                await userModel.findByIdAndUpdate(req.user._id, {
                    $set: {
                        password: newhashPassword
                    }
                })


                res.send({ 'status': 'success', 'message': 'password chnage successfully' })

            }

        } else {
            res.send({ 'status': 'failed', 'message': ' Enter your password and password confirmation ' })


        }

    }







    // UPDATE PROFILE


    static updateProfile = async (req, res) => {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.send({ 'status': 'failed', 'message': 'New name and email are required' });
        }

        const newUser = { name, email };
        try {
            const updateUser = await userModel.updateOne(req.userID, newUser, {
                new: true,
                runValidators: true
            });

            if (!updateUser) {
                return res.send({ 'status': 'failed', 'message': 'User not found' });
            }

            res.send({ 'status': 'success', 'message': 'Profile updated successfully' });
        } catch (error) {
            res.status(500).send({ 'status': 'error', 'message': 'Error updating profile' });
        }
    };










    // email sent 

    static emailSent = async (req, res) => {
        // sab say pehly email check krni ha k wo ha k nai ha dataabse may
        const { email } = req.body
        if (email) {
            // ab check krna ha k email register ha k nai db may
            const user = await userModel.findOne({ email: email });



            if (user) {

                // yha code likhna ha jis link may email ka notification jay reset passwword ka
                // AudioWorkletsecret key aur genertae krni ha jo userid aur secret key jwt wali say mil k bny

                const secret = user._id + process.env.JWT_SECRET_KEY

                // yha ab us secret ko use krna ha token bnaty huay
                const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15d' })

                const link = `http://localhost:3000/api/user/reset/${user._id}/${token}`
                console.log(link)
                res.send({ 'status': 'success', 'message': 'password reset email send .....please check your' })






            } else {
                res.send({ 'status': 'failed', 'message': 'Email does not exit ' })

            }

        } else {
            res.send({ 'status': 'failed', 'message': 'Email is required to change password' })
        }

    }




    // Reset password

    static resetPassword = async (req, res) => {
        const { password, password_confirmation } = req.body;

        // URL se id aur token ko nikalna
        const { id, token } = req.params;

        try {
            // Database mein id se user dhoondna
            const user = await userModel.findById(id);
            if (!user) {
                return res.send({ 'status': 'failed', 'message': 'User not found' });
            }

            const new_secretkey = user._id + process.env.JWT_SECRET_KEY;

            // Token verify karna
            jwt.verify(token, new_secretkey);

            // Password aur confirmation password ki checking
            if (password && password_confirmation) {
                if (password !== password_confirmation) {
                    return res.send({ 'status': 'failed', 'message': 'Password and confirm password do not match' });
                } else {
                    const salt = await bcrypt.genSalt(10);
                    const newhashPassword = await bcrypt.hash(password, salt);

                    // Password ko database mein update karna
                    await userModel.findByIdAndUpdate(user._id, { $set: { password: newhashPassword } });

                    // Success response dena
                    return res.send({ 'status': 'success', 'message': 'Password updated successfully' });
                }
            } else {
                return res.send({ 'status': 'failed', 'message': 'Password and confirm password both are required' });
            }
        } catch (error) {
            console.error("Error:", error);
            return res.send({ 'status': 'failed', 'message': 'Invalid token or request' });
        }
    };









};



module.exports = userController;