// use express for routing
const express = require('express');
const app = express();
let bodyParser = require('body-parser');
let expressSanitizer = require('express-sanitizer');

// use lowdb as storage
let low = require('lowdb');
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
    response.render('index', conf)
});


app.get('/people', (request, response) => {
    if (db.has('people').value()) {
        response.send(db.get('people').value());
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

        const newPerson = db.get('people').find({'name': name}).value();
        console.log('UPDATED in database: \n', newPerson);
        response.status(200).json(newPerson);

    } else {
        // new
        if (name !== '' && name !== undefined) {
            db.get('people')
                .push({'name': name, 'image': image, 'loc': loc})
                .write();

            const newPerson = db.get('people').find({'name': name}).value();
            console.log('ADDED to database: \n', newPerson);
            response.status(201).json(newPerson);
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


// listen for requests
const listener = app.listen(process.env.PORT || 5711, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});


module.exports = app;
