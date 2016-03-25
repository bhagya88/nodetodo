var mongoose= require('mongoose');
var Schema=mongoose.Schema;


var userSchema= new Schema({
   
	username: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true, select: false},
	todos: [{
		task : String,
		completed: Boolean
	}]
		
		
});

module.exports = mongoose.model('user', userSchema);