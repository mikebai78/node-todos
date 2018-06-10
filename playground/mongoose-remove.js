const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// //remove all todos
// Todo.remove({}).then((result) => {
//   console.log(resule);
// })

// Todo.findOneAndRemove

Todo.findByIdAndRemove(id).then((todo) => {
  console.log(todo);
}).catch((err) => {
  console.log(err);
})
