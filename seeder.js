const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' });

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });
    console.log(`Mongo Connected ${conn.connection.host}`);
};
connectDB()

//import modals

const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')


//import Data
console.log(`${__dirname}/_data/bootcamps.js`)
const bootCampData = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const courseData = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))
//const reviewData = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'))
//const userData = JSON.parse(fs.readFileSync(`${__dirname}/_data/useres.json`, 'utf-8'))

// Import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootCampData);
        await Course.create(courseData);
        console.log('Data Imported...');
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

// Delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('Data Destroyed...');
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}