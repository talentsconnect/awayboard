// use express for routing
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const _ = require('lodash');

// use lowdb as storage
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('.data/db.json');
const db = low(adapter);
db.defaults({people: []})
    .write();

// pug templating
const conf = require('./conf');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(expressSanitizer());

// routing
app.use((err, request, response, next) => {
    console.error(err.stack);
    response.status(400).send('Error!');
});


app.get("/", (request, response) => {
    response.render('index', conf);
});
app.get("/app", (request, response) => {
    response.render('app', conf);
});


app.get('/people', (request, response) => {
    if (db.has('people').value()) {
        response.send(db.get('people').value());
    }
});


app.get('/person/:name', (request, response) => {
    if (db.get('people').find({'name': request.params.name}).value()) {
        response.status(200);
        response.send(db.get('people').find({'name': request.params.name}).value());
    } else {
        response.status(404);
    }
});


app.put('/person/:name/loc/:loc', (request, response) => {
    const name = request.params.name;
    const loc = request.params.loc;

    if (!app.validLocation(loc)) {
        response.sendStatus(400);
    } else {
        if (db.get('people').find({'name': name}).value()) {

            db.get('people')
                .find({'name': name})
                .assign({'name': name, 'loc': loc})
                .write();

            const person = db.get('people').find({'name': name}).value();
            console.log('UPDATED in database: \n', person);
            response.status(200).json(person);

        } else {
            response.sendStatus(404);
        }
    }
});


app.post('/person', (request, response) => {
    const name = request.sanitize(request.body.name);
    const image = request.sanitize(request.body.image);
    const loc = request.sanitize(request.body.loc);

    if (db.get('people').find({'name': name}).value()) {
        //update
        db.get('people')
            .find({'name': name})
            .assign({'name': name, 'image': image, 'loc': loc})
            .write();

        const person = db.get('people').find({'name': name}).value();
        console.log('UPDATED in database: \n', person);
        response.status(200).json(person);

    } else {
        // new
        if (name !== '' && name !== undefined) {
            db.get('people')
                .push({'name': name, 'image': image, 'loc': loc})
                .write();

            const person = db.get('people').find({'name': name}).value();
            console.log('ADDED to database: \n', person);
            response.status(201).json(person);
        } else {
            response.status(400).send('Error!');
        }
    }
});


app.delete('/person', (request, response) => {
    const name = request.sanitize(request.body.name);

    if (db.get('people').find({'name': name}).value()) {
        db.get('people')
            .remove({'name': name})
            .write();

        console.log('REMOVED from database: \n', request.body);
        response.sendStatus(204);
    } else {
        response.sendStatus(404);
    }
});


app.validLocation = function (input) {
    return _.find(conf.columns, {key: input});
}


// listen for requests
const listener = app.listen(process.env.PORT || 5711, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});


module.exports = app;
