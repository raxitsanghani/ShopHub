document.addEventListener('DOMContentLoaded', function() {
    // Initialize the orders page
    initializeOrdersPage();
    
    // Add event listeners
    addEventListeners();
});

// Initialize the orders page
function initializeOrdersPage() {
    // Load user data and preferences
    loadUserData();
    
    // Set default tab
    switchOrderTab('orders');
}

// Add event listeners
function addEventListeners() {
    // Logo click functionality
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }
    
    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Order search functionality
    const orderSearchBtn = document.querySelector('.search-orders-btn');
    const orderSearchInput = document.querySelector('.order-search-input');
    
    if (orderSearchBtn && orderSearchInput) {
        orderSearchBtn.addEventListener('click', function() {
            searchOrders();
        });
        
        orderSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchOrders();
            }
        });
    }
    
    // Time filter change
    const timeFilter = document.querySelector('.time-filter');
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            handleTimeFilterChange(this.value);
        });
    }
    
    // Account section functionality
    const accountSection = document.querySelector('.account-section');
    if (accountSection) {
        accountSection.addEventListener('click', function() {
            openAccountMenu();
        });
    }
    
    // Language selector functionality
    const languageSelector = document.querySelector('.language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('click', function() {
            openLanguageMenu();
        });
    }
    
    // Cart functionality
    const cartSection = document.querySelector('.cart-section');
    if (cartSection) {
        cartSection.addEventListener('click', function() {
            openCart();
        });
    }
    
    // Returns section functionality
    const returnsSection = document.querySelector('.returns-section');
    if (returnsSection) {
        returnsSection.addEventListener('click', function() {
            // Already on orders page, do nothing or refresh
            location.reload();
        });
    }
}

// Switch between order tabs
function switchOrderTab(tabId) {
    // Remove active class from all tabs and panels
    const tabBtns = document.querySelectorAll('.order-tabs .tab-btn');
    const tabPanels = document.querySelectorAll('.orders-content .tab-panel');
    
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    const selectedBtn = document.querySelector(`.order-tabs .tab-btn[onclick*="${tabId}"]`);
    const selectedPanel = document.getElementById(`${tabId}-tab`);
    
    if (selectedBtn && selectedPanel) {
        selectedBtn.classList.add('active');
        selectedPanel.classList.add('active');
    }
    
    // Load content based on tab
    loadTabContent(tabId);
}

// Load content based on selected tab
function loadTabContent(tabId) {
    const timeFilter = document.querySelector('.time-filter');
    const selectedTime = timeFilter ? timeFilter.value : 'past 3 months';
    
    switch(tabId) {
        case 'orders':
            loadOrdersContent(selectedTime);
            break;
        case 'buy-again':
            loadBuyAgainContent();
            break;
        case 'not-shipped':
            loadNotShippedContent();
            break;
        case 'cancelled':
            loadCancelledContent();
            break;
    }
}

// Load orders content
function loadOrdersContent(timeFrame) {
    const ordersTab = document.getElementById('orders-tab');
    
    // For now, show the default content
    // In a real application, this would fetch orders from a server
    if (timeFrame === 'past 3 months') {
        ordersTab.innerHTML = `
            <div class="no-orders-message">
                <p>Looks like you haven't placed an order in the last 3 months.</p>
                <a href="#" class="view-orders-link" onclick="viewOrdersIn2025()">View orders in 2025</a>
            </div>
            
            <!-- Sponsored Product -->
            <div class="sponsored-product">
                <div class="product-image">
                    <img src="https://via.placeholder.com/200x300/1e3a8a/ffffff?text=Samsung" alt="Samsung Refrigerator">
                </div>
                <div class="product-details">
                    <h3>Samsung 223L 3 Star Inverter Direct-Cool Single Door Refrigerator</h3>
                    <div class="product-rating">
                        <div class="stars">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <span class="rating-count">48</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">₹20,798.00</span>
                        <span class="original-price">₹25,999.00</span>
                    </div>
                    <button class="shop-now-btn" onclick="shopNow()">Shop now</button>
                </div>
                <div class="sponsored-label">
                    <i class="fas fa-info-circle"></i>
                    <span>Sponsored</span>
                </div>
            </div>
        `;
    } else {
        // Show orders for other time frames
        loadOrdersForTimeFrame(timeFrame);
    }
}

// Load buy again content
function loadBuyAgainContent() {
    const buyAgainTab = document.getElementById('buy-again-tab');
    buyAgainTab.innerHTML = `
        <div class="no-orders-message">
            <p>No items available to buy again.</p>
        </div>
    `;
}

// Load not shipped content
function loadNotShippedContent() {
    const notShippedTab = document.getElementById('not-shipped-tab');
    notShippedTab.innerHTML = `
        <div class="no-orders-message">
            <p>All your orders have been shipped.</p>
        </div>
    `;
}

