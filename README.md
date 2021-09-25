# e-shop [https://salman-e-shop.herokuapp.com/](https://salman-e-shop.herokuapp.com/)
images used will not be render as no storage location is configured <br>
**Used Tech Stack** 
* Express
* Mongoose
* HTML/CSS
* JavaScrippt
* HBS Templating Engine
* bcrypt for password encryption/decryption

**Highlights**
* MVC Architecture
* Authentication / Authorisation based Access
* Password Reset through verification Email
* Multer image upload
* Sessions
* Async/Await call

**Mongoose Model**
- User
- Products
- Orders


**Database**
- MongoDB Free Tier for text based
- Storage Location for Image yet to be configured

## User Model Design

| User Model | 
| --- |
| ***Name*** : Required <br/> ***Email*** : Required ,Validators <br> ***Password*** : Required,Encryption,Length Constraints <br> ***resetPasswordToken*** : User password reset <br> ***Cart*** : Ref->Product / Array of Object|
| addToCart(Product) <br> deleteFromCart(Product) <br> clearCart() <br> FindUser()|

## Product Model Design

| Product Model | 
| --- |
| ***Title*** : Given Name of Product <br/> ***Descryption*** : Complete Description <br> ***Price*** : Cost of Product <br> ***ImageUrl*** : Url of Image Location <br> ***UserId*** : User who added it|

## Order Model Design

| Order Model | 
| --- |
| ***User*** : Ref Field -> User Model <br/> ***Products*** : Ref->Product Model Array of Object|

