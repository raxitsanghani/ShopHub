// CLEAN WORKING VERSION - This will actually work
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Initialize the application
    initializeApp();
    
    // Set up all click handlers
    setupClickHandlers();
    
    console.log('App initialized successfully');
});

// Application state
let appState = {
    currentLocation: 'Ahmedabad 380009',
    searchHistory: [],
    selectedCategory: 'All',
    cartItems: [],
    userPreferences: {},
    currentLanguage: 'EN',
    currentUser: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 98765 43210',
        isLoggedIn: true,
        addresses: [
            {
                id: 1,
                type: 'Home',
                fullName: 'John Doe',
                phone: '+91 98765 43210',
                addressLine1: '123 Main Street',
                addressLine2: 'Apartment 4B',
                city: 'Ahmedabad',
                state: 'Gujarat',
                pincode: '380009',
                isDefault: true
            }
        ],
        orders: [
            {
                id: 'ORD001',
                orderDate: '2024-01-15',
                deliveryDate: '2024-01-18',
                status: 'Delivered',
                total: 12999,
                items: [
                    {
                        id: 1,
                        name: 'Nike Air Max',
                        category: 'Fashion',
                        price: 12999,
                        quantity: 1,
                        image: 'https://via.placeholder.com/80x80/febd69/131921?text=Nike',
                        sku: 'NIKE-AM-42'
                    }
                ]
            }
        ]
    },
    orders: []
};

// Initialize the application
function initializeApp() {
    loadUserPreferences();
    updateLocationDisplay();
    updateLanguageDisplay();
    updateAccountDisplay();
    populateCategories();
    loadSearchHistory();
    
    // Copy orders from currentUser to appState
    appState.orders = [...appState.currentUser.orders];
}

// Set up all click handlers
function setupClickHandlers() {
    console.log('Setting up click handlers...');
    
    // Account & Lists - FIXED
    const accountSection = document.querySelector('.account-section');
    if (accountSection) {
        console.log('Account section found');
        accountSection.onclick = function() {
            console.log('Account clicked!');
            openAccountMenu();
        };
    } else {
        console.error('Account section not found!');
    }
    
    // Returns & Orders - FIXED
    const returnsSection = document.querySelector('.returns-section');
    if (returnsSection) {
        console.log('Returns section found');
        returnsSection.onclick = function() {
            console.log('Returns clicked!');
            window.location.href = 'orders.html';
        };
    } else {
        console.error('Returns section not found!');
    }
    
    // Language Selector - FIXED
    const languageSelector = document.querySelector('.language-selector');
    if (languageSelector) {
        console.log('Language selector found');
        languageSelector.onclick = function() {
            console.log('Language clicked!');
            openLanguageMenu();
        };
    } else {
        console.error('Language selector not found!');
    }
    
    // Update Location - FIXED
    const deliveryInfo = document.querySelector('.delivery-info');
    if (deliveryInfo) {
        console.log('Delivery info found');
        deliveryInfo.onclick = function() {
            console.log('Location clicked!');
            openLocationEditor();
        };
    } else {
        console.error('Delivery info not found!');
}

// Search functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.onclick = function() {
            performSearch();
        };
    }
    
    // Cart functionality
    const cartSection = document.querySelector('.cart-section');
    if (cartSection) {
        cartSection.onclick = function() {
            openCart();
        };
    }
    
    // Menu button
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.onclick = function() {
            openAllCategoriesMenu();
        };
    }
    
    console.log('All click handlers set up successfully');
}

// Load user preferences
function loadUserPreferences() {
    const saved = localStorage.getItem('shopHubPreferences');
    if (saved) {
        try {
            const preferences = JSON.parse(saved);
            appState = { ...appState, ...preferences };
            
            // Ensure currentUser is properly loaded
            if (preferences.currentUser) {
                appState.currentUser = { ...appState.currentUser, ...preferences.currentUser };
            }
            
            // Load orders if they exist
            if (preferences.currentUser && preferences.currentUser.orders) {
                appState.orders = [...preferences.currentUser.orders];
    } else {
                // If no orders in preferences, use the default orders
                appState.orders = [...appState.currentUser.orders];
            }
        } catch (e) {
            console.error('Error loading preferences:', e);
        }
    }
}

