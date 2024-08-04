// Product class
class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

// ShoppingCartItem class
class ShoppingCartItem {
  constructor(product, quantity = 0) {
    this.product = product;
    this.quantity = quantity;
  }

  // Method to calculate the total price for the item
  getTotalPrice() {
    return this.product.price * this.quantity;
  }

  // Increase the quantity of the product
  increaseQuantity() {
    this.quantity += 1;
  }

  // Decrease the quantity of the product
  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity -= 1;
    }
  }
}

// ShoppingCart class
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  // Method to get the total number of items in the cart
  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Method to add an item to the cart
  addItem(product) {
    const existingItem = this.items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.increaseQuantity();
    } else {
      this.items.push(new ShoppingCartItem(product, 1));
    }
    this.updateTotalPrice();
    this.displayCartItems(); // Update display whenever an item is added
  }

  // Method to remove an item from the cart
  removeItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.updateTotalPrice();
    this.displayCartItems(); // Update display whenever an item is removed
  }

  // Method to update the total price displayed
  updateTotalPrice() {
    const totalPrice = this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
    document.getElementById('total').textContent = `$ ${totalPrice.toFixed(2)}`;
  }

  // Display the cart items (updates DOM)
  displayCartItems() {
    const listProducts = document.querySelector('.list-products');
    //This is where the problem is
    listProducts.innerHTML = ''; // Clear existing products

    this.items.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('card-body');
      card.innerHTML = `
        <div class="card" style="width: 18rem">
          <img src="/assets/${item.product.name.toLowerCase()}.png" class="card-img-top" alt="${item.product.name}" />
          <div class="card-body">
            <h5 class="card-title">${item.product.name}</h5>
            <p class="card-text">This is a ${item.product.name}</p>
            <h4 class="unit-price">${item.product.price} $</h4>
            <div>
              <i class="fas fa-plus-circle" data-id="${item.product.id}"></i>
              <span class="quantity">${item.quantity}</span>
              <i class="fas fa-minus-circle" data-id="${item.product.id}"></i>
            </div>
            <div>
              <i class="fas fa-trash-alt" data-id="${item.product.id}"></i>
              <i class="fas fa-heart"></i>
            </div>
          </div>
        </div>
      `;
      listProducts.appendChild(card);
    });

    this.addEventListeners();
  }

  // Add event listeners to the cart items
  addEventListeners() {
    const plusButtons = document.querySelectorAll('.fas.fa-plus-circle');
    const minusButtons = document.querySelectorAll('.fas.fa-minus-circle');
    const trashIcons = document.querySelectorAll('.fas.fa-trash-alt');
    const heartIcons = document.querySelectorAll('.fas.fa-heart');

    plusButtons.forEach(button => {
      button.addEventListener('click', () => {
        const productId = parseInt(button.dataset.id);
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
          item.increaseQuantity();
          this.displayCartItems();
        }
      });
    });

    minusButtons.forEach(button => {
      button.addEventListener('click', () => {
        const productId = parseInt(button.dataset.id);
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
          item.decreaseQuantity();
          this.displayCartItems();
        }
      });
    });

    trashIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        const productId = parseInt(icon.dataset.id);
        this.removeItem(productId);
      });
    });

    heartIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        icon.classList.toggle('text-danger'); // Toggle heart icon color
      });
    });
  }
}

// Initial setup
document.addEventListener('DOMContentLoaded', function () {
  const cart = new ShoppingCart();

  // Create product instances
  const products = [
    new Product(1, 'Baskets', 100),
    new Product(2, 'Socks', 20),
    new Product(3, 'Bag', 50),
  ];

  // Add event listeners to add buttons for each product
  document.querySelectorAll('.card-body .fas.fa-plus-circle').forEach((button, index) => {
    button.addEventListener('click', () => {
      cart.addItem(products[index]);
    });
  });

  cart.displayCartItems(); // Initial display of cart items
});
