const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        validate(email){
            if(!validator.isEmail(email)) throw new Error('Invalid email')
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength : 3
    },
    pp : {
        type : String
    },
    resetPasswordToken:{
        token:String,
        expirationTime:Date
    },
    imageUrl :{
        type : String,
    },
    cart:{
        items:[{
            productId:{type:Schema.Types.ObjectId,required:true,ref:'Product'},
            quantity:{type:Number, required:true}
        }]
    }
})

userSchema.methods.addToCart = function(product){
    const existIdx = this.cart.items.findIndex(prod => {
        return prod.productId.toString() === product._id.toString()
    })
    let updatedCartItem = [...this.cart.items]
    if(existIdx>=0){
        updatedCartItem[existIdx].quantity += 1;
    }
    else {
        updatedCartItem.push({productId:product._id,quantity:1});
    }
    const updatedCart = {items : updatedCartItem}
    this.cart = updatedCart
    return this.save()
}
userSchema.methods.deleteFromCart = function(product){
    const index = this.cart.items.findIndex((prod)=>{
        return prod.productId.toString() === product._id.toString()
    })
    let updatedCartItem = [...this.cart.items]
    if(updatedCartItem[index].quantity > 1)
    updatedCartItem[index].quantity -= 1;
    else updatedCartItem=updatedCartItem.filter(prod=>prod.productId.toString() !== product._id.toString())
    this.cart = {items:updatedCartItem}
    return this.save()
}

userSchema.methods.clearCart = function(){
    this.cart = {items : []}
    return this.save()
}

userSchema.pre('save', async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,8)
    }
    next()
})
userSchema.statics.findUser = async (email,password,req) =>{
    const user = await User.findOne({email})
    if(!user) {
      req.flash('error','Invalid email or password')
      return 
    }
    const match = await bcrypt.compare(password,user.password)
    if(!match) {
        req.flash('error','Invalid email or password')
      return 
    }
    return user
}
const User = mongoose.model('User',userSchema)
module.exports = User