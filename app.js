const path = require('path');
const hbs = require('hbs')
require('dotenv').config()
const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const MongoDBStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose') 
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');
const flash= require('connect-flash')
const multer = require('multer')
const store = new MongoDBStore({
    uri:process.env.LOCAL_DATA_BASE,
    collection:'sessions'
})
const viewPath = path.join(__dirname,'templates','views')
const partialPath = path.join(__dirname,'templates','partials')
const publicDir = path.join(__dirname,'public')

const app = express();
app.use(session({secret:'some secret',resave:false,saveUninitialized:false,store}))
app.use((req,res,next)=>{
    if(!req.session.user) return next()
    User.findById(req.session.user._id)
    .then(user=>{
        req.user = user
        next()
    }).catch(err=>console.log(err))
})
const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images')
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g, '-')+ file.originalname)
    }
})
app.use(flash())
app.set('view engine', 'hbs');
app.set('views', viewPath);
app.use(express.static(publicDir))
app.use('/images',express.static(path.join(__dirname,'images')))
hbs.registerPartials(partialPath)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage:fileStorage}).single('image'))
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)
app.use(errorController.get404);
const port = process.env.PORT || 3000

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useCreateIndex : true,
    useUnifiedTopology:true
}).then(result=>{
    app.listen(port,()=>{
        console.log('Server is running')
    })
}).catch(e=>{
    console.log('Something went Wrong',e)
})