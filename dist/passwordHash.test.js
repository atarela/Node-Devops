"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Testing how passwordHash works
var chai_1 = require("chai");
var passwordHash = require('password-hash');
var password = 'azert';
describe('PasswordHash', function () {
    //password taped by user
    before(function () {
    });
    after(function () {
    });
    //Test PasswordHash
    describe('#HashPassword', function () {
        it('should hash the password taped by user', function () {
            var hashedPassword = passwordHash.generate(password);
            chai_1.expect(passwordHash.verify(password, hashedPassword)).to.equal(true);
            chai_1.expect(passwordHash.verify('wrongPassword', hashedPassword)).to.equal(false);
        });
    });
});
