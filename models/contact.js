var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var formSchema = new Schema({ 
 fullname: {type: String, required: true}, 
 email: {type: String, required: true}, 
 message: {type: String, required: true},
 created: {type: Date, default: Date.now()}
}); 


let model;
try {
    model = mongoose.connection.model('ContactForm');
}
catch(e) {
    model = mongoose.model('ContactForm', formSchema);
}

module.exports = model;