const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');


const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Test todo text';
    request(app)
    .post('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }
      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((err)=>done(err));
    })
  })
});

describe('POST /todos', ()=>{
  it('should not create a todo', (done) => {
    request(app)
    .post('/todos')
    .set('x-auth',users[0].tokens[0].token)
    .send({})
    .expect(400)
    .end((err, res) => {
      if(err){
        return done(err);
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((err) => done(err))
    })
  })
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(1);
    })
    .end(done);
  });
});

describe('GET /todos/:id',()=>{
  it('should return the todo by given id', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should not return the todo created by other user', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    let id = new ObjectId().toHexString();
    request(app)
    .get(`/todos/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
    .get('/todos/123')
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });
})

describe('delete /todos/:id', () => {
  it('should remover a todo', (done) => {
    let hexid = todos[0]._id.toHexString();

    request(app)
    .delete(`/todos/${hexid}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexid);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }

    Todo.findById(hexid).then((todo) => {
      expect(todo).not.toBeTruthy();
      done();
    }).catch((err) => done(err));
    });
   });

   it('should not remover a todo created by other user', (done) => {
     let hexid = todos[1]._id.toHexString();

     request(app)
     .delete(`/todos/${hexid}`)
     .set('x-auth', users[0].tokens[0].token)
     .expect(404)
     .end((err, res) => {
       if(err){
         return done(err);
       }

     Todo.findById(hexid).then((todo) => {
       expect(todo).toBeTruthy();
       done();
     }).catch((err) => done(err));
     });
    });

  it('should return 404 if todo not found', (done) => {
    let id = new ObjectId().toHexString();
    request(app)
    .delete(`/todos/${id}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });

  it('should return 404 if object id not found', (done) => {
    request(app)
    .delete('/todos/123')
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });
});

describe('PATCH todos/:id', () => {
  it('should update todo', (done) => {
    let hexid = todos[0]._id.toHexString();
    let text = 'first test succeed';
    request(app)
    .patch(`/todos/${hexid}`)
    .set('x-auth', users[0].tokens[0].token)
    .send({
      completed: true,
      text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.text).toBe(text);
      // expect(res.body.todo.completedAt).toBeNumber();
    })
    .end(done);
  })

  it('should not update todo created by other user', (done) => {
    let hexid = todos[0]._id.toHexString();
    let text = 'first test succeed';
    request(app)
    .patch(`/todos/${hexid}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      completed: true,
      text
    })
    .expect(404)
    .end(done);
  });

  it('should clear completedAt when to is not completed',(done) => {
    let hexid = todos[1]._id.toHexString();
    let text = 'second test succeed';
    request(app)
    .patch(`/todos/${hexid}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      completed: false,
      text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBeNull();
    })
    .end(done);
  })
})

describe('Get /user/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email)
    })
    .end(done)
  });
  it('should return 401 if unauthenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  })
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = 'example@example.com';
    let password = 'mmm666';
    let name = 'test'
    let age = 100
    request(app)
    .post('/users')
    .send({email, password, name, age})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body.user._id).toBeTruthy();
      expect(res.body.user.email).toBe(email);
    })
    .end((err) => {
      if(err){
        return done(err)
      }
      User.findOne({email}).then((user) => {
        // expect(user.password).toNotBe(password);
        done();
      })
    });
  });

  it('should return validateion errors if request invalid', (done) => {
    request(app)
    .post('/users')
    .send({
      email: 'andf',
      password: '222'
    })
    .expect(400)
    .end(done)
  });

  it('should not create a user if email in use', (done) => {
    request(app)
    .post('/users')
    .send({
      email: users[0].email,
      password: 'user1pass',
      name: 'tester',
      age: 30
    })
    .expect(400)
    .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[0].email,
      password: users[0].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body.user.email).toBe(users[0].email);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens[1].token).toBe(res.headers['x-auth'])
        done();
      }).catch((err) => done(err));
    })
  });

  it('should reject wrong password', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[0].email,
      password: '111111'
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeFalsy();
    })
    .end(done)
  });

  it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: 'test@test.com',
      password: '111111'
    })
    .expect(400)
    .end(done)
  });
})

describe('DELETE users/me/token', ()=>{
  it('should remove auth token on logout', (done) => {

    request(app)
    // .post('/users/login')
    // .send({
    //   email: users[0].email,
    //   password: users[1].password
    // })
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.user).toBeFalsy();
    })
    .end((err) => {
      if(err){
        return res.status(400).send()
      }
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((err) => done(err));
    })
  })
})
