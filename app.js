require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userroutes.js')
const mongodb = require('./config/connectDb.js')



const cors = require('cors')

const app = express();

const port = process.env.PORT

// ya ham is liay use krty hay q k post man say data json ki format may ana ha

app.use(express.json())





app.use(cors())


// load routes
app.use('/api/user', userRoutes);



app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
})

