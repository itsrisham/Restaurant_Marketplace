// Retrieve the cart data from localStorage
const carts = JSON.parse(localStorage.getItem('cart')) || [];
const listProducts = [
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
];

// Calculate the total amount from the cart data
const calculateTotalAmount = () => {
  let totalAmount = 0;

  carts.forEach(cartItem => {
    const product = listProducts.find(p => p.id == cartItem.product_id);
    if (product) {
      totalAmount += product.price * cartItem.quantity;
    }
  });

  return totalAmount;
}

// Call the function to get the total amount
const totalAmount = calculateTotalAmount();
console.log('Total Amount:', totalAmount);

// Example usage in a button click event (assuming you have a confirm button with id 'confirm-btn')
document.getElementById('confirm-btn').addEventListener('click', function() {
  // Get the selected delivery option
  const selectedOption = document.getElementById('delivery-option').value;

  // Calculate delivery cost
  const deliveryCost = selectedOption === 'standard' ? 5 : 10;

  // Calculate total amount including delivery
  const totalPrice = totalAmount + deliveryCost;

  // Display the selected delivery option and total amount
  document.getElementById('result').innerHTML = `
    Selected Delivery Option: ${selectedOption} <br>
    Total Amount: $${totalPrice.toFixed(2)}
  `;
});