// Save user preferences
function saveUserPreferences() {
    try {
        localStorage.setItem('shopHubPreferences', JSON.stringify(appState));
    } catch (e) {
        console.error('Error saving preferences:', e);
    }
}

// Update account display
function updateAccountDisplay() {
    const helloText = document.querySelector('.account-section .hello-text');
    if (helloText && appState.currentUser && appState.currentUser.isLoggedIn) {
        helloText.textContent = `Hello, ${appState.currentUser.name}`;
    }
}

// Update location display
function updateLocationDisplay() {
    const locationElement = document.querySelector('.delivery-location');
    if (locationElement) {
        locationElement.textContent = `Delivering to ${appState.currentLocation}`;
    }
}

// Update language display
function updateLanguageDisplay() {
    // Language display is already set in HTML
}

// Populate categories
function populateCategories() {
    // Categories are already in HTML
}

// Load search history
function loadSearchHistory() {
    // Search history is already loaded in appState
}

// Open account menu
function openAccountMenu() {
    console.log('Opening account menu...');
    const modal = createModal('Account & Lists', createAccountMenu());
    document.body.appendChild(modal);
}

// Create account menu content
function createAccountMenu() {
    const content = document.createElement('div');
    
    if (appState.currentUser.isLoggedIn) {
        content.innerHTML = `
            <div class="account-menu-content">
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="user-details">
                        <h3>${appState.currentUser.name || 'User'}</h3>
                        <p>${appState.currentUser.email}</p>
                    </div>
                </div>
                <div class="account-options">
                    <div class="account-option" onclick="openUserProfile()">
                        <i class="fas fa-user"></i>
                        <span>Your Profile</span>
                    </div>
                    <div class="account-option" onclick="openOrders()">
                        <i class="fas fa-box"></i>
                        <span>Your Orders</span>
                    </div>
                    <div class="account-option" onclick="openWishlist()">
                        <i class="fas fa-heart"></i>
                        <span>Your Wishlist</span>
                    </div>
                    <div class="account-option" onclick="openSettings()">
                        <i class="fas fa-cog"></i>
                        <span>Account Settings</span>
                    </div>
                    <div class="account-option" onclick="openHelp()">
                        <i class="fas fa-question-circle"></i>
                        <span>Help & Support</span>
                    </div>
                    <div class="account-divider"></div>
                    <div class="account-option logout-option" onclick="logoutUser()">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        content.innerHTML = `
            <div class="account-menu-content">
                <div class="login-section">
                    <h3>Sign In</h3>
                    <p>Access your account to manage orders, wishlist, and more.</p>
                    <button class="btn btn-primary" onclick="openLogin()">Sign In</button>
                    <button class="btn btn-secondary" onclick="openSignup()">Create Account</button>
                </div>
            </div>
        `;
    }
    
    return content;
}

// Open language menu
function openLanguageMenu() {
    console.log('Opening language menu...');
    const modal = createModal('Language & Currency', createLanguageMenu());
    document.body.appendChild(modal);
}

// Create language menu content
function createLanguageMenu() {
    const content = document.createElement('div');
    content.innerHTML = `
        <div class="language-menu-content">
            <div class="language-section">
                <h3>Select Language</h3>
                <div class="language-options">
                    <div class="language-option" onclick="changeLanguage('EN')">
                        <span class="flag">🇺🇸</span>
                        <span>English</span>
                        <i class="fas fa-check" style="display: ${appState.currentLanguage === 'EN' ? 'inline' : 'none'}"></i>
                    </div>
                    <div class="language-option" onclick="changeLanguage('HI')">
                        <span class="flag">🇮🇳</span>
                        <span>हिंदी</span>
                        <i class="fas fa-check" style="display: ${appState.currentLanguage === 'HI' ? 'inline' : 'none'}"></i>
                    </div>
                    <div class="language-option" onclick="changeLanguage('GU')">
                        <span class="flag">🇮🇳</span>
                        <span>ગુજરાતી</span>
                        <i class="fas fa-check" style="display: ${appState.currentLanguage === 'GU' ? 'inline' : 'none'}"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
    return content;
}

// Change language
function changeLanguage(lang) {
    appState.currentLanguage = lang;
    updateLanguageDisplay();
    saveUserPreferences();
    closeModal();
    showNotification(`Language changed to ${lang}`, 'success');
}

// Open location editor
function openLocationEditor() {
    console.log('Opening location editor...');
    const modal = createModal('Update Delivery Location', createLocationForm());
    document.body.appendChild(modal);
}

// Create location form
function createLocationForm() {
    const form = document.createElement('div');
    form.innerHTML = `
        <div class="location-form">
            <div class="form-group">
                <label for="new-location">Enter your location:</label>
                <input type="text" id="new-location" placeholder="e.g., Mumbai 400001" value="${appState.currentLocation}">
            </div>
            <div class="form-group">
                <label for="pincode">Pincode:</label>
                <input type="text" id="pincode" placeholder="e.g., 400001" maxlength="6">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-primary" onclick="saveLocation()">Save Location</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `;
    return form;
}

// Save location
function saveLocation() {
    const locationInput = document.getElementById('new-location');
    const pincodeInput = document.getElementById('pincode');
    
    if (locationInput.value.trim()) {
        appState.currentLocation = locationInput.value.trim();
        if (pincodeInput.value.trim()) {
            appState.currentLocation += ` ${pincodeInput.value.trim()}`;
        }
        
        updateLocationDisplay();
        saveUserPreferences();
        closeModal();
        
        showNotification('Location updated successfully!', 'success');
    } else {
        showNotification('Please enter a valid location', 'error');
    }
}

// Open all categories menu
function openAllCategoriesMenu() {
    const modal = createModal('All Categories', createCategoriesMenu());
    document.body.appendChild(modal);
}

// Create categories menu
function createCategoriesMenu() {
    const content = document.createElement('div');
    content.innerHTML = `
        <div class="categories-menu-content">
            <div class="category-group">
                <h3>Electronics</h3>
                <div class="category-links">
                    <a href="#" onclick="navigateToCategory('Electronics')">Computers</a>
                    <a href="#" onclick="navigateToCategory('Electronics')">Phones</a>
                    <a href="#" onclick="navigateToCategory('Electronics')">TVs</a>
            </div>
            </div>
            <div class="category-group">
                <h3>Fashion</h3>
                <div class="category-links">
                    <a href="#" onclick="navigateToCategory('Fashion')">Men's Clothing</a>
                    <a href="#" onclick="navigateToCategory('Fashion')">Women's Clothing</a>
                    <a href="#" onclick="navigateToCategory('Fashion')">Shoes</a>
            </div>
            </div>
        </div>
    `;
    return content;
}

// Navigate to category
function navigateToCategory(category) {
    showNotification(`${category} category selected`, 'info');
        closeModal();
}

// Open user profile
function openUserProfile() {
    window.location.href = 'profile.html';
}

// Open orders
function openOrders() {
    window.location.href = 'orders.html';
}

// Open wishlist
function openWishlist() {
    const modal = createModal('Your Wishlist', createWishlistContent());
    document.body.appendChild(modal);
}

// Create wishlist content
function createWishlistContent() {
    const content = document.createElement('div');
    
    // Get liked orders from localStorage
    const likedOrders = JSON.parse(localStorage.getItem('likedOrders') || '[]');
    
    if (likedOrders.length === 0) {
    content.innerHTML = `
            <div class="wishlist-empty">
                <i class="fas fa-heart" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                <h3>Your Wishlist is Empty</h3>
                <p>Like some orders to see them here!</p>
            </div>
        `;
    } else {
        content.innerHTML = `
            <div class="wishlist-content">
                <h3>Liked Orders (${likedOrders.length})</h3>
                <div class="liked-orders-list">
                    ${likedOrders.map(order => `
                        <div class="liked-order-item">
                            <div class="order-header">
                                <span class="order-id">Order #${order.id}</span>
                                <button class="btn btn-danger btn-sm" onclick="removeFromWishlist('${order.id}')">
                                    <i class="fas fa-heart-broken"></i> Unlike
                                </button>
                </div>
                            <div class="order-details">
                                <div class="order-info">
                                    <p><strong>Date:</strong> ${order.orderDate}</p>
                                    <p><strong>Status:</strong> <span class="status-${order.status.toLowerCase()}">${order.status}</span></p>
                                    <p><strong>Total:</strong> ₹${order.total.toLocaleString()}</p>
                </div>
                            </div>
                        </div>
                    `).join('')}
            </div>
        </div>
    `;
    }
    
    return content;
}

// Remove from wishlist
function removeFromWishlist(orderId) {
    let likedOrders = JSON.parse(localStorage.getItem('likedOrders') || '[]');
    likedOrders = likedOrders.filter(order => order.id !== orderId);
    localStorage.setItem('likedOrders', JSON.stringify(likedOrders));
    
    // Refresh the wishlist modal
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        const content = modal.querySelector('.modal-content');
        content.innerHTML = createWishlistContent().outerHTML;
    }
    
    showNotification('Order removed from wishlist', 'success');
}

