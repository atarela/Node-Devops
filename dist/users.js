"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var passwordHash = require('password-hash');
//User CRUD (Create Read Update Delete) I
var User = /** @class */ (function () {
    // , isHashed: boolen = false
    function User(username, email, password, isHashed) {
        if (isHashed === void 0) { isHashed = false; }
        this.password = "";
        this.isHashed = false;
        this.username = username;
        this.email = email;
        this.isHashed = isHashed;
        if (!this.isHashed) {
            this.setPassword(password);
        }
        else
            this.password = password;
    }
    User.fromDb = function (username, value) {
        var _a = value.split(":"), password = _a[0], email = _a[1];
        return new User(username, email, password, true);
    };
    // Hash and set password
    User.prototype.setPassword = function (password) {
        //Generating hashed password
        var hashedPassword = passwordHash.generate(password);
        this.password = hashedPassword;
        this.isHashed = true;
        console.log(passwordHash.verify(password, hashedPassword)); // true
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    // return comparison with hashed password
    User.prototype.validatePassword = function (passwordTaped) {
        //"this.password" corresponds to the hashedpassword that have been saved inside "password" when setting password
        // "passwordHash.verify(password, this.password)" is a boolean that returns true if this password corresponds to the hashed password
        console.log("Validation password: " + passwordHash.verify(passwordTaped, this.password));
        return passwordHash.verify(passwordTaped, this.password);
    };
    return User;
}());
exports.User = User;
//User CRUD II
var UserHandler = /** @class */ (function () {
    function UserHandler(path) {
        this.db = leveldb_1.LevelDB.open(path);
    }
    UserHandler.prototype.get = function (username, callback) {
        this.db.get("user:" + username, function (err, data) {
            if (err)
                callback(err);
            else if (data === undefined)
                callback(null, data);
            else
                callback(null, User.fromDb(username, data));
        });
    };
    UserHandler.prototype.save = function (user, callback) {
        this.db.put("user:" + user.username, user.getPassword() + ":" + user.email, function (err) {
            callback(err);
        });
    };
    UserHandler.prototype.delete = function (username, callback) {
        this.db.del("user:" + username, function (err) {
            callback(err);
        });
    };
    return UserHandler;
}());
exports.UserHandler = UserHandler;
