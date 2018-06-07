// const MongoClient =require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

const url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url, (err, client) => {
  if(err){
    return console.log('Uable to connect MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // db.collection('todos').findOneAndUpdate({
  //   _id: new ObjectId('5b194b75106f78170c5711c4')
  // },{
  //   $set: {
  //     completed: true
  //   }
  // },{
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // }).catch((err) => {
  //   console.log(err);
  // })

  db.collection('users').findOneAndUpdate({
    name: 'Andrew'
  },{
    $set:{
      name: 'Andrew Doe'
    },
    $inc:{
      age: 1
    }
  },{
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });




  client.close();
});
