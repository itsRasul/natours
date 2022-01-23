const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config();

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('mongoose is running well ... :)'));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'the document must has a name field'],
    unique: true,
  },
  price: {
    type: Number,
    require: [true, 'the document must has a price field'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const tour = new Tour({
  name: 'test name 2',
  price: 850,
  rating: 4.8,
});

tour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => console.log('ERROR: 👀', err));

const port = 3000;

app.listen(port, () => {
  console.log(`im listening on port: ${port}`);
});
