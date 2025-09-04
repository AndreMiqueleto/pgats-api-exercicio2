const bcrypt = require('bcryptjs');

//n-memory user database
const users = [
  {
    username: 'julio', 
    password: bcrypt.hashSync('123456', 8), 
    favorecidos: [ 'priscila' ], 
    saldo: 10000
  },
  {
    username: 'priscila', 
    password: bcrypt.hashSync('123456', 8), 
    favorecidos: [ 'julio' ], 
    saldo: 10000
  },
  {
    username: 'andre', 
    password: bcrypt.hashSync('123456', 8), 
    favorecidos: [ 'sam' ], 
    saldo: 10000
  }, 
  {
    username: 'sam', 
    password: bcrypt.hashSync('123456', 8), 
    favorecidos: [ 'andre' ], 
    saldo: 10000
  }
];

module.exports = {
  users
};
