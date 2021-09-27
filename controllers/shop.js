const Product = require('../models/product');
const Order = require('../models/order');
const product = require('../models/product');
const order = require('../models/order');
const page_limit = 4;
exports.getProducts = async (req, res, next) => {
    const page = +req.query.page || 1
    try{
      const count = await Product.countDocuments()
      let temp_prod = await Product.find().skip((page-1)*page_limit).limit(page_limit)
      let products = []
      for(let prod of temp_prod){
        prod.isLoggedIn = req.session.isLoggedIn
        products.push(prod)
      }
      res.render('shop/product-list',{
        products,
        pageTitle:'Shop',
        shop : true,
        isLoggedIn:req.session.isLoggedIn,
        page,
        nextPage : page+1,
        prevPage : page-1,
        lastPage :Math.ceil(count/page_limit),
        printFirst:page !== 1 && page !==2,
        hasNext : page_limit*page < count,
        hasPrev : page > 1,
        printLast : Math.ceil(count/page_limit) !== page+1 && Math.ceil(count/page_limit) !== page,
      })
    }
    catch(e){
      console.log('from product list',e)
    }
};
exports.getProduct = async (req,res)=>{
  // console.log('called')
  const id = req.params.productId;
  try{
    const product = await Product.findById(id)
    // res.render('shop/product-details',{
      res.render('shop/view-details',{
      product,
      pageTitle:'Product Details',
      isLoggedIn:req.session.isLoggedIn,
      product_details : true,
      shop : true
    })
  }catch(e){
    console.log(e)
  }
}
exports.getCart = async (req,res) =>{
  try{
    const user_data = await req.user.populate('cart.items.productId').execPopulate()
    let cartData = []
    for(let product of user_data.cart.items)
    cartData.push({
      product:product.productId,
      quantity:product.quantity,
    })
    res.render('shop/cart',{
      pageTitle:'Cart',
      cartData,
      cart:true,
      empty:cartData.length <= 0,
      isLoggedIn:req.session.isLoggedIn,
    })
  }catch(e){
    console.log(e)
  }
}
exports.postCart = async (req,res)=>{
  const productId = req.body.productId;
  try{
    const product = await Product.findById(productId)
    await req.user.addToCart(product)
    res.redirect('/cart')
  }catch(e){
    console.log('Error from Moving to Cart',e)
  }
}
exports.getOrders = async (req,res) =>{
  try{
    const orders = await Order.find({'user.userId' : req.user._id}).populate()
    res.render('shop/orders',{
      pageTitle:'Your Order',
      orders,
      order:true,
      empty:orders.length <= 0,
      isLoggedIn:req.session.isLoggedIn,
    })
  }catch(e){
    console.log('Error from Orders',e)
  }
}
exports.postOrder = async (req,res) =>{
  try{
    const user_data = await req.user.populate('cart.items.productId').execPopulate()
    const user = {name:req.user.name,userId:req.user._id}
    const products = user_data.cart.items.map(i=>{
      return {quantity:i.quantity,product:{...i.productId._doc}}
    })
    if(products.length == 0) return res.redirect('/cart')
    const order = new Order({user,products})
    await order.save()
    req.user.clearCart()
    res.redirect('/orders')
  }catch(e){
    console.log('Error from saving order',e)
  }
}
exports.getIndex = async (req,res) =>{
  const page = +req.query.page || 1
  try{
    const count = await Product.countDocuments()
    let temp_prod = await Product.find().skip((page-1)*page_limit).limit(page_limit)
    let products = []
    for(let prod of temp_prod){
      prod.isLoggedIn = req.session.isLoggedIn
      products.push(prod)
    }
    res.render('shop/index',{
      products,
      pageTitle:'Shop',
      index : true,
      isLoggedIn:req.session.isLoggedIn,
      page,
      nextPage : page+1,
      prevPage : page-1,
      lastPage :Math.ceil(count/page_limit),
      printFirst:page !== 1 && page !==2,
      hasNext : page_limit*page < count,
      hasPrev : page > 1,
      printLast : Math.ceil(count/page_limit) !== page+1 && Math.ceil(count/page_limit) !== page,
    })
  }
  catch(e){
    console.log('from index list',e)
  }
}

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
