const sendGrid = require('@sendgrid/mail')
require('dotenv').config()
sendGrid.setApiKey(process.env.SENDGRID_API)


const sendWelcomeMail = (email,name)=>{
  sendGrid.send({
    to:email,
    from:process.env.SENDGRID_FROM_EMAIL='salman.ansari776@gmail.com',
    subject:'Thanks for checking in',
    text:`Welcome to the application,${name} let me know can I help`
  })
}

const sendLoginMail = (email,name)=>{
  sendGrid.send({
    to:email,
    from:process.env.SENDGRID_FROM_EMAIL='salman.ansari776@gmail.com',
    subject:'Account Login',
    text:`Hey ${name} you just logged in our System`
  })
}

const sendResetPasswordLink = (email,name,token) =>{
  sendGrid.send({
    to:email,
    from:process.env.SENDGRID_FROM_EMAIL='salman.ansari776@gmail.com',
    subject:'Password Reset',
    text:`Hey ${name} We just receieved password reset request for your account please confirm by clicking the link or ignore if you this is not you`,
    html:`<p1>${process.env.LOCAL_HOST+'/reset/'+token}</p1>`
  })
}

module.exports ={
  sendWelcomeMail,
  sendLoginMail,
  sendResetPasswordLink
}