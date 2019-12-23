let passwordHash = require('password-hash')

let password = 'azert'

let hashedPassword = passwordHash.generate(password)
console.log(hashedPassword)

console.log(passwordHash.verify(password, hashedPassword)); // true

console.log(passwordHash.verify('wrongPassword', hashedPassword)); // false
