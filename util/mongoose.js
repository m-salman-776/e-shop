let mongoose = require('mongoose')
db = 'mongodb://127.0.0.1:27017/eshop'
require('dotenv').config()
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useCreateIndex : true,
    useUnifiedTopology:true
}).then(e=>{
    console.log('Success')
})
.catch(e=>{
    console.log(e)
})