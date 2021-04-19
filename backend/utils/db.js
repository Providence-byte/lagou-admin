var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lagou-admin',{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify:true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


//构建users modal
var usersSchema = mongoose.Schema({
    username: String,
    password: String
});

var Users = mongoose.model('users', usersSchema);

//构建positions modal
var positionsSchema = mongoose.Schema({
    companyLogo:String,
    companyName:String,
    positionName:String,
    city:String,
    salary:String,
    createTime:String
})

var Positions = mongoose.model('positions', positionsSchema);

exports.Users = Users;
exports.Positions = Positions;