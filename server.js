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
    useUnifiedTopology: true,
  })
  .then(() => console.log('mongoose is running well ...'));

app.listen(process.env.PORT, () => {
  console.log(`im listening on port: ${process.env.PORT}`);
});
