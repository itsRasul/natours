const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(`uncaughtException: ${err}`);
  console.log(`error stack: ${err.stack}`);
  process.exit(1);
});

dotenv.config();
const app = require('./app');
//
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
  })
  .then(() => console.log('mongoose is running well ...'));

const server = app.listen(process.env.PORT, () => {
  console.log(`im listening on port: ${process.env.PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(`unhandledRejection: ${err}`);
  server.close(() => {
    process.exit(1);
  });
});
