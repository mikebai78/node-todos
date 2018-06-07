// const MongoClient =require('mongodb').MongoClient;
// const test = require('assert');
const {MongoClient, ObjectId} = require('mongodb');
const url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url, (err, client) => {
  if(err){
    return console.log('Uable to connect MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // db.collection('todos').insert({
  //   text: 'something to do',
  //   completed: false
  // },(err, result) => {
  //   if(err){
  //     return console.log('unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined,2));
  // });

  db.collection('users').insert([{
    name: 'Andrew',
    age: 26,
    location: 'New York'
  },{
    name: 'Mike Pence',
    age: 56,
    location: 'Wangshington'
  },{
    name: 'Bill Gates',
    age: 63,
    location: 'Seatle'
  }], (err, result) => {
    if(err){
      return console.log('Unable to insert users', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });
  client.close();
});
