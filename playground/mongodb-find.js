// const MongoClient =require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

const url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url, (err, client) => {
  if(err){
    return console.log('Uable to connect MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // db.collection('todos').find({completed: false}).toArray()
  // .then((data)=>{
  //   console.log('todos');
  //   console.log(JSON.stringify(data, undefined, 2));
  // }).catch((err)=>{
  //   console.log('Unable to fetch todos', err);
  // });

  // db.collection('todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}.`);
  // }).catch((err) => {
  //   console.log('Unable to count todos', err);
  // })

  db.collection('users').find().toArray()
  .then((data) => {
    console.log('Users: ');
    console.log(JSON.stringify(data, undefined, 2));
  })
  .catch((err)=>{
    console.log('Unable to fetch users', err);
  });


  client.close();
});
