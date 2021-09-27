const product = require('../models/product');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    addProduct:true,
    isLoggedIn:req.session.isLoggedIn,
  });
}; 

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title
  const image = req.file
  const description = req.body.description
  const price = req.body.price
  const userId = req.user._id
  const imageUrl = image.path
  const product = new Product({title,imageUrl,description,price,userId})
  try{
    await product.save()
    res.redirect('/admin/products')
  }catch(e){
    res.render('admin/error-page',{
      pageTitle:'Image Upload Store',
      error: e ? e : 'If you not seeing any error'
    })
  }
}; 
exports.getProducts = async (req,res) =>{
  try{
    // const products = await Product.find({userId : req.user._id.toString()}).populate('userId')
    const products = await Product.find({userId : req.user._id.toString()})
    res.render('admin/products',{
      products,
      pageTitle:'Admin Product',
      isLoggedIn:req.session.isLoggedIn,
      adminProducts:true
    })
  }catch(e){
    console.log('Error from Admin Products',e);
  }
}

exports.getEditProduct = async (req, res, next) => {
  const mode = req.query.edit;
  if(!mode) {
    return redirect('/')
  }
  const productId = req.params.productId;
  try{
    const product = await Product.findById(productId)
    if(!product) return res.redirect('/admin/products')
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/add-product',
      prod:product,
      isLoggedIn:req.session.isLoggedIn
    });
  } catch(e){
    console.log('Error from Edit Product',e)
  }
};
exports.postEditProduct = async (req,res,next) =>{
  const id = req.body.productId
  const title = req.body.title
  const image = req.file
  const description = req.body.description
  const price = req.body.price
  try{
    let product = await Product.findById(id)
    product.title = title;
    product.description = description,
    product.price = price
    product.imageUrl=image ? image.path : product.imageUrl
    await product.save()
    res.redirect('/admin/products')
  }catch(e){
    console.log('Error from Updating product',e)
    res.redirect('/admin/products')
  }
}

exports.getdeleteProduct = async (req,res,next) =>{
  const id = req.params.productId;
  try{
    await Product.findByIdAndDelete(id)//user id can be included to add extra check to avoid other user product
    res.redirect('/admin/products')
  }catch(e){
    console.log('Error from Deleting Product',e);
    res.redirect('/admin/products')
  }
}