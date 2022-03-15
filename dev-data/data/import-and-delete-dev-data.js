const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
require('dotenv').config();

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('mongoose is running well ...'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// DELETE DATA TOURS FROM DB
// eslint-disable-next-line no-unused-vars
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('All data deleted in tours collection successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// IMPORT DATA TOURS FROM DB
// eslint-disable-next-line no-unused-vars
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('all data from tours.json is imported to DB successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// ******** delete func will delete All the docs in tours collection ************
// deleteData();
// ******** import func will import All the tours.json to tours collection ************
// importData();
