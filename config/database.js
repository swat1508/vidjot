if(process.env.NODE_ENV == 'production'){
  module.exports = {mongoURI: 'mongodb://swat1508:Sinh@1508@ds129045.mlab.com:29045/vidjot-prod'}
}else{
  module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}