// Open settings
function openSettings() {
    const modal = createModal('Account Settings', createSettingsContent());
    document.body.appendChild(modal);
}

// Create settings content
function createSettingsContent() {
    const content = document.createElement('div');
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    content.innerHTML = `
        <div class="settings-content">
            <div class="setting-section">
                <h3><i class="fas fa-palette"></i> Appearance</h3>
                <div class="setting-item">
                    <label>Theme Mode</label>
                    <div class="theme-toggle">
                        <button class="btn ${isDarkMode ? 'btn-secondary' : 'btn-primary'}" onclick="toggleTheme('light')" ${!isDarkMode ? 'disabled' : ''}>
                            <i class="fas fa-sun"></i> Light Mode
                            </button>
                        <button class="btn ${isDarkMode ? 'btn-primary' : 'btn-secondary'}" onclick="toggleTheme('dark')" ${isDarkMode ? 'disabled' : ''}>
                            <i class="fas fa-moon"></i> Dark Mode
                            </button>
                        </div>
                    </div>
            </div>
        </div>
    `;
    
    return content;
}

// Toggle theme
function toggleTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        appState.userPreferences.theme = 'dark';
        showNotification('Dark mode enabled', 'success');
    } else {
        document.body.classList.remove('dark-mode');
        appState.userPreferences.theme = 'light';
        showNotification('Light mode enabled', 'success');
    }
    
    saveUserPreferences();
    
    // Refresh the settings modal
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        const content = modal.querySelector('.modal-content');
        content.innerHTML = createSettingsContent().outerHTML;
    }
}

