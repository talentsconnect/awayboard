// use express for routing
const express = require('express');
const app = express();
let bodyParser = require('body-parser');

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


// routing
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(400).send('Error!');
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
    if (db.get('people').find({'name': request.body.name}).value()) {
        //update
        db.get('people')
            .find({'name': request.body.name})
            .assign({'name': request.body.name, 'image': request.body.image, 'loc': request.body.loc})
            .write();

        const newPerson = db.get('people').find({'name': request.body.name}).value();
        console.log('UPDATED in database: \n', newPerson);
        response.status(200).json(newPerson);

    } else {
        // new
        db.get('people')
            .push({'name': request.body.name, 'image': request.body.image, 'loc': request.body.loc})
            .write();

        const newPerson = db.get('people').find({'name': request.body.name}).value();
        console.log('ADDED to database: \n', newPerson);
        response.status(201).json(newPerson);
    }
});


app.delete('/person', (request, response) => {
    if (db.get('people').find({'name': request.body.name}).value()) {
        db.get('people')
            .remove({'name': request.body.name})
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
