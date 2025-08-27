import {app} from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config({
    path: './.env'
});

if(process.env.MONGO_URI){
    mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
    .then(()=>console.log("MongoDB Connected Successfully"))
    .catch((err)=> console.error("MongoDB Error"))
}

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Project Backend!');
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});