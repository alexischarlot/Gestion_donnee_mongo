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
const request = require('request');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

	let positionSchema = new mongoose.Schema({
		x: Number,
		y: Number
	})

	let veloSchema = new mongoose.Schema({
		name: String,
		address: String,
		position: positionSchema,
		stands: Number,
		bikes: Number
	})

	let Velo = mongoose.model('Velo', veloSchema);
	let Position = mongoose.model('Position', positionSchema);


	app.get('/', function (req, res) {
		request('https://api.jcdecaux.com/vls/v1/stations?contract=Nancy&apiKey=76f63b7a53281f294547d0317b572d88c1aa041c', {
			json: true
		}, (err, res, body) => {
			if (err) {
				return console.log(err);
			}
			console.log(body);
			body.forEach(element => {
				let velo = new Velo({
					name: element.name,
					address: element.address,
					position: {
						x: element.position.lat,
						y: element.position.lng
					},
					stands: element.available_bike_stands,
					bikes: element.available_bikes
				})
				velo.save();
			});
		});
		res.render('index', {
			start: req.query.start,
			end: req.query.end
		});
	});
});


app.get('/dep', function (req, res) {
	q = '/?start=' + req.query.start + '&end=' + req.query.end;
	res.render('interest', {
		start: req.query.start,
		end: req.query.end,
		se: 1
	});
});

app.get('/ar', function (req, res) {
	q = '/?start=' + req.query.start + '&end=' + req.query.end;
	res.render('interest', {
		start: req.query.start,
		end: req.query.end,
		se: 0
	});
});

app.listen(port);