var express = require('express');
var dish = require('./routes/dish');
 
var app = express();
 
app.configure(function () {
	app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
	app.use(express.bodyParser());
});

app.get('/dish', dish.findAll);
app.get('/dish/:id', dish.findById);
app.post('/dish/', dish.addDish);
app.put('/dish/:id', dish.updateDish);
app.delete('/dish/:id', dish.deleteDish);
 
app.listen(3000);

console.log('Listening on port 3000...');
