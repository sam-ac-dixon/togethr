var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ScriptSchema   = new Schema({
    userId: String,
    name: String,
    code: String
});

module.exports = mongoose.model('Script', ScriptSchema);
