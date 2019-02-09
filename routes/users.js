const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');     //Sec5_Lec29
const passport = require('passport');   //Sec5_Lec30

//Load User Model
require('../models/User');
const User = mongoose.model('users');

//User Login Route
router.get('/login',(req,res) => {
  res.render('users/login');
  });

  //User Register Route
  router.get('/register',(req,res) => {
    res.render('users/register');
    });

//Login Form Post
router.post('/login' , (req,res,next) => {    //Sec5_Lec30
passport.authenticate('local' , {
  successRedirect : '/ideas',
  failureRedirect : '/users/login',
  failureFlash : true
})(req,res,next);
});


//Register Form Post
    router.post('/register',(req,res) => {
      console.log(req.body);
      // res.send('register');

      let errors = [];
      if(req.body.password != req.body.password2){
        errors.push({text : 'Passwords Do Not Match'});
      } else if(req.body.password.length < 4 ){
        errors.push({text : 'Passwords Must be atleast 4 chars'});
      }

  if(errors.length > 0){  //so that form does not get cleared if anything wrong
        res.render('users/register' , {
          errors : errors,
          name : req.body.name,
          email : req.body.email,
          password : req.body.password,
          password2 : req.body.password2,
        });
      }else{
        User.findOne({email : req.body.email})
        .then(user => {
          if(user){
            req.flash('error_msg' , 'Email Already Registred');
            res.redirect('/users/register');
          }else{
            const newUser= new User({
              name:req.body.name,
              email:req.body.email,
              password:req.body.password
            });
            bcrypt.genSalt(10, (err,salt)=>{
              bcrypt.hash(newUser.password , salt , (err,hash) =>{
                if(err) throw err;
                newUser.password = hash;

                newUser.save()
                .then(user => {
                  req.flash('success_msg' , 'You are registered now')
                  res.redirect('/users/login');
                })

                .catch(err => {
                  console.log(err);
                  return;
                });
              })
            })

          }

        });



//        res.send('passed successfully');
      }
      });

//Logout User
router.get('/logout', (req,res)=> {
req.logOut();
req.flash('success_msg','You Are Logged Out');
res.redirect('/users/login');
});



module.exports= router;
