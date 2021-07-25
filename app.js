const path = require('path');
const hbs = require('hbs')
require('./util/mongoose')
const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const MongoDBStore = require('connect-mongodb-session')(session)
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');
const flash= require('connect-flash')
// const multer = require('multer')
const store = new MongoDBStore({
    uri:'mongodb://127.0.0.1:27017/eshop',
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
app.use(flash())
app.set('view engine', 'hbs');
app.set('views', viewPath);
app.use(express.static(publicDir));
hbs.registerPartials(partialPath)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer().single('image'))
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)
app.use(errorController.get404);
const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log('Server is running')
});
