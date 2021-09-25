# e-shop

**Used Tech Stack** 
* Express
* Mongoose
* HTML/CSS
* JavaScrippt
* HBS Templating Engine

**Highlights**
* MVC Architecture
* User Authentication / Authorisation based Access
* Password Reset through verification Email
* Add User
* Add Product
* Remove Products

**Mongoose Model**
- User
- Products
- Orders

## User Model Design

| User Model | 
| --- |
| ***Name*** : Required <br/> ***Email*** : Required ,Validators <br> ***Password*** : Required,Encryption,Length Constraints <br> ***Cart*** : Ref->Product / Array of Object|
| addToCart(Product) <br> deleteFromCart(Product) <br> clearCart() <br> FindUser()|

## Product Model Design

| Product Model | 
| --- |
| ***Title*** : Given Name of Product <br/> ***Descryption*** : Complete Description <br> ***Price*** : Cost of Product <br> ***ImageUrl*** : Url of Image Location <br> ***UserId*** : User who added it|

## Order Model Design

| Order Model | 
| --- |
| ***User*** : Ref Field -> User Model <br/> ***Products*** : Ref->Product Model Array of Object|

