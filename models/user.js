const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        default:'Salman'
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
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
    else updatedCartItem.filter(prod=>prod._id.toString() !== product._id.toString())
    this.cart = {items:updatedCartItem}
    return this.save()
}

userSchema.methods.clearCart = function(){
    this.cart = {items : []}
    return this.save()
}
module.exports = mongoose.model('User',userSchema)