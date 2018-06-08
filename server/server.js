const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    res.send(doc);
  }).catch((err) => {
    res.status(400).send(err);
  });
});


app.listen(3000, () => {
  console.log('started on port 3000');
})
// let newTodo = new Todo({
//   text: 'Cook dinner',
//   completed: false
// });
//
// newTodo.save().then((doc)=>{
//   console.log('Saved todo',doc);
// }).catch((err)=>{
//   console.log(err);
// })

// let newUser = new User({
//   name: 'ab',
//   email: 'dd@g.com',
//   age: 25
// })
//
// newUser.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }).catch((err)=>{
//   console.log(err);
// })
