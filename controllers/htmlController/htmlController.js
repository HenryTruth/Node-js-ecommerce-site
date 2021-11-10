const passport = require("passport")
const bcrypt = require('bcryptjs')
const User = require("../../models/User")
const express = require('express');
const {
    checkAuthenticated,
    checkNotAuthenticated
} = require('../../middleware/auth')




module.exports = function(app) {
	app.get('/',checkAuthenticated, (req, res) => {
        res.render('index');
    });
    
    app.get('/account',checkNotAuthenticated, function(req, res){
        res.render('account')
    })

    app.post('/login',checkNotAuthenticated,
    passport.authenticate("local",{
        successRedirect:"/dashboard",
        failureRedirect:"/account",
        failureFlash:true
    }),(req,res) => {
        console.log(req.body)
    })

    app.post('/register',checkNotAuthenticated, async(req,res) => {
        const userFound = await User.findOne({email:req.body.email})        

        if(userFound){
            req.flash('error', 'User with that email already exists')
            res.redirect('/account')
        }else if(req.body.password !== req.body.password2){
            req.flash('error', 'Password do not match')
            res.redirect('/account')
        }
        else{
            try{
                console.log(req.body)

                const hashedPassword = await bcrypt.hash(req.body.password, 10)
                const user = new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:hashedPassword
                })

                await user.save()
                res.redirect("/dashboard")
            } catch(error){
                console.log('got 2 here')
                console.log(error)
                res.redirect("/account")
            }
        }
    });

    app.get('/logout', (req,res) => {
        req.logout()
        res.redirect("/account")
    })
    
    app.get('/confirm', function(req,res){
        res.render('confirm')
    })
    
    app.get('/dashboard',checkAuthenticated, function(req, res){
        console.log(req.user)
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

