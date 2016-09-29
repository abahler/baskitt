var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var express = require('express');

var Storage = {
    add: function(name) {
        var item = {name: name, id: this.setId};
        this.items.push(item);
        this.setId += 1;
        return item;
    },
    delete: function(id) {
        var deleteResult = this.items.splice(id, 1);    // Returns item removed (on success) or empty array (on fail)
        if (deleteResult.length > 0) {
            return true;    // Succeeded
        } else {
            return false;   // Failed for some reason
        }
    }
};

var createStorage = function() {
    var storage = Object.create(Storage);
    storage.items = [];
    storage.setId = 1;
    return storage;
};

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!('name' in req.body)) {
        return res.sendStatus(400);
    }
    
    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.listen(process.env.PORT || 8080, process.env.IP);

app.delete('/items/:id', function(req, res) {
    var id = req.params.id;
    id = parseInt(id);
    // Supplied id needs to be numeric, and needs to be in items list
    if (storage.items[id] === undefined) {  
        var msg;
        if (typeof id != 'number') {
            msg = 'Non-numeric id supplied; must be a number';
        } else if (storage.items[id] == '') {
            msg = 'The supplied id was not found in the items list';
        }
        
        res.status(404).json({'error': msg});
    } else {
        var r = storage.delete(id);     // Returns true on success   
        if (r) {
            res.status(200);
        } else {
            res.status(500).json({'error': 'You passed a valid item id, but the item could not be deleted for some reason.'});
        }
    }
});

// TODO: add 'PUT' endpoint
/*
> Create an endpoint that responds to a PUT request to /items/:id
> If the item is edited, the server should respond with a 200 OK status and the new item
> If the request is incorrectly formed (bad body, missing id), the request should fail gracefully
> If a non-existent ID is supplied, your endpoint should create a new item using the ID supplied.
> Remember that you're passing the ID in the request.params and the request.body, 
    so you should check that they match as well.
*/