const User = require('../models/user')
const crypto = require('crypto')
const {sendWelcomeMail,sendLoginMail,sendResetPasswordLink}=require('../utility/mailSender')
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
    sendLoginMail(email,user.name)
    res.redirect('/products')
  }
  catch(e){
    console.log(e)
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
  }
  catch(e){
    res.redirect('/signup')
  }
}

exports.getResetPassword = (req,res,next)=>{
  let message = req.flash('error')
  message = message.length > 0 ? message[0] : null
  res.render('auth/reset-password',{
    pageTitle:'Password Reset',
    errorMessage:message
  })
}

exports.postResetPassword = async (req,res,next) =>{
  try{
    const email = req.body.email
    const user = await User.findOne({email})
    if(!user) {
      req.flash('error','No such user in System')
      return res.redirect('/reset')
    }
    const token = await crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = {token,expirationTime:Date.now() + 3600000}
    await user.save()
    res.redirect('/')
    sendResetPasswordLink(req.body.email,user.name,token)
  }
  catch(e){
    console.log(e)
  }
}

exports.changepassword = (req,res,next)=>{
  let message = req.flash('error')
  message = message.length > 0 ? message[0] : null
  res.render('auth/new-password',{
    pageTitle:'Password Reset',
    errorMessage:message,
    token:req.params.token
  })
}

exports.setPassword = async (req,res,next)=>{
  const token = req.body.token
  const password = req.body.password
  try{
    const user = await User.findOne({'resetPasswordToken.token':token})
    if(!user || Date.now() > user.resetPasswordToken.expirationTime){
      req.flash('error','Invalid token or User')
      return res.redirect('/reset')
    }
    user.password = password
    user.resetPasswordToken=null
    await user.save()
    res.redirect('/')
  }
  catch(e){
    console.log(e)
  }
}