// Open help
function openHelp() {
    const modal = createModal('Help & Support', createHelpContent());
    document.body.appendChild(modal);
}

// Create help content
function createHelpContent() {
    const content = document.createElement('div');
    
    content.innerHTML = `
        <div class="help-content">
            <div class="help-section">
                <h3><i class="fas fa-headset"></i> Customer Care</h3>
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>Phone: <a href="tel:9510261149">9510261149</a></span>
                            </div>
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>Email: <a href="mailto:raxitsanghani@gmail.com">raxitsanghani@gmail.com</a></span>
                    </div>
                        </div>
                        
                <div class="social-links">
                    <h4>Connect with us:</h4>
                    <div class="social-buttons">
                        <a href="https://instagram.com/raxit__sanghani95" target="_blank" class="social-btn instagram">
                            <i class="fab fa-instagram"></i>
                            <span>Instagram</span>
                        </a>
                        <a href="https://wa.me/919510261149" target="_blank" class="social-btn whatsapp">
                            <i class="fab fa-whatsapp"></i>
                            <span>WhatsApp</span>
                        </a>
                                    </div>
                                </div>
                        </div>
                        
            <div class="help-section">
                <h3><i class="fas fa-comments"></i> AI Chat Support</h3>
                <div class="chat-container">
                    <div class="chat-messages" id="chat-messages">
                        <div class="message bot-message">
                            <i class="fas fa-robot"></i>
                            <div class="message-content">
                                <p>Hello! I'm your AI assistant. How can I help you today?</p>
                                </div>
                                </div>
                                </div>
                    <div class="chat-input">
                        <input type="text" id="chat-input-field" placeholder="Type your message..." onkeypress="handleChatKeyPress(event)">
                        <button onclick="sendChatMessage()" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
            </div>
        </div>
    `;
    
    return content;
}

