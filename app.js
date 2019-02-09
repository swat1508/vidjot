const express = require('express');
const path = require('path');  //Sec5-Lec27
const exphbs = require('express-handlebars');  //exphbs - expresshandlebars

const bodyParser = require('body-parser');

const passport = require('passport');   //Sec5_Lec30

const mongoose = require('mongoose');

const methodOverride = require('method-override'); //Sec4-Lec22

const flash =  require('connect-flash');     //Sec4-Lec24
const session =  require('express-session'); //Sec4-Lec24

const app = express();

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

//Map Global Warning - Get rid of Warning
mongoose.Promise = global.Promise;

//Database Config
const db = require('./config/database');


//connect to mongoose
/*Sec6-Lec35
mongoose.connect('mongodb://localhost/vidjot-dev',{    */
mongoose.connect(db.mongoURI,{              //Sec6-Lec35
//  useMongoClient : true
}).then(() => console.log('Mongo DB is Connected ...'))
  .catch(err => console.log(err));


//Handlebars Middleware
app.engine('handlebars',exphbs({
defaultLayout : 'main'
}));
app.set('view engine' , 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json())

//Static Folder - Sec5-Lec27
app.use(express.static(path.join(__dirname,'public')));

//method-override Middleware
app.use(methodOverride('_method'));  //Sec4-Lec22

//express-session middleware
app.use(session({
  secret: 'secret',// this secret can be anything usually ==> secret: 'secret'
  resave: true, 
  saveUninitialized: true
  //cookie: { secure: true } //not needed
}))

//Passport Middleware   //Sec5_Lec31
app.use(passport.initialize());
app.use(passport.session());

//connect -session middleware
app.use(flash());

//Global Varibales for flash
app.use(function(req,res,next){
res.locals.success_msg = req.flash('success_msg');
res.locals.error_msg = req.flash('error_msg');
res.locals.error = req.flash('error'); // this for next chapter - authentication
res.locals.user = req.user || null;   //Sec5_Lec31
next();
});

//Use Routes
app.use('/ideas' ,  ideas);
app.use('/users' ,  users);

/* Sec6-Lec35
const port =  5000;   */
const port =  process.env.PORT || 5000;  //Sec6-Lec35


app.listen(port , () => {
  console.log(`Server started on port ${port} `);  
  /*  back tick - used for template string/template literal and basically 
  it allow us to include variables without having to concatenate
   The above line is equivalent to 
  console.log('Server started on port ' + port);
   */
});

//How Middleware workds - should be written before index route and about route 
/*
app.use(function(req,res,next){
  req.name = "Developer : SWAT SINHA ";
  next();
});
*/

//index route
app.get('/',(req,res) => {    
  const title = 'Welcome ...';
  res.render('index' ,  {
    title : title
  });
});

//about route
app.get('/about',(req,res) => {
  // res.send('ABOUT PAGE');
     res.render('about');
});

