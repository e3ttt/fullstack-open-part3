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

app.get('/api/people', (request, response) => {
  Person.find({}).then(people => {
    response.json(people);
  });
});

app.get('/api/people/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = people.find(p => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get('/info', (request, response) => {
  response.send(`<div>Phonebook has info for ${people.length} people</div> 
    <div>${new Date()}</div>`);
});

app.delete('/api/people/:id', (request, response) => {
  const id = Number(request.params.id);
  people = people.filter(p => p.id !== id);
  response.status(204).end();
});

app.post('/api/people', (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response
      .status(400)
      .json({ error: 'no name or number was provide' });
  }

  const personAlreadyInPhonebook = people.find(p => p.name === body.name);

  if (personAlreadyInPhonebook) {
    return response.status(400).json({ error: 'name already in phonebook' });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
  };

  people = people.concat(person);

  response.json(person);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
