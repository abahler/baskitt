var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
// 'app' and 'storage' objects available when exported from server.js
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function() {
    
    it('should list items on GET', function(done) {
        chai.request(app)
        .get('/items')
        .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(200);
            res.should.be.json;
            // Test for return types
            res.body.should.be.a('array');
            res.body[0].should.be.a('object');
            // Test for keys
            res.body[0].should.have.property('id');
            res.body[0].should.have.property('name');
            // Test for value types
            res.body[0].id.should.be.a('number');
            res.body[0].name.should.be.a('string');
            // Test for value contents
            res.body[0].name.should.equal('Broad beans');
            res.body[1].name.should.equal('Tomatoes');
            res.body[2].name.should.equal('Peppers');
            done();
        });
    });
    
    it('should add an item on POST', function(done) {
        chai.request(app)
        .post('/items')
        .send({'name': 'Kale'})
        .end(function(err, res) {
            should.equal(err, null);    // Asserting that there should be no error
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('id');
            res.body.name.should.be.a('string');
            res.body.id.should.be.a('number');
            res.body.name.should.equal('Kale');
            storage.items.should.be.a('array');
            storage.items.should.have.length(4);    // Can hard-code because we know we hard-coded 3 items initially
            storage.items[3].should.be.a('object');
            storage.items[3].should.have.property('id');
            storage.items[3].should.have.property('name');
            storage.items[3].id.should.be.a('number');
            storage.items[3].name.should.be.a('string');
            storage.items[3].name.should.equal('Kale');
            done();
        });
    });
    
    it('should edit an item on PUT', function(done) {
        chai.request(app)
        .put('/items/1')
        .send({'name': 'Spinach', 'id': 1})
        .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('id');
            res.body.name.should.be.a('string');
            res.body.id.should.be.a('number');
            res.body.name.should.equal('Spinach');
            storage.items.should.be.a('array');
            // Omitted check for storage.items.length == 4 because what if it changes between test runs?
            storage.items[0].should.be.a('object');
            storage.items[0].should.have.property('name');
            storage.items[0].should.have.property('id');
            storage.items[0].name.should.be.a('string');
            storage.items[0].id.should.be.a('number');
            storage.items[0].name.should.equal('Spinach');
            done();
        });
    });
    
    it('should delete an item on DELETE', function(done) {
        chai.request(app)
        .delete('/items/1')
        .send({'id': 1})
        .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(200);
            storage.items[0].id.should.not.equal(1);
            // Fewer assertions than the above tests because we have no response other than the HTTP 200 status
            done();
        });
    });
    
    // *** Custom tests from 'Try It!' section ***
    
    // QUESTION: Section asks for test for a POST to an ID that doesn't exist, but this doesn't make sense,
    //      as it will exist when it is created.
    it('should respond with a 400 on POST without body data');
    it('should respond with a 400 on POST without valid JSON');
    it('should respond with a 404 on PUT without id in endpoint');
    it('should respond with a 400 on PUT when ids in endpoint and body differ');
    it('should respond with a 404 on PUT with nonexistent id');
    it('should respond with a 400 on PUT without body');
    it('should respond with a 400 to a PUT without valid JSON');
    it('should respond with a 404 to a DELETE on an invalid id');   // Badly formed id
    it('should respond with a 400 to a DELETE without an id');
    
    // Try to think of any additional edge cases which could occur
    it('should respond with a 400 to a PUT where item name is not a string');   // Same as 'PUT without valid JSON'?
});