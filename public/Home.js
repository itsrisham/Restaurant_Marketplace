let loader = document.querySelector(".loadPage");
let container = document.querySelector(".container");
let cards = document.querySelectorAll(".card");


//  loading effect
container.style.display="none";

  setInterval(function(){
     container.style.display="block";
    
        loader.style.display="none"
     },2000)

let products=[
  {
      "id":1,
      "name":"veg burger",
      "price":50,
      "image":"fd1.jpg"
  },
  {
      "id":2,
      "name":"family pack",
      "price":100,
      "image":"fd2.jpg"
  },
  {
      "id":3,
      "name":"onions,jalapenos and tomato pizza",
      "price":200,
      "image":"fd3.jpg"
  },
  {
      "id":4,
      "name":"tomato pizza",
      "price":150,
      "image":"fd4.jpg"
  },
  {
      "id":5,
      "name":"chocolate desert",
      "price":100,
      "image":"fd5.jpg"
  },
  {
      "id":6,
      "name":"Vanilla Shake with Chocolate dots",
      "price":80,
      "image":"fd6.jpg"
  }
]
// Assuming this variable tracks the login state, set it to true when the user is logged in
let listProducts=[];
let carts=[];
let listCartHTML=document.querySelector('.ListCart');
let iconCart=document.querySelector('.fa-bag-shopping');
let closeCart=document.querySelector('.close');
let body=document.querySelector('body')
let listProductHTML=document.querySelector('.foodCard')
let iconCartSpan=document.querySelector('.fa-bag-shopping span')
listProducts = products;

iconCart.addEventListener('click',()=>{
  body.classList.toggle('showCart')
})

closeCart.addEventListener('click',()=>{
  body.classList.toggle('showCart')
})
// At the beginning or end of your main script file

const addToCart=(product_id)=>{
  // console.log("Product ID added to cart:", product_id);
  let positionThisProductInCart=carts.findIndex((value)=>value.product_id==product_id)
  if(carts.length<=0){
    carts.push({
      product_id:product_id,
      quantity:1
    })
  }else if(positionThisProductInCart<0){
    carts.push({
      product_id:product_id,
      quantity:1
    })
  }else{
    carts[positionThisProductInCart].quantity=carts[positionThisProductInCart].quantity+1;
  }
  addCartToHTML();
  addCartToMemory();
  console.log(carts);
}

listProductHTML.addEventListener('click',(event)=>{
  let postionClick=event.target;
  if(postionClick.classList.contains('add')){
    let product_id=postionClick.parentElement.dataset.id;
    addToCart(product_id);
  }
})



const addCartToMemory=()=>{
  localStorage.setItem('cart',JSON.stringify(carts));
}


const addCartToHTML = () => {
  listCartHTML.innerHTML = '';
  let totalQuantity = 0;
  if (carts.length > 0) {
    carts.forEach(cart => {
      totalQuantity += cart.quantity;
      let newCart = document.createElement('div');
      newCart.classList.add('item');
      newCart.dataset.id = cart.product_id;

      // Find the index of the product in the listProducts array
      let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);

      // Check if the product exists in listProducts
        let info = listProducts[positionProduct];
        newCart.innerHTML = `
          <div class="image">
            <img src="${info.image}" alt="">
          </div>
          <div class="name">
            ${info.name}
          </div>
          <div class="totalPrice">
            $${info.price*cart.quantity}
          </div>
          <div class="quantity">
            <span class="minus"><</span>
            <span>${cart.quantity}</span>
            <span class="plus">></span>
          </div>
        `;
        listCartHTML.append(newCart);
    });
  }
  iconCartSpan.innerText = totalQuantity;
};
listCartHTML.addEventListener('click', (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
    let productId = positionClick.parentElement.parentElement.dataset.id;
    let type = 'minus';
    if (positionClick.classList.contains('plus')) {
      type = 'plus';
    }
    changeQuantity(productId, type);
  }
});

const changeQuantity = (productId, type) => {
  let positionItemInCart = carts.findIndex((value) => value.product_id == productId);
  if (positionItemInCart >= 0) {
    switch (type) {
      case 'plus':
        carts[positionItemInCart].quantity += 1; // Increase quantity
        break;
      case 'minus':
        if (carts[positionItemInCart].quantity > 1) {
          carts[positionItemInCart].quantity -= 1; // Decrease quantity if greater than 1
        } else {
          carts.splice(positionItemInCart, 1); // Remove item if quantity is 1
        }
        break;
      default:
        break;
    }
  }
  addCartToMemory();
  addCartToHTML();
};


const initApp=()=>{
  // listProducts=products;
  // get cart from memory
  if(localStorage.getItem('cart')){
    carts = JSON.parse(localStorage.getItem('cart'));
    addCartToHTML();
  }
}

initApp();
// Add this line at the end of Home.js
// Add this function to Home.js
// export function calculateTotalAmount() {
//   // Calculate total amount based on the cart data
//   const totalAmount = cart.reduce((total, item) => total + item.price, 0);
//   return totalAmount;
// }


