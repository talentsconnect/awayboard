var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);


describe('People', function () {
    it('should list people on /people GET', function (done) {
        chai.request(server)
            .get('/people')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('array');
                done();
            });
    });


    it('shouldn‘t delete a non-existing person on /person DELETE', function (done) {
        chai.request(server)
            .delete('/person/')
            .send({'name': 'Frank Grimes'})
            .end(function (err, res) {
                res.should.have.status(404);
                done();
            });
    });


    it('should create a SINGLE person on /person POST', function (done) {
        chai.request(server)
            .delete('/person/')
            .send({'name': 'Smithers'})
            .end(function (err, res) {
                res.should.have.any.status(404, 204);

                chai.request(server)
                    .post('/person')
                    .send({
                        'name': 'Smithers',
                        'image': 'https://frinkiac.com/img/S02E22/1071621.jpg',
                        'loc': 'away'
                    })
                    .end(function (err, res) {
                        res.should.have.status(201);
                        res.should.be.json;
                        res.body.should.be.an('object');
                        res.body.should.have.property('name');
                        res.body.should.have.property('image');
                        res.body.should.have.property('loc');
                        res.body.name.should.have.string('Smithers');
                        res.body.image.should.equal('https://frinkiac.com/img/S02E22/1071621.jpg');
                        res.body.loc.should.equal('away');
                        done();
                    });
            })

    });


    it('should have a person on /people GET', function (done) {
        chai.request(server)
            .post('/person')
            .send({
                'name': 'Smithers',
                'image': 'https://frinkiac.com/img/S02E22/1071621.jpg',
                'loc': 'away'
            })
            .end(function (err, res) {
                chai.request(server)
                    .get('/people')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.should.be.json;
                        res.body.should.be.an('array');
                        res.body.should.deep.include({
                            'name': 'Smithers',
                            'image': 'https://frinkiac.com/img/S02E22/1071621.jpg',
                            'loc': 'away'
                        });
                        done();
                    });
            });
    });


    it('should update a single person on /person POST', function (done) {
        chai.request(server)
            .post('/person')
            .send({
                'name': 'Smithers',
                'image': 'https://frinkiac.com/img/S02E22/1071621.jpg',
                'loc': 'office'
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.an('object');
                res.body.should.have.property('loc');
                res.body.loc.should.equal('office');
                done();
            });
    });


    it('should delete a single person on /person DELETE', function (done) {
        chai.request(server)
            .post('/person')
            .send({
                'name': 'Smithers',
                'image': 'https://frinkiac.com/img/S02E22/1071621.jpg',
                'loc': 'office'
            })
            .end(function (err, res) {
                chai.request(server)
                    .delete('/person/')
                    .send({'name': 'Smithers'})
                    .end(function (err, res) {
                        res.should.have.status(204);

                        chai.request(server)
                            .get('/people')
                            .end(function (err, res) {
                                res.should.have.status(200);
                                res.should.be.json;
                                res.body.should.be.an('array');
                                res.body.should.not.include({
                                    'name': 'Smithers',
                                    'image': 'https://frinkiac.com/img/S02E22/1071621.jpg',
                                    'loc': 'office'
                                });
                                done();
                            });
                    });
            });
    });
});