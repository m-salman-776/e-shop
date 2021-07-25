const { json } = require('body-parser')
const fs = require('fs')
const path = require('path')
const p = path.join(__dirname,'..','data','cart.json')
module.exports = class Cart{
    static addProduct(id,productPrice){
        fs.readFile(p,(err,fileContent)=>{
            let cart = {products:[],totalPrice:0}
            if(!err){
                cart = JSON.parse(fileContent);
            }
            const existingIndex = cart.products.findIndex((prod) =>{
                return prod.id === id;
            })
            const existingProduct = cart.products[existingIndex]
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct} // there can many more field thou we require only qty only
                updatedProduct.qty += 1;
                cart.products = [... cart.products]
                cart.products[existingIndex] = updatedProduct
            }
            else {
                updatedProduct = {id : id , qty : 1};
                cart.products = [...cart.products,updatedProduct]
            }
            cart.totalPrice += +productPrice
            fs.writeFile(p,JSON.stringify(cart),(e)=>{
                if(e)
                console.log(e,'something went wrong');
            })
        })
    }
    static deleteProduct(id,price){
        fs.readFile(p,(err,fileContent)=>{
            if(err){
                return;
            }
            let updatedCart = {... JSON.parse(fileContent)}
            // console.log('upcat->',updatedCart)
            const deleteIdx = updatedCart.products.findIndex(prod => prod.id === id)
            // console.log(deleteIdx)
            if(deleteIdx < 0) {
                return
            }
            const totalPrice = updatedCart.totalPrice - updatedCart.products[deleteIdx].qty * price
            const products = updatedCart.products.filter(prod=> prod.id !== id)
            updatedCart = {products,totalPrice}
            fs.writeFile(p,JSON.stringify(updatedCart),(err)=>{
                if(err) console.log(err)
            })
        })
    }
    static getCart(cb){
        fs.readFile(p,(err,fileContent)=>{
            const cart = JSON.parse(fileContent)
            if(err) return cb(null)
            cb(cart)
        })
    }
}