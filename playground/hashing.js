const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

let password = 'abc123';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  })
})

let hashedPassword = '$2a$10$aP6yWaV9gJc76tK8oTqQhOkm4U9sTAC5dCab0b0XO7F480YwMuAOO';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
})

// let message = 'I am user number 3';
//
// let hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

//
// jwt.sign
// jwt.verify
//
// let data = {
//   id:10
// };
//
// let token = jwt.sign(data, '123abc');
//
// console.log(token);
//
// let decoded = jwt.verify(token, '123abc');
// console.log('decoded:',decoded);
