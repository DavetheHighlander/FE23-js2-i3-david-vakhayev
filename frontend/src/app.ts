// Import necessary modules and functions
import { getProducts } from './modules/get.products';
import { searchProducts } from './modules/search.products';

// Define the Product interface
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// Function to render products
async function renderProducts(searchTerm?: string): Promise<void> {
  const productListElement = document.getElementById('product-list')!;

  // Fetch products based on search term if provided, otherwise fetch all products
  let products: any;

  if (searchTerm) {
    products = await searchProducts(searchTerm);
  } else {
    products = await getProducts();
  }

  // Clear existing products
  productListElement.innerHTML = '';

  // Render each product
  products['products'].forEach((product) => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    // For the image source, use the first image from the images array
    const imageUrl = product.images[0];

    productCard.innerHTML = `
      <img src="${imageUrl}" alt="${product.title}">
      <h2>${product.title}</h2>
      <p>${product.description}</p>
      <p>Rating: ${product.rating}</p>
      <p>Stock: ${product.stock} ${product.stock < 10 ? '(Low Stock)' : ''}</p>
      <p>Category: ${product.category}</p>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;

    productListElement.appendChild(productCard);
  });

  // Attach event listeners to Add to Cart buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', addToCartHandler);
  });
}

// Function to handle click on Add to Cart button
async function addToCartHandler(event: Event): Promise<void> {
  const button = event.target as HTMLButtonElement;
  const productId = button.dataset.id;

  if (productId) {
    // Fetch product details based on productId and add it to the cart
    const product = await getProductById(parseInt(productId));
    if (product) {
      addToCart(product);
      // Notify user that the product has been added to the cart
      alert('Product added to cart!');
      updateCartBadge();
    } else {
      console.error('Product not found!');
    }
  }
}

// Function to fetch product details by id (replace this with your actual logic)
async function getProductById(productId: number): Promise<Product | undefined> {
  // Example implementation: Fetch product details from API using productId
  // You need to replace this with your actual logic
  // For demonstration purpose, I'm just returning a dummy product


  console.log(productId);
  const productData = await getProducts();
  console.log(productData);

  return productData['products'].find((product: Product) => product.id === productId);
  

  
}
// Function to add product to the cart
function addToCart(product: Product): void {
  let cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');

  // Check if the product is already in the cart
  const existingProductIndex = cart.findIndex(item => item.id === product.id);

  if (existingProductIndex !== -1) {
    // If the product is already in the cart, update its quantity
    cart[existingProductIndex]['quantity'] += 1; // Assuming you have a 'quantity' property in your Product interface
  } else {
    // If the product is not in the cart, add it
    product['quantity'] = 1; // Set the initial quantity to 1
    cart.push(product);
  }

  // Update the cart in local storage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Update the cart badge
  updateCartBadge();
}
// Function to update cart badge
function updateCartBadge(): void {
  const cartItemCountElement = document.getElementById('cartItemCount');
  if (cartItemCountElement) {
    const cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
    cartItemCountElement.textContent = cart.length.toString();
  }
}
let productData: any;


// Function to display cart contents
// Function to display cart contents
function displayCartContents(): void {
  const cartModal = document.getElementById('cartModal')!;
  const cartItemsElement = document.getElementById('cartItems')!;
  const cartCheckoutButton = document.getElementById('cartCheckoutButton')!;

  // Clear existing cart items
  cartItemsElement.innerHTML = '';

  // Fetch cart items from local storage
  const cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');

  // Render each cart item
  cart.forEach((product) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    // Product image
    const productImage = document.createElement('img');
    productImage.src = product.thumbnail;
    productImage.alt = product.title;

    // Product details
    const cartItemDetails = document.createElement('div');
    cartItemDetails.classList.add('cart-item-details');

    const productTitle = document.createElement('h3');
    productTitle.textContent = product.title;

    const productDescription = document.createElement('p');
    productDescription.textContent = product.description;

    // Quantity input
    const countLabel = document.createElement('label');
    countLabel.textContent = 'Quantity: ';

    const countInput = document.createElement('input');
    countInput.type = 'number';
    countInput.value = product.quantity.toString(); // Set initial value from local storage
    countInput.min = '1';

    // Update quantity and price when quantity changes
    countInput.addEventListener('change', (event) => {
      const newQuantity = parseInt((event.target as HTMLInputElement).value);
      updateQuantityAndPrice(product.id, newQuantity);
    });

    // Price
    const productPrice = document.createElement('p');
    productPrice.textContent = `Price: ${product.price * product.quantity}`;

    cartItemDetails.appendChild(productTitle);
    cartItemDetails.appendChild(productDescription);
    cartItemDetails.appendChild(countLabel);
    cartItemDetails.appendChild(countInput);
    cartItemDetails.appendChild(productPrice);

    // Remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      removeCartItem(product.id);
      displayCartContents(); // Refresh cart display after removal
      updateCartBadge();
    });

    // Add elements to cart item
    cartItem.appendChild(productImage);
    cartItem.appendChild(cartItemDetails);
    cartItem.appendChild(removeButton);

    cartItemsElement.appendChild(cartItem);
  });

  // Checkout button
  if (cart.length > 0) {
    cartCheckoutButton.style.display = 'block';
  } else {
    cartCheckoutButton.style.display = 'none';
  }
}

// Function to update quantity and price in local storage and DOM
function updateQuantityAndPrice(productId: number, newQuantity: number): void {
  let cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
  const productIndex = cart.findIndex((product) => product.id === productId);

  if (productIndex !== -1) {
    cart[productIndex]['quantity'] = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update displayed price
    displayCartContents();


    // Update cart badge
    updateCartBadge();
  }
}



// Function to remove item from cart
function removeCartItem(productId: number): void {
  let cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
  cart = cart.filter((product) => product.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
}




// Call renderProducts to display product cards when the page loads
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartBadge();

  // Open modal when cart button is clicked
  const cartButton = document.getElementById('cartButton') as HTMLButtonElement;
  const cartModal = document.getElementById('cartModal') as HTMLElement;

  cartButton.addEventListener('click', () => {
    cartModal.style.display = 'block';
    displayCartContents(); // Call function to display cart contents when modal is opened
  });

  // Close modal when close button is clicked
  const closeModalButton = document.querySelector('.close') as HTMLElement;
  closeModalButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });
  // Your other initialization code here
});

// Search functionality
const searchForm = document.getElementById('search-form') as HTMLFormElement;
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(searchForm);
  const searchTerm = formData.get('search') as string;
  renderProducts(searchTerm);
});
