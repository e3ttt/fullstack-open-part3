const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [<name> <number>]');
  process.exit(1);
} else if (process.argv.length !== 5 && process.argv.length !== 3) {
  console.log('Usage: node mongo.js <password> <name> <number>');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://e3ttt:${password}@cluster0.njdsewz.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  // Fetching all people
  mongoose
    .connect(url)
    .then(result => {
      Person.find({}).then(result => {
        result.forEach(person => console.log(person));
        return mongoose.connection.close();
      });
    })
    .catch(err => console.log(err));
} else {
  // Adding new person
  mongoose
    .connect(url)
    .then(result => {
      console.log('connected');

      const person = new Person({ name, number });
      return person.save();
    })
    .then(() => {
      console.log(`Added ${name} number ${number} to phonebook`);
      return mongoose.connection.close();
    })
    .catch(err => console.log(err));
}
