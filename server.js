// use express for routing
const express = require('express');
const app = express();
let bodyParser = require('body-parser');

// use lowdb as storage
let low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('.data/db.json');
const db = low(adapter);

// default db list
db.defaults({people: []})
    .write();

const conf = require('./conf');
app.set('view engine', 'pug');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded


// routing
app.get("/", (request, response) => {
    response.render('index', conf)
});


app.get('/people', (request, response) => {

    if (db.has('people').value()) {
        response.send(db.get('people').value());
    }
});


app.post('/people', (request, response) => {
    if (db.has('people').value()) {
        db.set('people', request.body)
            .write();

        console.log('people written to database: \n', request.body);
        response.sendStatus(200);
    } else {
        response.sendStatus(400);
    }
});


app.post('/person', (request, response) => {
    if (db.has('people').value()) {

        console.log(db.get('people').find({'name': request.body.name}).value());

        if (db.get('people').find(request.body.name).value()) {
            db.get('people')
                .find({'name': request.body.name})
                .assign(request.body) // todo look why this doesnt update
                .write();

        } else {
            db.get('people')
                .push(request.body)
                .write();
        }

        console.log('Person written to database: \n', request.body);
        response.sendStatus(200);
    } else {
        response.sendStatus(400);
    }
});


// listen for requests
const listener = app.listen(process.env.PORT || 5711, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});
