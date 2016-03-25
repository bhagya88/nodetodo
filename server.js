var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var user = require('./user');
var app = express();


// Use connect method to connect to the Server
mongoose.connect('mongodb://root:rootdb@ds017258.mlab.com:17258/tododb', function (err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Connected to the database');
	}
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


// process requests

app.get('/', function (req, res) {
	res.send('Welcome');
});


// get a user data
app.get('/:user', function (req, res) {
	user.findOne({
		username: req.params.user
	}).exec(function (err, user) {
		if (err) {
			res.send('Error occured while retriveing');
		}
		else {
			if(user){
			res.json(user);
			}
			else{
				res.send("user does not exist");
			}
		}

	});
});

//add new user	

app.post('/user', function (req, res) {

	var newUser = new user();
	newUser.username = req.body.username;
	newUser.password = req.body.password;
	newUser.todos=[];
	newUser.save(function (err, user) {
		if (err) {
			res.send('Error occured while inserting');
		}
		else {
			console.log(user);
			res.send();
		}
	});
});

// add a task to the todo list of a user

app.put('/addtodo', function (req, res) {
	console.log(req.body)
	console.log(user);
	user.findOneAndUpdate({
		username: req.body.username
	},  {$push: {todos: { task: req.body.task, completed :false}}},  {safe: true, upsert: true}).exec(function (err, user) {
		if (err) {
			res.send('Error occured while adding todo');
		}
		else {
			console.log(user);
			res.send(user);
		}


	});
});



// delete a task of a user
app.put('/deletetodo', function (req, res) {
	console.log(req.body)
	user.findOneAndUpdate({
		username: req.body.username
	},  {$pull: {todos: { task: req.body.task}}}).exec(function (err, user) {
		if (err) {
			res.send('Error occured while adding todo');
		}
		else {
			console.log(user);
			res.send(user);
		}

	});
});



// delete a user

app.delete('/user', function (req, res) {
	console.log(req.body)
	user.findOneAndRemove({
		username: req.body.username
	}, function (err, user) {
		if (err) {

			res.send('Error occured while deleting');
		}
		else {
			console.log(user);
			res.send(user);
		}


	});
});




// start server

app.listen('8080', function () {
	console.log("Listening on port 8080");
})