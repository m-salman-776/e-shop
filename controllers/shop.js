const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const product = require('../models/product');
const order = require('../models/order');
exports.getProducts = async (req, res, next) => {
    try{
      const products = await Product.find();
      res.render('shop/product-list',{
        products,
        pageTitle:'Shop',
        isLoggedIn:req.session.isLoggedIn
      })
    }
    catch(e){
      console.log('from product list')
    }
};
exports.getProduct = async (req,res)=>{
  const id = req.params.productId;
  try{
    const product = await Product.findById(id)
    res.render('shop/product-details',{
      product,
      pageTitle:'Product Details',
      isLoggedIn:req.session.isLoggedIn
    })
  }catch(e){
    console.log(e)
  }
}
exports.getCart = async (req,res) =>{
  try{
    const user = await req.user.populate('cart.items.productId').execPopulate()
    let cartData = []
    for(let product of user.cart.items)
    cartData.push({
      product:product.productId,
      quantity:product.quantity,
    })
    res.render('shop/cart',{
      pageTitle:'Cart',
      cartData,
      empty:cartData.length <= 0,
      isLoggedIn:req.session.isLoggedIn
    })
  }catch(e){
    console.log(e)
  }
}
exports.postCart = (req,res)=>{
  const productId = req.body.productId;
  Product.findById(productId)
  .then(product=>{
    req.user.addToCart(product)
    .then(()=>{
    res.redirect('/cart')
    })
  })
  .catch(e=>{
    console.log(e)
  })
}
exports.getOrders = (req,res) =>{
    Order.find({"user.userId" : req.user._id})
    .populate()
    .then(orders=>{
      res.render('shop/orders',{
        pageTitle:'Your Order',
        path:'/cart',
        orders,
        empty:orders.length <= 0,
        isLoggedIn:req.session.isLoggedIn
      })
    })
    .catch(e=>{
      console.log(e)
    })
}
exports.postOrder = (req,res) =>{
  req.user
  .populate('cart.items.productId')
  .execPopulate()
  .then(user_data=>{
    const user = {name:req.user.name,userId:req.user._id}
    const products = user_data.cart.items.map(i=>{
      return {quantity:i.quantity,product:{...i.productId._doc}}
    })
    const order = new Order({user,products})
    order.save()
    .then(()=>{
      return req.user.clearCart()
    })
    .then(()=>{
      res.redirect('/orders')
    })
  }).catch(e=>{
    console.log(e)
  })
}
// exports.getCheckout = (req,res) =>{
//   res.render('shop/orders',{
//       pageTitle:'Your Cart',
//       path:'/cart'
//   })
// }

exports.postCartDeleteItem = (req,res) =>{
  const id = req.body.productId
  Product.findById(id)
  .then(product=>{
    req.user.deleteFromCart(product)
    .then(()=>{
      res.redirect('/cart')
    })
  }).catch(e=>{
    console.log(e)
  })
}
