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
        var index = id - 1; // Item 0 has an id of 1, item 1 has an id of 2, etc.
        var deleteResult = this.items.splice(index, 1);
        if (deleteResult.length > 0) {
            return true;    // Succeeded
        } else {
            return false;   // Failed for some reason
        }
    },
    update: function(reqBody) {
        var index = reqBody.id - 1;
        // Don't parse out data from body, then drill down to replace it. Just rotate it out.
        this.items[index] = reqBody;  
        return this.items[index];
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

// *** ROUTES ***

// Get list of items
app.get('/items', function(req, res) {
    res.json(storage.items);
});

// Add an item
app.post('/items', jsonParser, function(req, res) {
    if (!('name' in req.body)) {
        return res.sendStatus(400);
    }
    
    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

// Delete an item
app.delete('/items/:id', function(req, res) {
    var id = req.params.id;
    if (!id) {
        res.status(400).json({'error': 'No id supplied to deletion service'});
    }
    id = parseInt(id);  // Make sure we're working with a number

    // Supplied id needs to be in items list
    if (storage.items[id] === undefined) {  
        var msg = 'The supplied id was not found in the items list';
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

// Update an item
app.put('/items/:id', jsonParser, function(req, res) {
    var id = req.params.id;
    id = parseInt(id);
    
    // Toss out any bad requests from the client
    if ( !('name' in req.body) || isNaN(id) || (id != req.body.id) ) {
        return res.sendStatus(400);
    }
    
    // console.log(req.body);   > {name: 'Plaintains', id: 2}, if that was your data. Just prints the data.
    var updatedItem = storage.update(req.body);
    res.status(201).json(updatedItem);
});

// `listen` method must be called after all routes are declared
app.listen(process.env.PORT || 8080, process.env.IP);

exports.app = app;
exports.storage = storage;