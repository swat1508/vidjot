const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {ensureAuthenticated} = require('../helpers/auth'); //Sec5_Lec33


//cut-paste from app.js starts

//Load Idea Model
require('../models/Idea');
const idea = mongoose.model('ideas');

//Add Idea Form 
/* Sec5-Lec33 
router.get('/add',(req,res) => {  */
router.get('/add', ensureAuthenticated, (req,res) => { //Sec5-Lec33
  res.render('ideas/add');
});

//Process Form 
/*Sec5-Lec33
router.post('/', (req,res)=> {  */
router.post('/',ensureAuthenticated, (req,res)=> {  //Sec5-Lec33
console.log(req.body);
//res.send('Ok');

let errors = [];
if(! req.body.title){
 debugger;
 console.log('error ==> title');
 console.log("Details : " , req.body.details);
 errors.push({text :  'Please add a title '});
}
if(! req.body.details){
 debugger;
 console.log('error ==> details ');
 errors.push({text :  'Please add some details '});
}  
 
 if(errors.length > 0){
   console.log('errors.length > 0 ');
   res.render('ideas/add',{
     errors : errors , 
     title : req.body.title,
     details : req.body.details
   });
 }else{
   console.log('Passed Ok ');
//   res.send('passed');
const newUser ={
   title : req.body.title,
   details : req.body.details,
   user:req.user.id    //Sec5-Lec34
}
 new idea(newUser)
          .save()
          .then(idea =>{
           req.flash('success_msg' ,  'Video Idea Added'); //Sec4-Lec24
            res.redirect('/ideas');
          })

 }
});


//Idea Index Page
/* Sec5-Lec33
router.get('/',(req,res)=>{  */
router.get('/',ensureAuthenticated , (req,res)=>{     //Sec5-Lec33
//Sec5-Lec34 idea.find({})
idea.find({user : req.user.id})  //Sec5-Lec34
.sort({date : 'desc'})
.then(ideas =>{
   res.render('ideas/index',{
       ideas : ideas
       });
     });
   });

//Edit Idea Form 
/*Sec5-Lec33
router.get('/edit/:id',(req,res) => { */
router.get('/edit/:id',ensureAuthenticated,(req,res) => {  //Sec5-Lec33
idea.findOne({
 _id : req.params.id
})
.then(idea =>{
  if(idea.user != req.user.id){           //Sec5-Lec34
    req.flash('error_msg' , 'Not Authorized To Access');
    res.redirect('/ideas');
  }else{
    res.render('ideas/edit',{
      idea: idea
    });
  }
})

});
//Edit Form Process
/*Sec5-Lec33
router.put('/:id',(req,res) => {  */
router.put('/:id',ensureAuthenticated,(req,res) => {   //Sec5-Lec33
idea.findOne({
_id : req.params.id
})
.then(idea =>{
         //new values
   idea.title = req.body.title;
   idea.details = req.body.details;

 idea.save()
     .then(idea =>{
       req.flash('success_msg' ,  'Video Idea Updated');//Sec4-Lec24
           res.redirect('/ideas');
           })   
});  
});

//Delete Idea
/*Sec5-Lec33
router.delete('/:id', (req,res) =>{  */
router.delete('/:id',ensureAuthenticated, (req,res) =>{  //Sec5-Lec33
idea.remove({_id : req.params.id})
    .then(() => {
     req.flash('success_msg' ,  'Video Idea Removed');//Sec4-Lec24
      res.redirect('/ideas');
    })
});
//cut-paste from app.js ends

module.exports= router;