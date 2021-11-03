var express = require('express');
var app = express();
var port = process.env.port || 3000
const path = require('path')
const mongoose = require('mongoose');

// main().catch(err => console.log(err))
// async function main(){
// 	await mongoose.connect('mongodb+srv://joshua:vocabulary1@A@cluster0.ykj7u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
// }


app.use('/assets', express.static(__dirname + '/public'));


app.set('view engine', 'ejs');

app.use('/', function (req, res, next) {
	console.log('Request Url:' + req.url);
	next();
});

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/account', function(req, res){
	res.render('account')
})

app.get('/confirm', function(req,res){
	res.render('confirm')
})

app.get('/dashboard', function(req, res){
	res.render('dashboard')
})

app.get('/form', function(req,res){
	res.render('form')
})

app.get('/item', function(req,res){
	res.render('item')
})

app.get('/myitem', function(req,res){
	res.render('myItem')
})


app.listen(port)