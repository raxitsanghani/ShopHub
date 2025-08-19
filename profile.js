document.addEventListener('DOMContentLoaded', function() {
    // Initialize the profile page
    initializeProfilePage();
    
    // Add event listeners
    addEventListeners();
});

// Initialize the profile page
function initializeProfilePage() {
    // Load user data and preferences
    loadUserData();
    
    // Load addresses
    loadAddresses();
    
    // Load current orders
    loadCurrentOrders();
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
    
    // Account section functionality
    const accountSection = document.querySelector('.account-section');
    if (accountSection) {
        accountSection.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }
    
    // Language selector functionality
    const languageSelector = document.querySelector('.language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('click', function() {
            showNotification('Language selection coming soon!', 'info');
        });
    }
    
    // Cart functionality
    const cartSection = document.querySelector('.cart-section');
    if (cartSection) {
        cartSection.addEventListener('click', function() {
            showNotification('Cart functionality coming soon!', 'info');
        });
    }
    
    // Returns section functionality
    const returnsSection = document.querySelector('.returns-section');
    if (returnsSection) {
        returnsSection.addEventListener('click', function() {
            window.location.href = 'orders.html';
        });
    }
    
    // Form submissions
    setupFormSubmissions();
}

// Setup form submissions
function setupFormSubmissions() {
    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfile();
        });
    }
    
    // Address form
    const addressForm = document.getElementById('address-form');
    if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAddress();
        });
    }
    
    // Password form - no longer needed since we handle it with button click
    // const passwordForm = document.getElementById('password-form');
    // if (passwordForm) {
    //     passwordForm.addEventListener('submit', function(e) {
    //         e.preventDefault();
    //         changePassword();
    //     });
    // }
    
    // OTP request form
    const otpRequestForm = document.getElementById('otp-request-form');
    if (otpRequestForm) {
        otpRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            requestOTP();
        });
    }
    
    // OTP verify form
    const otpVerifyForm = document.getElementById('otp-verify-form');
    if (otpVerifyForm) {
        otpVerifyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            verifyOTP();
        });
    }
    
    // OTP reset form
    const otpResetForm = document.getElementById('otp-reset-form');
    if (otpResetForm) {
        otpResetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            resetPasswordWithOTP();
        });
    }
}

// Load user data
async function loadUserData() {
    const savedData = localStorage.getItem('shopHubPreferences');
    if (savedData) {
        try {
            const userData = JSON.parse(savedData);
            if (userData.currentUser && userData.currentUser.isLoggedIn) {
                // Try to get fresh user data from the database
                try {
                    const response = await fetch(`/api/profile`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                        }
                    });
                    
                    if (response.ok) {
                        const dbUser = await response.json();
                        // Update localStorage with fresh data
                        userData.currentUser = {
                            ...userData.currentUser,
                            id: dbUser._id,
                            email: dbUser.email,
                            phone: dbUser.phone,
                            age: dbUser.age
                        };
                        localStorage.setItem('shopHubPreferences', JSON.stringify(userData));
                    }
                } catch (error) {
                    console.log('Could not fetch fresh user data, using cached data');
                }
                
                updateProfileDisplay(userData);
            }
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    }
}

// Update profile display
function updateProfileDisplay(userData) {
    if (userData.currentUser && userData.currentUser.isLoggedIn) {
        // Update profile info
        const nameElement = document.getElementById('profile-name');
        const ageElement = document.getElementById('profile-age');
        const emailElement = document.getElementById('profile-email');
        const phoneElement = document.getElementById('profile-phone');
        
        if (nameElement) nameElement.textContent = userData.currentUser.name || 'John Doe';
        if (ageElement) ageElement.textContent = userData.currentUser.age || '25';
        if (emailElement) emailElement.textContent = userData.currentUser.email || 'john.doe@gmail.com';
        if (phoneElement) phoneElement.textContent = userData.currentUser.phone || '+91 98765 43210';
        
        // Update header
        const helloText = document.querySelector('.account-section .hello-text');
        if (helloText) {
            helloText.textContent = `Hello, ${userData.currentUser.name}`;
        }
    }
}

