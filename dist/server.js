"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Import ExpressJS
var express = require("express");
var path = require("path");
var bodyparser = require("body-parser");
var session = require("express-session");
var levelSession = require("level-session-store");
//Import classes
var metrics_1 = require("./metrics");
var users_1 = require("./users");
//Defining port number
var port = process.env.PORT || '8082';
var LevelStore = levelSession(session);
// Set express as Node.js web application server framework.
var app = express();
var dbUser = new users_1.UserHandler('./db/users');
var dbMet = new metrics_1.MetricsHandler('./db/metrics');
var authRouter = express.Router();
var userRouter = express.Router();
app.set('views', __dirname + "/../views");
// Set EJS as templating engine 
app.set('view engine', 'ejs');
//Middleware
//"/assets" retrives static files inside public folder
app.use('/assets', express.static('public'));
app.use(express.static(path.join(__dirname, '/../public')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
//ROUTES
//Home page
app.get('/', function (req, res) {
    res.render('home.ejs');
});
//User Account page
app.get('/account/:name', function (req, res) {
    dbMet.getAll(function (err, result) {
        if (err)
            throw err;
        console.log(res);
        //res.status(200).send(result)
        var data = { name: req.params.name,
            metrics: result };
        res.render('account.ejs', { data: data });
    });
});
//Get a metric
app.get('/metrics/', function (req, res) {
    dbMet.getAll(function (err, result) {
        if (err)
            throw err;
        console.log(res);
        res.status(200).send(result);
    });
});
//Listening to port
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("Server is running on http://localhost:" + port);
});
//User sessions
app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}));
//User Authentification
authRouter.get('/login', function (req, res) {
    res.render('login');
});
authRouter.get('/signup', function (req, res) {
    res.render('signup');
});
authRouter.get('/account/:name', function (req, res) {
    res.render('account.ejs', { name: req.params.name });
});
authRouter.get('/logout', function (req, res) {
    delete req.session.loggedIn;
    delete req.session.user;
    res.redirect('/login');
});
//POSTS
//Signing up (saving the new user in db)
app.post('/signup', function (req, res, next) {
    //Display username
    console.log(req.body.username);
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            res.status(409).send("User already exists Try with another username");
        }
        else {
            var user = new users_1.User(req.body.username, req.body.email, req.body.password);
            dbUser.save(user, function (err) {
                if (err)
                    next(err);
                else
                    res.redirect('/login');
            });
        }
    });
});
app.post('/login', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        console.log(result);
        if (err)
            next(err);
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login');
        }
        else {
            req.session.loggedIn = true;
            req.session.user = result;
            //res.redirect('/')
            //res.redirect('/account/:name', {name: req.session.username})
            res.redirect('/account/' + result.username);
        }
    });
});
//Adding a metric (saving the new metric in db)
app.post('/metric', function (req, res, next) {
    //Display username
    console.log(req.body.username);
    dbMet.get(req.body.timestamp, function (err, result) {
        var metric = new metrics_1.Metric(req.params.name, req.body.timestamp, req.body.value);
        result = [metric];
        dbMet.save(req.body.timestamp, result, function (err) {
            if (err)
                next(err);
            else
                res.redirect('/account/:name');
        });
    });
});
/* Adding metric (function of the course)
app.post('/metrics/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send()
  })
})
*/
app.use(authRouter);
//User creation and retrieval
userRouter.post('/', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists");
        }
        else {
            dbUser.save(req.body, function (err) {
                if (err)
                    next(err);
                else
                    res.status(201).send("user persisted");
            });
        }
    });
});
userRouter.get('/:username', function (req, res, next) {
    dbUser.get(req.params.username, function (err, result) {
        if (err || result === undefined) {
            res.status(404).send("user not found");
        }
        else
            res.status(200).json(result);
    });
});
app.use('/user', userRouter);
//User authorization middleware
var authCheck = function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect('/login');
};
app.get('/', authCheck, function (req, res) {
    res.render('account', { name: req.session.username });
});
