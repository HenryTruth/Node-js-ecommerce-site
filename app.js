const express = require('express');
const app = express();
const port = process.env.port || 3000

const mongoose = require('mongoose');

app.use(express.urlencoded({extended:false}))

var apiController = require('./controllers/apiController');
var htmlController = require('./controllers/htmlController');


mongoose.connect('mongodb+srv://joshua:vocabulary@cluster0.ykj7u.mongodb.net/Clustor0?retryWrites=true&w=majority')
.then(() => {
	app.listen(port, () => {
		console.log("server is running on Port 3000")
	});
})


app.use('/assets', express.static(__dirname + '/public'));


app.set('view engine', 'ejs');

app.use('/', function (req, res, next) {
	console.log('Request Url:' + req.url);
	next();
});

htmlController(app);
apiController(app);



