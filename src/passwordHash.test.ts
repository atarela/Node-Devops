//Testing how passwordHash works
import {expect} from 'chai'
import { LevelDB } from "./leveldb"
let passwordHash = require('password-hash')

let password = 'azert'

describe('PasswordHash', function () {
  //password taped by user
  before(function () {
  })

  after(function () {
  })

  //Test PasswordHash
  describe('#HashPassword', function () {
    it('should hash the password taped by user', function () {
        let hashedPassword = passwordHash.generate(password)
        expect(passwordHash.verify(password, hashedPassword)).to.equal(true)
        expect(passwordHash.verify('wrongPassword', hashedPassword)).to.equal(false)
    })
  })

})