require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const port = process.env.PORT;

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

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }).catch((err) => {
    res.status(400).send(err);
  })
})

app.get('/todos/:id', (req, res) => {
  let id = req.params.id;
  if(!ObjectId.isValid(id)){
    return res.status(404).send('ID is not valid');
  };
  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send('todo not found.')
    }
    res.status(200).send({todo});
  }).catch((err) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id;
  if(!ObjectId.isValid(id)){
    return res.status(404).send('ID is not valid.');
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.status(404).send('todo not found.');
    }
    res.status(200).send({todo});
  }).catch((err) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text','completed'])

  if(!ObjectId.isValid(id)){
    return res.status(404).send('ID is not valid.')
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(id, {$set:body}, {new: true})
  .then((todo) => {
    if(!todo){
      return res.status(404).send('Todo not found');
    }
    res.send({todo});
  }).catch((err) => {
    res.status(400).send();
  })
})

//user route

app.post('/users', (req, res) => {

  let body = _.pick(req.body, ['email','password','name','age'])
  let user = new User(body);


  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send({user});
  }).catch((err) => {
    res.status(400).send(err);
  })
})


app.listen(port, () => {
  console.log(`started on port ${port}.`);
})

module.exports = {app};
