const fs = require('fs');
const express = require('express');
const res = require('express/lib/response');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// reading file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// ROUTE HANDLING
const getAllTours = (req, res) => {
  // we wanna send back the whole tours data by reading json-tours
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  const id = Number(req.params.id);

  if (id > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
    return;
  }

  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      newTour,
    });
  });
};

const updateTour = (req, res) => {
  const id = req.params.id;
  if (id > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
    return;
  }
  for (let i = 0; i < Object.keys(req.body).length; i++) {
    let key = Object.keys(req.body)[i];
    if (tours[id][key]) {
      tours[id][key] = req.body[key];
    }
  }
  const updatedTour = tours[id];
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(200).json({
      status: 'success',
      message: 'resource updated successfully',
      data: {
        tour: updatedTour,
      },
    });
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'unvalid ID',
    });
    return;
  }
  if (tours[id].id === id) {
    const deletedTour = tours.splice(id, 1);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
      if (err) console.log('an erro occured');
      res.status(204).json({
        status: 'success',
        message: 'recourse successfully deleted',
        data: {
          tour: deletedTour,
        },
      });
    });
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'recourse has deleted already',
    });
  }
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route handling is not yet defiend!',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route handling is not yet defiend!',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route handling is not yet defiend!',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route handling is not yet defiend!',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route handling is not yet defiend!',
  });
};
// ROUTES

//tours routing
const toursRouter = new express.Router();
toursRouter.route('/').get(getAllTours).post(createTour);
toursRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

// users routing
const usersRouter = new express.Router();
usersRouter.route('/').get(getAllUsers).post(createUser);
usersRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

// LISTEN
const port = 3000;
app.listen(port, () => {
  console.log('im listening on port: ' + port);
});
