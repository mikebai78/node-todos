// const MongoClient =require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

const url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url, (err, client) => {
  if(err){
    return console.log('Uable to connect MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');


  // db.collection('todos').deleteMany({
  //   text: 'movie'
  // })
  // .then((result) => {
  //   console.log(result);
  // })
  // .catch((err)=>{
  //   console.log('Unable to delete todo', err);
  // });

  // db.collection('todos').deleteOne({
  //   text: 'movie'
  // })
  // .then((result) => {
  //   console.log(result);
  // })
  // .catch((err)=>{
  //   console.log('Unable to delete todo', err);
  // });

  // db.collection('users').findOneAndDelete({ name: 'Andrew' }).then((result) => {
  //   console.log(result);
  // }).catch((err) => {
  //   console.log(err);
  // })

  db.collection('users').findOneAndDelete({
    _id: new ObjectId('5b19539613cedc2978425933')
  }).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  })


  client.close();
});
