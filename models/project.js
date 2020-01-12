var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var projectSchema = new Schema({ 
 title: {type: String, required: true}, 
 description: {type: String, required: true}, 
 image_url: {type: String, required: true},
 content: {type: String, required: true},
 project_type: {type:String, required: true},
 project_date: {type:String, required: true},
 team_size: {type:Number, required: true},
 duration: {type:Number, required: true},
 created: {type:Date, default: Date.now()}
});


let model;
try {
    model = mongoose.connection.model('Project');
}
catch(e) {
    model = mongoose.model('Project', projectSchema);
}

module.exports = model;