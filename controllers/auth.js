const User = require('../models/user')
exports.getLogin = (req, res, next) => {
  let message = req.flash('error')
  if(message.length > 0){
    message = message[0]
  }
  else message = null
    res.render('auth/login', {
      pageTitle: 'Login',
      isLoggedIn:req.session.isLoggedIn,
      errorMessage:message
    });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  try{
    const user = await User.findOne({email})
    if(!user || user.password !== password) {
      req.flash('error','Invalid email or password')
      return res.redirect('/login')
    }
    req.session.user = user
    req.session.isLoggedIn=true
    await req.session.save()
    res.redirect('/products')
  }
  catch(e){
    res.redirect('/login')
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err)=>{
    if(err)  console.log(err)
    res.redirect('/')
  })
}; 

exports.getSignUp = (req,res,next)=>{
  let message = req.flash('error')
  message = message.length > 0 ? message[0] : null
  res.render('auth/signup',{
    pageTitle:'Sign Up',
    errorMessage:message
  })
}

exports.postSigUp = async (req,res,next)=>{
  const email = req.body.email
  const password = req.body.password
  const confirmedPassword = req.body.confirmedPassword
  try{
    const existingUser = await User.findOne({email})
    if(existingUser){
      req.flash('error','User already exist!')
      throw new Error('User exist')
    }
    const user = new User({
      email,
      password,
      cart : {items : []}
    })
    await user.save()
    res.redirect('/login')
  }catch(e){
    res.redirect('/signup')
  }
}