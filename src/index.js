let express = require('express');
let mongoose = require('mongoose');
let mustacheExpress = require('mustache-express');

let app = express();
let port = 80;
let uri = 'mongodb://mongo:27017/test'; 
 
mongoose.connect(uri);

app.engine('mustache', mustacheExpress()); 
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

let path = require('path');
app.use(express.static(path.join(__dirname + '/public')));

require('./models/dbModel')(mongoose);

app.get('/', function (req, res) {
	console.log(req.query.t); //to get query in url
	res.render('index', {});
});

app.listen(port);  