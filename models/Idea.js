const mongoose = require('mongoose');
const schema = mongoose.Schema;

//Create Schema
const IdeaSchema = new schema({
  title : {
    type : String,
    required : true
  },

  details :{
    type : String,
    required : true
  },
  user:{           //Sec5-Lec34
    type : String,
    required : true
  },
  date:{
    type : Date,
    default : Date.now
  }
});

mongoose.model('ideas' , IdeaSchema);
