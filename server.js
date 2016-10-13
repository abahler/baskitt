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
app.use(express.static('public'));  // Use 'public' directory to serve assets like HTML, CSS...

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

// Set up endpoint for a DELETE to an item without an id
app.delete('/items', function(req, res) {
    // No id supplied, so return a 400. Why this doesn't work in the above DELETE route, I don't know.
    res.status(400).json({'error': 'No id supplied to deletion service'});
});

// Update an item
app.put('/items/:id', jsonParser, function(req, res) {
    var id = req.params.id;
    id = parseInt(id);
    
    // Toss out any bad requests from the client
    if ( !req.body || !('name' in req.body) || (typeof req.body.name != 'string') || isNaN(id) || (id != req.body.id) ) {
        return res.sendStatus(400);
    }
    
    // Look for supplied ID in 'id' key in every storage.items object
    var idMatches = storage.items.filter(function(obj, i, theItems){   
        if (obj.id === id) {
            return true;
        } else {
            return false;
        }
    });
    
    // If supplied ID doesn't exist in any of the storage.items objects, throw out the request
    if (idMatches.length === 0) {
        res.sendStatus(404);
    } else {
        // console.log(req.body);   > {name: 'Plaintains', id: 2}, if that was your data. Just prints the data.
        var updatedItem = storage.update(req.body);
        // Use 200 instead of 201, since the latter indicates a resource was created, which isn't the case here
        res.status(200).json(updatedItem);
    }
});

// `listen` method must be called after all routes are declared
app.listen(process.env.PORT || 8080, process.env.IP);

exports.app = app;
exports.storage = storage;