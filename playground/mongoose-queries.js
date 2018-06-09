const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// let id = '5b1b5a45058bd83f68a7414d';

// if(!ObjectId.isValid(id)){
//   console.log('ID not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// })
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// })

// Todo.findById(id).then((todo) => {
//   console.log('Todo', todo);
// }).catch((err) => {
//   console.log(err);
// })

let id = '5b1a9a025eb3ff2d042aa386';

User.find().then((users) => {
  if(!users){
    return console.log('can not find users');
  }
  console.log('Users', users);
}).catch((err) => {
  console.log(err);
});

User.findById(id).then((user) => {
  if(!user){
    return console.log('can not find users');
  }
  console.log(JSON.stringify(user,undefined,2));
}).catch((err) => {
  console.log(err);
})
