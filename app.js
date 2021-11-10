const express = require('express');
const app = express();

const port = process.env.port || 3000
const mongoose = require('mongoose');

const flash = require('express-flash')
const session = require('express-session')
const passport = require("passport")
const methodOverride = require('method-override')

const User = require("./models/User")


const initailizePassport = require('./config/passport-config')

// DB Config
const db = require('./config/keys').mongoURI;

const apiController = require('./controllers/apiController/apiController');
const htmlController = require('./controllers/htmlController/htmlController');


mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


app.use(express.urlencoded({extended:false}))

app.use('/assets', express.static(__dirname + '/public'));


app.set('view engine', 'ejs');


require('dotenv').config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());



initailizePassport(
    passport,
    async(name) => {
        const userFound = await User.findOne({name})
        return userFound
    },
    async(id) => {
        const userFound = await User.findOne({_id:id});
        return userFound
    }
)

app.use(flash());

app.use(
    session({
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:false,
    })
)

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('method'))

app.use('/', function (req, res, next) {
	console.log('Request Url:' + req.isAuthenticated());
	next();
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));

htmlController(app);
apiController(app);