// Chat functions
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input-field');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Generate AI response
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addChatMessage(aiResponse, 'bot');
    }, 1000);
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const icon = sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
    messageDiv.innerHTML = `
        <i class="${icon}"></i>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('product') || message.includes('item')) {
        return "Our products are carefully selected for quality and value. You can browse our catalog by category or use the search function to find specific items.";
    } else if (message.includes('order') || message.includes('track')) {
        return "To track your order, go to 'Your Orders' section in your account. You'll see real-time updates on delivery status.";
    } else {
        return "Thank you for your question! I'm here to help with any inquiries about our products, orders, delivery, or general support.";
    }
}

// Other functions
function openLogin() {
    const modal = createModal('Sign In', createLoginForm());
    document.body.appendChild(modal);
}

function createLoginForm() {
    const content = document.createElement('div');
    content.innerHTML = `
        <div class="login-form">
            <div class="form-group">
                <label for="login-email">Email:</label>
                <input type="email" id="login-email" placeholder="Enter your email">
            </div>
            <div class="form-group">
                <label for="login-password">Password:</label>
                <input type="password" id="login-password" placeholder="Enter your password">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-primary" onclick="performLogin()">Sign In</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `;
    return content;
}

function performLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (email && password) {
        appState.currentUser = {
            name: 'John Doe',
            email: email,
            isLoggedIn: true
        };
        
        updateAccountDisplay();
        saveUserPreferences();
        closeModal();
        
        showNotification('Successfully logged in!', 'success');
    } else {
        showNotification('Please enter both email and password', 'error');
    }
}

function openSignup() {
    const modal = createModal('Create Account', createSignupForm());
    document.body.appendChild(modal);
}

function createSignupForm() {
    const content = document.createElement('div');
    content.innerHTML = `
        <div class="signup-form">
            <div class="form-group">
                <label for="signup-name">Full Name:</label>
                <input type="text" id="signup-name" placeholder="Enter your full name">
            </div>
            <div class="form-group">
                <label for="signup-email">Email:</label>
                <input type="email" id="signup-email" placeholder="Enter your email">
            </div>
            <div class="form-group">
                <label for="signup-password">Password:</label>
                <input type="password" id="signup-password" placeholder="Create a password">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-primary" onclick="performSignup()">Create Account</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `;
    return content;
}

function performSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    if (name && email && password) {
        appState.currentUser = {
            name: name,
            email: email,
            isLoggedIn: true
        };
        
        updateAccountDisplay();
        saveUserPreferences();
        closeModal();
        
        showNotification('Account created successfully!', 'success');
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

function logoutUser() {
    appState.currentUser.isLoggedIn = false;
    appState.currentUser.name = '';
    appState.currentUser.email = '';
    
    updateAccountDisplay();
            saveUserPreferences();
            closeModal();
            
    showNotification('Successfully logged out', 'success');
    
    setTimeout(() => {
        window.location.href = '/';
    }, 1500);
}

function openCart() {
    showNotification('Cart is empty. Start shopping to add items!', 'info');
}

function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        showNotification(`Searching for: ${searchTerm}`, 'info');
            } else {
        showNotification('Please enter a search term', 'error');
    }
}

// Modal functions
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div class="modal" style="
            background: white;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        ">
            <div class="modal-header" style="
                padding: 20px;
                border-bottom: 1px solid #e9ecef;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <h3 style="margin: 0; color: #131921;">${title}</h3>
                <button class="modal-close" onclick="closeModal()" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                ">&times;</button>
            </div>
            <div class="modal-content" style="padding: 20px;">
                ${content.outerHTML}
            </div>
        </div>
    `;
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
    closeModal();
        }
    });
    
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);
