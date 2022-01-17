/* eslint-disable node/no-unsupported-features/es-syntax */
const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkBody = (req, res, next) => {
  if (!(req.body.price && req.body.name)) {
    return res.status(400).send({
      status: 'fail',
      message: 'bad request',
    });
  }
  next();
};
exports.checkId = (req, res, next, val) => {
  if (val > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    env: process.env.TEST_VAR,
    status: 'success',
    result: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  const id = Number(req.params.id);

  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      newTour,
    });
  });
};

exports.updateTour = (req, res) => {
  const { id } = req.params;

  for (let i = 0; i < Object.keys(req.body).length; i += 1) {
    const key = Object.keys(req.body)[i];
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

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;

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
