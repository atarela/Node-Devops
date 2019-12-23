import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'
let passwordHash = require('password-hash');

//User CRUD (Create Read Update Delete) I
export class User {
    public username: string
    public email: string
    private password: string = ""
    public isHashed: boolean = false
  
    // , isHashed: boolen = false
    constructor(username: string, email: string, password: string, isHashed: boolean = false) {
      this.username = username
      this.email = email
      this.isHashed = isHashed

      if (!this.isHashed) {
          this.setPassword(password)
      } 
      else this.password = password

    }

    static fromDb(username: string, value: any): User {
        const [password, email] = value.split(":")
        return new User(username, email, password, true)
    }
    
    // Hash and set password
    public setPassword(password: string): void {
      //Generating hashed password
      let hashedPassword = passwordHash.generate(password)
      this.password = hashedPassword
      console.log("Test\n passhashed: " + this.password)
      this.isHashed = true
      console.log(hashedPassword)
      console.log(passwordHash.verify(password, hashedPassword)); // true
    }

    public getPassword(): string {
        return this.password
    }

    // return comparison with hashed password
    public validatePassword(passwordTaped: String): boolean {
      //"this.password" corresponds to the hashedpassword that have been saved inside "password" when setting password
      // "passwordHash.verify(password, this.password)" is a boolean that returns true if this password corresponds to the hashed password
      console.log("Validation password: " + passwordHash.verify(passwordTaped, this.password))
      return passwordHash.verify(passwordTaped, this.password)
    }
}

//User CRUD II
export class UserHandler {
  public db: any

  public get(username: string, callback: (err: Error | null, result?: User) => void) {
    this.db.get(`user:${username}`, function (err: Error, data: any) {
      if (err) callback(err)
      else if (data === undefined) callback(null, data)
      else callback(null, User.fromDb(username, data))
    })
  }

  public save(user: User, callback: (err: Error | null) => void) {
    this.db.put(`user:${user.username}`, `${user.getPassword()}:${user.email}`, (err: Error | null) => {
      callback(err)
    })
  }

  public delete(username: string, callback: (err: Error | null) => void) {
    this.db.del(`user:${username}`, (err: Error | null) => {
      callback(err)
    })
  }

  constructor(path: string) {
    this.db = LevelDB.open(path)
  }
}