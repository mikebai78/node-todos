const {ObjectId} = require('mongodb');

const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'useronepass',
  name: 'Andrew',
  age: 30,
  tokens: [
    {
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }
  ]
},{
  _id: userTwoId,
  email: 'mikedd@example.com',
  password: 'usertwopass',
  name: 'Mike Danny',
  age: 20
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
}

const todos = [{
  _id : new ObjectId(),
  text: 'First test todo'
}, {
  _id : new ObjectId(),
  text: 'Second test todo',
  completed: true,
  completedAt: 123654
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
  Todo.insertMany(todos);
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
