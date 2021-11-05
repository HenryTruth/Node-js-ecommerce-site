require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const flash = require('express-flash')
const session = require('express-session')
const passport = require("passport")
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')

const User = require("../models/User")


const {
    checkAuthenticated,
    checkNotAuthenticated
} = require('../middleware/auth')

const initailizePassport = require('../passport-config')

initailizePassport(
    passport,
    async(email) => {
        const userFound = await User.findOne({email})
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

module.exports = function(app) {
	
	app.get('/',checkAuthenticated, function(req, res) {
        res.render('index');
    });
    
    app.get('/account', checkNotAuthenticated, function(req, res){
        res.render('account')
    })

    app.post('/account',checkNotAuthenticated,
    passport.authenticate("local",{
        successRedirect:"/",
        failureRedirect:"/login",
        failure:true
    }))

    app.post('/account', checkNotAuthenticated, async(req,res) => {
        const userFound = await User.findOne({email:req.body.email})

        if(userFound){
            req.flash('error', 'User with that email already exists')
            res.redirect('/register')
        }else{
            try{
                const hashedPassword = await bcrypt.hash(req.body.password, 10)
                const user = new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:hashedPassword
                })

                await user.save()
                res.redirect("/account")
            } catch(error){
                console.log(error)
                res.redirect("/account")
            }
        }
    });

    app.delete('/logout', (req,res) => {
        req.logout()
        res.redirect("/login")
    })
    
    app.get('/confirm', function(req,res){
        res.render('confirm')
    })
    
    app.get('/dashboard', function(req, res){
        res.render('dashboard', {name:req.user.name})
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
    
}

