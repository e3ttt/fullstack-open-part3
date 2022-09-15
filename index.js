const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/person');

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.static('build'));
app.use(cors());

morgan.token('postContent', (request, response) =>
  JSON.stringify(request.body)
);

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      tokens.postContent(req, res),
    ].join(' ');
  })
);

app.get('/api/people', (request, response, next) => {
  Person.find({}).then(people => {
    response.json(people);
  });
});

app.get('/api/people/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.get('/info', (request, response) => {
  response.send(`<div>Phonebook has info for ${people.length} people</div> 
    <div>${new Date()}</div>`);
});

app.delete('/api/people/:id', (request, response, next) => {
  Person.findOneAndRemove({ _id: request.params.id })
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/people', (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response
      .status(400)
      .json({ error: 'no name or number was provide' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then(personAdded => {
    response.json(personAdded);
  });
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malfomatted id' });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(errorHandler);
app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
