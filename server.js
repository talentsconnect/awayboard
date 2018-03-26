// server.js
// where your node app starts

// init project
const express = require('express')
const app = express();
var bodyParser = require('body-parser');

var low = require('lowdb');

const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('.data/db.json')
const db = low(adapter);

// default  list
db.defaults(
    {
        people: [
            {"name": "", "loc": ""}
        ]
    }
).write();

const conf = require('./conf');
app.set('view engine', 'pug');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded


app.get("/", (request, response) => {
    response.render('index', conf)
});


app.get("/people", (request, response) => {

    var dbPeople = [];
    var people = db.get('people').value();

    response.send(people.people);

});

app.post("/people", (request, response) => {

    db.set('people', request.body)
        .write();

    console.log("people written to database: \n", request.body);
    response.sendStatus(200);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
})
