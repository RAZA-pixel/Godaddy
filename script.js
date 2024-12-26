// Mock data for domain extensions and their prices
const domainExtensions = [
    { extension: '.com', price: 12.99 },
    { extension: '.net', price: 11.99 },
    { extension: '.org', price: 13.99 },
    { extension: '.io', price: 39.99 },
    { extension: '.co', price: 24.99 }
];

// Cart state management
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateUI();
    }

    addItem(item) {
        if (!this.cart.some(cartItem => cartItem.domain === item.domain)) {
            this.cart.push(item);
            this.saveCart();
            this.updateUI();
            return true;
        }
        return false;
    }

    removeItem(domain) {
        this.cart = this.cart.filter(item => item.domain !== domain);
        this.saveCart();
        this.updateUI();
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateUI();
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + item.price, 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateUI() {
        // Update cart count
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.cart.length;
        }

        // Update cart items if on cart page
        const cartItems = document.getElementById('cart-items');
        if (cartItems) {
            if (this.cart.length === 0) {
                document.getElementById('empty-cart').style.display = 'block';
                document.querySelector('.cart-container').style.display = 'none';
            } else {
                document.getElementById('empty-cart').style.display = 'none';
                document.querySelector('.cart-container').style.display = 'grid';
                
                cartItems.innerHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <span>${item.domain}</span>
                        <span>$${item.price.toFixed(2)}</span>
                        <button onclick="cartManager.removeItem('${item.domain}')" class="remove-btn">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                `).join('');

                // Update summary
                const subtotal = this.getTotal();
                const tax = subtotal * 0.1; // 10% tax
                const total = subtotal + tax;

                document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
                document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
                document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
            }
        }
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Domain search functionality
function searchDomains() {
    const searchTerm = document.getElementById('domain-search')?.value.trim().toLowerCase();
    const searchResults = document.getElementById('search-results');
    
    if (!searchTerm || !searchResults) return;

    // Clear previous results
    searchResults.innerHTML = '';

    // Remove any existing extensions from the search term
    const cleanSearchTerm = searchTerm.replace(/\.[a-z]+$/, '');

    // Generate results for each domain extension
    domainExtensions.forEach(({ extension, price }) => {
        const domain = cleanSearchTerm + extension;
        const isAvailable = Math.random() > 0.3; // Randomly determine availability

        const resultDiv = document.createElement('div');
        resultDiv.className = 'domain-result';
        
        resultDiv.innerHTML = `
            <div class="domain-name">${domain}</div>
            <div class="domain-price">$${price}</div>
            ${isAvailable ? 
                `<button class="add-to-cart-btn" onclick="addDomainToCart('${domain}', ${price})">
                    Add to Cart
                </button>` : 
                '<span style="color: red;">Not Available</span>'
            }
        `;

        searchResults.appendChild(resultDiv);
    });
}

// Add domain to cart
function addDomainToCart(domain, price) {
    if (cartManager.addItem({ domain, price })) {
        showNotification('Domain added to cart!');
    } else {
        showNotification('Domain is already in cart!', 'error');
    }
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Search functionality
    const searchBtn = document.getElementById('search-btn');
    const domainSearch = document.getElementById('domain-search');

    if (searchBtn) {
        searchBtn.addEventListener('click', searchDomains);
    }

    if (domainSearch) {
        domainSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchDomains();
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            showNotification('This is a demo project. Checkout is not implemented.', 'info');
        });
    }

    // Plan selection buttons
    const planButtons = document.querySelectorAll('.select-plan-btn, .hosting-btn');
    planButtons.forEach(button => {
        button.addEventListener('click', () => {
            showNotification('This is a demo project. Plan selection is not implemented.', 'info');
        });
    });
});

// Add styles for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 4px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }

    .notification.success {
        background-color: #4caf50;
    }

    .notification.error {
        background-color: #f44336;
    }

    .notification.info {
        background-color: #2196f3;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .remove-btn {
        background: none;
        border: none;
        color: #ff4449;
        cursor: pointer;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .remove-btn:hover {
        color: #ff1a1a;
    }
`;

document.head.appendChild(style); 