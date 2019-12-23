import express = require('express')
import { MetricsHandler, Metric } from './metrics'
import path = require('path')
import bodyparser = require('body-parser')
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './users'

const port: string = process.env.PORT || '8082'

const LevelStore = levelSession(session)
const app = express()

const dbUser: UserHandler = new UserHandler('./db/users')
const authRouter = express.Router()
const userRouter = express.Router()


app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');


//Middleware
//"/assets" retrives static files inside public folder
app.use('/assets', express.static('public'))

app.use(express.static(path.join(__dirname, '/../public')))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

//Routes
app.get('/', (req: any, res: any) => {
  res.render('home.ejs')
})

app.get('/account/:name', (req: any, res: any) => {
  res.render('account.ejs', {name: req.params.name})
})

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

app.post('/metrics/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send('ok')
  })
})

//for get function
app.get('/metrics/', (req: any, res: any) => {
  dbMet.getAll(
    (err: Error | null, result: any) => {
    if (err) throw err
    console.log(res)
    res.status(200).send(result)
  }
  )
})

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`Server is running on http://localhost:${port}`)
})

//User sessions
app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))


//User Authentification
authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
})

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})

authRouter.get('/account/:name', (req: any, res: any) => {
  res.render('account.ejs', {name: req.params.name})
})
/*
authRouter.get('/account', (req: any, res: any) => {
  res.render('account')
})
*/

authRouter.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})

//Signing up (saving the new user in db)
app.post('/signup', (req: any, res: any, next: any) => {
  //Display username
  console.log(req.body.username);
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      res.status(409).send("User already exists Try with another username")
    } else {
      let user = new User(req.body.username,req.body.email,req.body.password);
      dbUser.save(user, function (err: Error | null) {
        if (err) next(err)
        else res.redirect('/login')
      })
    }
  })
})

app.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    console.log(result)
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } 
    else {
      req.session.loggedIn = true
      req.session.user = result
      //res.redirect('/')
      //res.redirect('/account/:name', {name: req.session.username})
      res.redirect('/account/' + result.username)
    }
  })
})

app.use(authRouter)

//User creation and retrieval
userRouter.post('/', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      res.status(409).send("user already exists")
    } 
    else {
      dbUser.save(req.body, function (err: Error | null) {
        if (err) next(err)
        else res.status(201).send("user persisted")
      })
    }
  })
})

userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, function (err: Error | null, result?: User) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
    } 
    else res.status(200).json(result)
  })
})

app.use('/user', userRouter)

//User authorization middleware
const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

app.get('/', authCheck, (req: any, res: any) => {
  res.render('account', { name: req.session.username })
})