// Load cancelled content
function loadCancelledContent() {
    const cancelledTab = document.getElementById('cancelled-tab');
    cancelledTab.innerHTML = `
        <div class="no-orders-message">
            <p>No cancelled orders found.</p>
        </div>
    `;
}

// Load orders for specific time frame
function loadOrdersForTimeFrame(timeFrame) {
    const ordersTab = document.getElementById('orders-tab');
    
    // Mock orders data - in real app, this would come from server
    const mockOrders = getMockOrdersForTimeFrame(timeFrame);
    
    if (mockOrders.length === 0) {
        ordersTab.innerHTML = `
            <div class="no-orders-message">
                <p>No orders found for ${timeFrame}.</p>
            </div>
        `;
    } else {
        ordersTab.innerHTML = `
            <div class="orders-list">
                ${mockOrders.map(order => createOrderCard(order)).join('')}
            </div>
        `;
    }
}

// Get mock orders for time frame
function getMockOrdersForTimeFrame(timeFrame) {
    // Mock data - in real app, this would be fetched from server
    const allOrders = [
        {
            id: 'ORD001',
            orderDate: '2025-01-15',
            deliveryDate: '2025-01-18',
            status: 'Delivered',
            total: 12999,
            items: [
                {
                    name: 'Nike Air Max',
                    price: 12999,
                    image: 'https://via.placeholder.com/80x80/febd69/131921?text=Nike'
                }
            ]
        }
    ];
    
    // Filter based on time frame (simplified logic)
    if (timeFrame === '2025') {
        return allOrders;
    }
    
    return [];
}

// Create order card HTML
function createOrderCard(order) {
    return `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-date">Placed on ${formatDate(order.orderDate)}</div>
                    <div class="order-status ${order.status.toLowerCase()}">${order.status}</div>
                </div>
                <div class="order-total">₹${order.total.toLocaleString()}</div>
            </div>
            
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" class="item-image">
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-price">₹${item.price.toLocaleString()}</div>
                        </div>
                        <div class="item-actions">
                            <button class="like-btn ${isOrderLiked(order.id) ? 'liked' : ''}" onclick="toggleOrderLike('${order.id}')">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Handle time filter change
function handleTimeFilterChange(timeFrame) {
    loadTabContent('orders');
}

// View orders in 2025
function viewOrdersIn2025() {
    const timeFilter = document.querySelector('.time-filter');
    if (timeFilter) {
        timeFilter.value = '2025';
        handleTimeFilterChange('2025');
    }
}

// Shop now functionality
function shopNow() {
    // In real app, this would add to cart or navigate to product page
    // Product added to cart functionality coming soon
}

// Search functionality
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        // Navigate to search results page or show results
        // Search functionality coming soon
    }
}

// Search orders
function searchOrders() {
    const searchInput = document.querySelector('.order-search-input');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        // Search through orders
        // Order search functionality coming soon
    }
}

// Open account menu
function openAccountMenu() {
    // Navigate to account page or show account menu
    window.location.href = 'dashboard.html';
}

// Open language menu
function openLanguageMenu() {
    // Show language selection
    // Language selection functionality coming soon
}

// Open cart
function openCart() {
    // Navigate to cart page
    // Cart functionality coming soon
}

// Load user data
function loadUserData() {
    // Load user preferences and data from localStorage
    const savedData = localStorage.getItem('shopHubPreferences');
    if (savedData) {
        try {
            const userData = JSON.parse(savedData);
            updateUserDisplay(userData);
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    }
}

// Update user display
function updateUserDisplay(userData) {
    const helloText = document.querySelector('.account-section .hello-text');
    if (helloText && userData.currentUser && userData.currentUser.isLoggedIn) {
        helloText.textContent = `Hello, ${userData.currentUser.name}`;
    }
}

// Like functionality for orders
function isOrderLiked(orderId) {
    const likedOrders = JSON.parse(localStorage.getItem('likedOrders') || '[]');
    return likedOrders.some(order => order.id === orderId);
}

function toggleOrderLike(orderId) {
    let likedOrders = JSON.parse(localStorage.getItem('likedOrders') || '[]');
    const order = appState.orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    const existingIndex = likedOrders.findIndex(o => o.id === orderId);
    
    if (existingIndex !== -1) {
        // Remove from liked orders
        likedOrders.splice(existingIndex, 1);
        showNotification('Order removed from wishlist', 'info');
    } else {
        // Add to liked orders
        likedOrders.push(order);
        showNotification('Order added to wishlist', 'success');
    }
    
    localStorage.setItem('likedOrders', JSON.stringify(likedOrders));
    
    // Refresh the display to update like button state
    loadTabContent('orders');
}

// Utility function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