// Load addresses
function loadAddresses() {
    const savedData = localStorage.getItem('shopHubPreferences');
    if (savedData) {
        try {
            const userData = JSON.parse(savedData);
            if (userData.currentUser && userData.currentUser.addresses) {
                displayAddresses(userData.currentUser.addresses);
            }
        } catch (e) {
            console.error('Error loading addresses:', e);
        }
    }
}

// Display addresses
function displayAddresses(addresses) {
    const addressesList = document.getElementById('addresses-list');
    if (!addressesList) return;
    
    if (addresses.length === 0) {
        addressesList.innerHTML = `
            <div class="no-addresses">
                <p>No addresses found. Add your first delivery address!</p>
            </div>
        `;
        return;
    }
    
    addressesList.innerHTML = addresses.map(address => `
        <div class="address-card ${address.isDefault ? 'default' : ''}">
            <div class="address-header">
                <span class="address-type">${address.type}</span>
                ${address.isDefault ? '<span class="default-badge">Default</span>' : ''}
            </div>
            <div class="address-content">
                <div class="address-name">${address.fullName}</div>
                <div class="address-phone">${address.phone}</div>
                <div class="address-lines">
                    ${address.addressLine1}<br>
                    ${address.addressLine2 ? address.addressLine2 + '<br>' : ''}
                    ${address.city}, ${address.state} ${address.pincode}
                </div>
            </div>
            <div class="address-actions">
                <button class="btn btn-secondary btn-sm" onclick="editAddress(${address.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteAddress(${address.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
                ${!address.isDefault ? `
                    <button class="btn btn-primary btn-sm" onclick="setDefaultAddress(${address.id})">
                        Set as Default
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Load current orders
function loadCurrentOrders() {
    const savedData = localStorage.getItem('shopHubPreferences');
    if (savedData) {
        try {
            const userData = JSON.parse(savedData);
            if (userData.currentUser && userData.currentUser.orders) {
                const currentOrders = userData.currentUser.orders.filter(order => 
                    order.status === 'Processing' || order.status === 'Shipped'
                );
                displayCurrentOrders(currentOrders);
            }
        } catch (e) {
            console.error('Error loading current orders:', e);
        }
    }
}

// Display current orders
function displayCurrentOrders(orders) {
    const currentOrdersContainer = document.getElementById('current-orders');
    if (!currentOrdersContainer) return;
    
    if (orders.length === 0) {
        currentOrdersContainer.innerHTML = `
            <div class="no-orders">
                <p>No orders currently in progress.</p>
            </div>
        `;
        return;
    }
    
    currentOrdersContainer.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <div class="order-id">Order #${order.id}</div>
                <div class="order-status ${order.status.toLowerCase()}">${order.status}</div>
            </div>
            <div class="order-details">
                <img src="${order.items[0].image}" alt="${order.items[0].name}" class="product-image">
                <div class="product-info">
                    <h4>${order.items[0].name}</h4>
                    <p><strong>Location:</strong> ${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    <p><strong>Total:</strong> ₹${order.total.toLocaleString()}</p>
                    <p><strong>Tracking:</strong> ${order.trackingNumber}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Edit profile
function editProfile() {
    const savedData = localStorage.getItem('shopHubPreferences');
    if (savedData) {
        try {
            const userData = JSON.parse(savedData);
            if (userData.currentUser) {
                // Pre-fill form
                document.getElementById('edit-name').value = userData.currentUser.name || '';
                document.getElementById('edit-age').value = userData.currentUser.age || '';
                document.getElementById('edit-email').value = userData.currentUser.email || '';
                document.getElementById('edit-phone').value = userData.currentUser.phone || '';
            }
        } catch (e) {
            console.error('Error loading profile data:', e);
        }
    }
    
    document.getElementById('profile-modal').style.display = 'flex';
}

// Save profile
function saveProfile() {
    const name = document.getElementById('edit-name').value.trim();
    const age = document.getElementById('edit-age').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    
    if (name && age && email && phone) {
        const savedData = localStorage.getItem('shopHubPreferences');
        if (savedData) {
            try {
                const userData = JSON.parse(savedData);
                if (userData.currentUser) {
                    userData.currentUser.name = name;
                    userData.currentUser.age = parseInt(age);
                    userData.currentUser.email = email;
                    userData.currentUser.phone = phone;
                    
                    localStorage.setItem('shopHubPreferences', JSON.stringify(userData));
                    
                    // Update display
                    updateProfileDisplay(userData);
                    
                    // Close modal
                    closeModal('profile-modal');
                    
                    // Show success message
                    showNotification('Profile updated successfully!', 'success');
                }
            } catch (e) {
                console.error('Error saving profile:', e);
                showNotification('Error saving profile', 'error');
            }
        }
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

// Add new address
function addNewAddress() {
    // Reset form
    document.getElementById('address-form').reset();
    document.getElementById('address-modal-title').textContent = 'Add New Address';
    
    // Clear any existing address ID
    document.getElementById('address-form').removeAttribute('data-address-id');
    
    document.getElementById('address-modal').style.display = 'flex';
}

// Edit address
function editAddress(addressId) {
    const savedData = localStorage.getItem('shopHubPreferences');
    if (savedData) {
        try {
            const userData = JSON.parse(savedData);
            const address = userData.currentUser.addresses.find(addr => addr.id === addressId);
            
            if (address) {
                // Pre-fill form
                document.getElementById('address-type').value = address.type;
                document.getElementById('address-fullname').value = address.fullName;
                document.getElementById('address-phone').value = address.phone;
                document.getElementById('address-line1').value = address.addressLine1;
                document.getElementById('address-line2').value = address.addressLine2 || '';
                document.getElementById('address-city').value = address.city;
                document.getElementById('address-state').value = address.state;
                document.getElementById('address-pincode').value = address.pincode;
                document.getElementById('address-default').checked = address.isDefault;
                
                // Set address ID for editing
                document.getElementById('address-form').setAttribute('data-address-id', addressId);
                document.getElementById('address-modal-title').textContent = 'Edit Address';
                
                document.getElementById('address-modal').style.display = 'flex';
            }
        } catch (e) {
            console.error('Error loading address data:', e);
        }
    }
}

// Save address
function saveAddress() {
    const addressData = collectAddressFormData();
    
    if (validateAddressData(addressData)) {
        const savedData = localStorage.getItem('shopHubPreferences');
        if (savedData) {
            try {
                const userData = JSON.parse(savedData);
                const addressId = document.getElementById('address-form').getAttribute('data-address-id');
                
                if (addressId) {
                    // Editing existing address
                    const addressIndex = userData.currentUser.addresses.findIndex(addr => addr.id === parseInt(addressId));
                    if (addressIndex !== -1) {
                        if (addressData.isDefault) {
                            userData.currentUser.addresses.forEach(addr => addr.isDefault = false);
                        }
                        userData.currentUser.addresses[addressIndex] = {
                            ...userData.currentUser.addresses[addressIndex],
                            ...addressData,
                            isDefault: addressData.isDefault
                        };
                    }
                } else {
                    // Adding new address
                    if (addressData.isDefault) {
                        userData.currentUser.addresses.forEach(addr => addr.isDefault = false);
                    }
                    
                    const newAddress = {
                        id: Date.now(),
                        ...addressData
                    };
                    
                    userData.currentUser.addresses.push(newAddress);
                }
                
                localStorage.setItem('shopHubPreferences', JSON.stringify(userData));
                
                // Refresh display
                loadAddresses();
                
                // Close modal
                closeModal('address-modal');
                
                // Show success message
                showNotification(addressId ? 'Address updated successfully!' : 'Address added successfully!', 'success');
            } catch (e) {
                console.error('Error saving address:', e);
                showNotification('Error saving address', 'error');
            }
        }
    }
}

// Delete address
function deleteAddress(addressId) {
    const savedData = localStorage.getItem('shopHubPreferences');
    if (savedData) {
        try {
            const userData = JSON.parse(savedData);
            const addressIndex = userData.currentUser.addresses.findIndex(addr => addr.id === addressId);
            
            if (addressIndex !== -1) {
                const deletedAddress = userData.currentUser.addresses[addressIndex];
                
                // If deleting default address, set first remaining address as default
                if (deletedAddress.isDefault && userData.currentUser.addresses.length > 1) {
                    const remainingAddresses = userData.currentUser.addresses.filter(addr => addr.id !== addressId);
                    if (remainingAddresses.length > 0) {
                        remainingAddresses[0].isDefault = true;
                    }
                }
                
                userData.currentUser.addresses.splice(addressIndex, 1);
                localStorage.setItem('shopHubPreferences', JSON.stringify(userData));
                
                // Refresh display
                loadAddresses();
                
                showNotification('Address deleted successfully!', 'success');
            }
        } catch (e) {
            console.error('Error deleting address:', e);
            showNotification('Error deleting address', 'error');
        }
    }
}

// Set default address
function setDefaultAddress(addressId) {
    const savedData = localStorage.getItem('shopHubPreferences');
    if (savedData) {
        try {
            const userData = JSON.parse(savedData);
            
            // Remove default from all addresses
            userData.currentUser.addresses.forEach(addr => addr.isDefault = false);
            
            // Set new default
            const address = userData.currentUser.addresses.find(addr => addr.id === addressId);
            if (address) {
                address.isDefault = true;
                localStorage.setItem('shopHubPreferences', JSON.stringify(userData));
                
                // Refresh display
                loadAddresses();
                
                showNotification('Default address updated successfully!', 'success');
            }
        } catch (e) {
            console.error('Error setting default address:', e);
            showNotification('Error setting default address', 'error');
        }
    }
}

// Change password
function changePassword() {
    document.getElementById('password-modal').style.display = 'flex';
}

// Save new password
async function savePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('New password must be at least 6 characters long', 'error');
        return;
    }
    
    // Get current user email from localStorage
    const savedData = localStorage.getItem('shopHubPreferences');
    if (!savedData) {
        showNotification('User session not found. Please login again.', 'error');
        return;
    }
    
    try {
        const userData = JSON.parse(savedData);
        const currentUser = userData.currentUser;
        
        if (!currentUser || !currentUser.email) {
            showNotification('User information not found. Please login again.', 'error');
            return;
        }
        
        // Find user in mock system
        const mockUser = findUserByEmail(currentUser.email);
        if (!mockUser) {
            showNotification('User not found in system. Please login again.', 'error');
            return;
        }
        
        // Verify current password
        if (mockUser.password !== currentPassword) {
            showNotification('Current password is incorrect', 'error');
            return;
        }
        
        // Update password in mock system
        const success = updateUserPassword(currentUser.email, newPassword);
        
        if (success) {
            showNotification('Password changed successfully!', 'success');
            
            // Clear the form
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
            
            // Close the modal
            closeModal('password-modal');
        } else {
            showNotification('Failed to update password', 'error');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showNotification('Error changing password. Please try again.', 'error');
    }
}

// Forgot password
function forgotPassword() {
    document.getElementById('otp-modal').style.display = 'flex';
    showOTPStep(1);
}

// Open forgot password modal
function openForgotPassword() {
    // Close password modal
    closeModal('password-modal');
    // Open OTP modal
    document.getElementById('otp-modal').style.display = 'flex';
    showOTPStep(1);
}

// Request OTP
async function requestOTP() {
    const phone = document.getElementById('otp-phone').value.trim();
    
    if (!phone) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }

    // Format phone number (remove spaces, dashes, etc.)
    const formattedPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    try {
        const response = await fetch('/api/request-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone: formattedPhone })
        });

        const data = await response.json();

        if (response.ok) {
            // Store phone for verification
            sessionStorage.setItem('resetPhone', formattedPhone);
            
            // Show success message
            showNotification(data.message, 'success');
            
            // Move to next step
            showOTPStep(2);
        } else {
            if (response.status === 404) {
                showNotification('No account found with this phone number. Please create an account first or check your phone number.', 'error');
            } else {
                showNotification(data.error || 'Failed to send OTP', 'error');
            }
        }
    } catch (error) {
        console.error('Error requesting OTP:', error);
        showNotification('Network error. Please try again.', 'error');
    }
}

// Verify OTP
async function verifyOTP() {
    const otpCode = document.getElementById('otp-code').value.trim();
    const phone = sessionStorage.getItem('resetPhone');
    
    if (!otpCode || !phone) {
        showNotification('Please enter the OTP and ensure phone number is available', 'error');
        return;
    }

    try {
        const response = await fetch('/api/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, otp: otpCode })
        });

        const data = await response.json();

        if (response.ok) {
            // Store reset token for password reset
            sessionStorage.setItem('resetToken', data.resetToken);
            
            showNotification('OTP verified successfully!', 'success');
            showOTPStep(3);
        } else {
            showNotification(data.error || 'Invalid OTP. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        showNotification('Network error. Please try again.', 'error');
    }
}

// Reset password with OTP
async function resetPasswordWithOTP() {
    const newPassword = document.getElementById('reset-password').value;
    const confirmPassword = document.getElementById('reset-confirm').value;
    const resetToken = sessionStorage.getItem('resetToken');
    
    if (!resetToken) {
        showNotification('Reset session expired. Please start over.', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }

    try {
        const response = await fetch('/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resetToken, newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            // Get the phone number from session storage
            const phone = sessionStorage.getItem('resetPhone');
            
            // Find user by phone number in mock system
            const mockUser = mockUsers.find(user => user.phone === phone);
            if (mockUser) {
                // Update password in mock system
                updateUserPassword(mockUser.email, newPassword);
                showNotification('Password reset successfully!', 'success');
            } else {
                showNotification('Password reset successful but user not found in system', 'warning');
            }
            
            // Clear session storage
            sessionStorage.removeItem('resetOTP');
            sessionStorage.removeItem('resetEmail');
            sessionStorage.removeItem('resetPhone');
            sessionStorage.removeItem('resetToken');
            
            // Close modal
            closeModal('otp-modal');
        } else {
            showNotification(data.error || 'Failed to reset password', 'error');
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        showNotification('Network error. Please try again.', 'error');
    }
}

// Show OTP step
function showOTPStep(step) {
    // Hide all steps
    document.getElementById('otp-step-1').style.display = 'none';
    document.getElementById('otp-step-2').style.display = 'none';
    document.getElementById('otp-step-3').style.display = 'none';
    
    // Show selected step
    document.getElementById(`otp-step-${step}`).style.display = 'block';
}

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Collect address form data
function collectAddressFormData() {
    return {
        type: document.getElementById('address-type').value,
        fullName: document.getElementById('address-fullname').value.trim(),
        phone: document.getElementById('address-phone').value.trim(),
        addressLine1: document.getElementById('address-line1').value.trim(),
        addressLine2: document.getElementById('address-line2').value.trim(),
        city: document.getElementById('address-city').value.trim(),
        state: document.getElementById('address-state').value.trim(),
        pincode: document.getElementById('address-pincode').value.trim(),
        isDefault: document.getElementById('address-default').checked
    };
}

// Validate address data
function validateAddressData(data) {
    if (!data.fullName || !data.phone || !data.addressLine1 || !data.city || !data.state || !data.pincode) {
        showNotification('Please fill in all required fields', 'error');
        return false;
    }
    
    if (data.pincode.length !== 6 || !/^\d+$/.test(data.pincode)) {
        showNotification('Please enter a valid 6-digit pincode', 'error');
        return false;
    }
    
    if (!/^\+?[\d\s\-\(\)]+$/.test(data.phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }
    
    return true;
}

// Refresh orders
function refreshOrders() {
    loadCurrentOrders();
    showNotification('Orders refreshed!', 'success');
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
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
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

// Search functionality
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        showNotification(`Searching for: ${searchTerm}`, 'info');
    }
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

// Mock password management system
let mockUsers = [];

// Initialize mock users from localStorage
function initializeMockUsers() {
    const savedUsers = localStorage.getItem('mockUsers');
    if (savedUsers) {
        try {
            mockUsers = JSON.parse(savedUsers);
        } catch (e) {
            console.error('Error loading mock users:', e);
            mockUsers = [];
        }
    }
}

// Find user by email
function findUserByEmail(email) {
    return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Update user password
function updateUserPassword(email, newPassword) {
    const userIndex = mockUsers.findIndex(user => user.email.toLowerCase() === email.toLowerCase());
    if (userIndex !== -1) {
        mockUsers[userIndex].password = newPassword;
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
        return true;
    }
    return false;
}

// Initialize mock users when the page loads
initializeMockUsers();
