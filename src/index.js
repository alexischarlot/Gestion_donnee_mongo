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
	let connected = false;
	if (req.session.email) {
		connected = true;
		User.findOne({
			email: req.session.email
		}, function (err, user) {
			if (err) return handleError(err)
			user.boxes.forEach(function (element) {

				if (element.isCurrent) {
					req.session.currentBox = element.id;
				}
			});
		});
	}
	res.redirect('/catalog');
});

app.listen(port);  