var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('dishdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'dishdb' database");
        db.collection('dish', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'dish' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving dish: ' + id);
    db.collection('dish', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('dish', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addDish = function(req, res) {
    var dish = req.body;
    console.log('Adding dish: ' + JSON.stringify(dish));
    db.collection('dish', function(err, collection) {
        collection.insert(dish, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateDish = function(req, res) {
    var id = req.params.id;
    var dish = req.body;
    console.log('Updating dish: ' + id);
    console.log(JSON.stringify(dish));
    db.collection('dish', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, dish, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating dish: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(dish);
            }
        });
    });
}

exports.deleteDish = function(req, res) {
    var id = req.params.id;
    console.log('Deleting dish: ' + id);
    db.collection('dish', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var dish = [
    {
        name: "Idli",
        type: "Main",
        ingredient: "Rice / Urad",
        country: "India",
        region: "Tamil Nadu",
        description: "Baked rice cake...",
        picture: "rice.jpg"
    },
    {
        name: "Dosa",
        type: "Main",
        ingredient: "Rice / Urad",
        country: "India",
        region: "Tamil Nadu",
        description: "Thin rice crepe...",
        picture: "dosa.jpg"
    }];

    db.collection('dish', function(err, collection) {
        collection.insert(dish, {safe:true}, function(err, result) {});
    });

};
