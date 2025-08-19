document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Clear any error messages when switching tabs
            clearErrorMessages();
        });
    });
    
    const forms = document.querySelectorAll('.form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (form.id === 'signup') {
                handleSignup();
            } else if (form.id === 'login') {
                handleLogin();
            }
        });
    });
    
    // Add forgot password form event listeners
    setupForgotPasswordForms();
    
    // Clear any existing error messages on page load
    clearErrorMessages();
});

function setupForgotPasswordForms() {
    // Forgot OTP form
    const forgotOtpForm = document.getElementById('forgot-otp-form');
    if (forgotOtpForm) {
        forgotOtpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleForgotOTPRequest();
        });
    }
    
    // Forgot OTP verify form
    const forgotVerifyForm = document.getElementById('forgot-verify-form');
    if (forgotVerifyForm) {
        forgotVerifyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleForgotOTPVerify();
        });
    }
    
    // Forgot password reset form
    const forgotResetForm = document.getElementById('forgot-reset-form');
    if (forgotResetForm) {
        forgotResetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleForgotPasswordReset();
        });
    }
}

async function handleSignup() {
    const phone = document.getElementById('signup-phone').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const age = parseInt(document.getElementById('signup-age').value);
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Clear any previous error messages
    clearErrorMessages();
    
    // Validation
    if (!phone || !email || !age || !password || !confirmPassword) {
        showErrorMessage('Please fill in all fields!');
        return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showErrorMessage('Email ID not valid');
        return;
    }
    
    if (password !== confirmPassword) {
        showErrorMessage('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        showErrorMessage('Password must be at least 6 characters long!');
        return;
    }
    
    if (age < 13 || age > 120) {
        showErrorMessage('Please enter a valid age between 13 and 120!');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#signup .submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone: phone.replace(/[\s\-\(\)]/g, ''),
                email: email.toLowerCase(),
                age,
                password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store auth token
            localStorage.setItem('authToken', data.token);
            
            // Store user data in localStorage for profile display
            const userData = {
                currentUser: {
                    id: data.user.id,
                    name: 'New User', // Default name
                    email: data.user.email,
                    phone: data.user.phone,
                    age: data.user.age,
                    isLoggedIn: true,
                    addresses: [],
                    orders: []
                }
            };
            localStorage.setItem('shopHubPreferences', JSON.stringify(userData));
            
            // Add user to mock system for password management
            const mockUser = {
                id: data.user.id,
                email: data.user.email,
                phone: data.user.phone,
                age: data.user.age,
                password: password // Store the password for validation
            };
            mockUsers.push(mockUser);
            saveMockUsers();
            
            showSuccessMessage('Account created successfully!', () => {
                // Redirect to dashboard or profile page
                window.location.href = '/profile.html';
            });
        } else {
            if (data.error.includes('already exists')) {
                if (data.error.includes('email')) {
                    showErrorMessage('An account with this email already exists. Please login instead or use a different email.');
                } else if (data.error.includes('phone')) {
                    showErrorMessage('An account with this phone number already exists. Please login instead or use a different phone number.');
                } else {
                    showErrorMessage('An account with this email or phone number already exists. Please login instead.');
                }
                // Switch to login tab
                document.querySelector('[data-tab="login"]').click();
            } else {
                showErrorMessage(data.error || 'Registration failed. Please try again.');
            }
        }
    } catch (error) {
        console.error('Registration error:', error);
        showErrorMessage('Network error. Please try again.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Clear any previous error messages
    clearErrorMessages();
    
    if (!email || !password) {
        showErrorMessage('Please fill in all fields!');
        return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showErrorMessage('Email ID not valid');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#login .submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging In...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email.toLowerCase(), 
                password 
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store auth token
            localStorage.setItem('authToken', data.token);
            
            // Store user data in localStorage for profile display
            const userData = {
                currentUser: {
                    id: data.user.id,
                    name: 'User', // Default name
                    email: data.user.email,
                    phone: data.user.phone,
                    age: data.user.age,
                    isLoggedIn: true,
                    addresses: [],
                    orders: []
                }
            };
            localStorage.setItem('shopHubPreferences', JSON.stringify(userData));
            
            // Add user to mock system if not already there
            const existingMockUser = findUserByEmail(data.user.email);
            if (!existingMockUser) {
                const mockUser = {
                    id: data.user.id,
                    email: data.user.email,
                    phone: data.user.phone,
                    age: data.user.age,
                    password: password // Store the password for validation
                };
                mockUsers.push(mockUser);
                saveMockUsers();
            }
            
            showSuccessMessage('Login successful!', () => {
                // Redirect to profile page
                window.location.href = '/profile.html';
            });
        } else {
            // Check if this is a password validation error and validate against mock system
            if (data.error.includes('Invalid password')) {
                // Try to validate against mock system
                const mockUser = findUserByEmail(email);
                if (mockUser && mockUser.password === password) {
                    // Password is correct in mock system, proceed with login
                    // Store auth token (generate a mock token)
                    const mockToken = 'mock_token_' + Date.now();
                    localStorage.setItem('authToken', mockToken);
                    
                    // Store user data in localStorage for profile display
                    const userData = {
                        currentUser: {
                            id: mockUser.id,
                            name: 'User', // Default name
                            email: mockUser.email,
                            phone: mockUser.phone,
                            age: mockUser.age,
                            isLoggedIn: true,
                            addresses: [],
                            orders: []
                        }
                    };
                    localStorage.setItem('shopHubPreferences', JSON.stringify(userData));
                    
                    showSuccessMessage('Login successful!', () => {
                        // Redirect to profile page
                        window.location.href = '/profile.html';
                    });
                    return;
                }
            }
            
            // If we get here, the login failed
            if (response.status === 404 || data.error.includes('not found')) {
                showErrorMessage('Account not found');
                // Switch to signup tab
                document.querySelector('[data-tab="signup"]').click();
            } else if (data.error.includes('Invalid password')) {
                showErrorMessage('Password not valid');
            } else {
                showErrorMessage(data.error || 'Login failed. Please try again.');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showErrorMessage('Network error. Please try again.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function clearErrorMessages() {
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => {
        error.remove();
    });
    
    // Also clear any success messages
    const existingSuccess = document.querySelectorAll('.success-message');
    existingSuccess.forEach(success => {
        success.remove();
    });
}

function showSuccessMessage(message, callback) {
    const messageBox = document.createElement('div');
    messageBox.className = 'success-message';
    messageBox.textContent = message;
    
    document.body.appendChild(messageBox);
    
    setTimeout(() => {
        messageBox.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        messageBox.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(messageBox);
            if (callback) callback();
        }, 300);
    }, 2000);
}

function showErrorMessage(message) {
    const messageBox = document.createElement('div');
    messageBox.className = 'error-message';
    messageBox.textContent = message;
    
    document.body.appendChild(messageBox);
    
    setTimeout(() => {
        messageBox.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        messageBox.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(messageBox);
        }, 300);
    }, 5000);
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const eyeBtn = input.nextElementSibling;
    const icon = eyeBtn.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Forgot Password Functions
function showForgotPassword() {
    document.getElementById('forgot-password-modal').style.display = 'flex';
    showForgotStep(1);
}

function closeForgotPasswordModal() {
    document.getElementById('forgot-password-modal').style.display = 'none';
    // Reset forms
    document.getElementById('forgot-otp-form').reset();
    document.getElementById('forgot-verify-form').reset();
    document.getElementById('forgot-reset-form').reset();
    // Reset steps
    showForgotStep(1);
}

function showForgotStep(step) {
    // Hide all steps
    document.getElementById('forgot-step-1').style.display = 'none';
    document.getElementById('forgot-step-2').style.display = 'none';
    document.getElementById('forgot-step-3').style.display = 'none';
    
    // Show selected step
    document.getElementById(`forgot-step-${step}`).style.display = 'block';
}

function switchToSignup() {
    closeForgotPasswordModal();
    document.querySelector('[data-tab="signup"]').click();
}

async function handleForgotOTPRequest() {
    const phone = document.getElementById('forgot-phone').value.trim();
    
    if (!phone) {
        showErrorMessage('Please enter a valid phone number');
        return;
    }

    // Format phone number
    const formattedPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Show loading state
    const submitBtn = document.querySelector('#forgot-otp-form .btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
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
            sessionStorage.setItem('forgotPhone', formattedPhone);
            
            showSuccessMessage('OTP sent successfully to your phone number!');
            showForgotStep(2);
        } else {
            if (response.status === 404) {
                showErrorMessage('No account found with this phone number. Please create an account first.');
            } else {
                showErrorMessage(data.error || 'Failed to send OTP');
            }
        }
    } catch (error) {
        console.error('Error requesting OTP:', error);
        showErrorMessage('Network error. Please try again.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleForgotOTPVerify() {
    const otpCode = document.getElementById('forgot-otp-code').value.trim();
    const phone = sessionStorage.getItem('forgotPhone');
    
    if (!otpCode || !phone) {
        showErrorMessage('Please enter the OTP and ensure phone number is available');
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('#forgot-verify-form .btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Verifying...';
    submitBtn.disabled = true;

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
            sessionStorage.setItem('forgotResetToken', data.resetToken);
            
            showSuccessMessage('OTP verified successfully!');
            showForgotStep(3);
        } else {
            showErrorMessage(data.error || 'Invalid OTP. Please try again.');
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        showErrorMessage('Network error. Please try again.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleForgotPasswordReset() {
    const newPassword = document.getElementById('forgot-new-password').value;
    const confirmPassword = document.getElementById('forgot-confirm-password').value;
    const resetToken = sessionStorage.getItem('forgotResetToken');
    
    if (!resetToken) {
        showErrorMessage('Reset session expired. Please start over.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showErrorMessage('Passwords do not match');
        return;
    }
    
    if (newPassword.length < 6) {
        showErrorMessage('Password must be at least 6 characters long');
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('#forgot-reset-form .btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Resetting...';
    submitBtn.disabled = true;

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
            showSuccessMessage('Password reset successfully! You can now login with your new password.', () => {
                closeForgotPasswordModal();
                // Clear session storage
                sessionStorage.removeItem('forgotPhone');
                sessionStorage.removeItem('forgotResetToken');
                // Switch to login tab
                document.querySelector('[data-tab="login"]').click();
            });
        } else {
            showErrorMessage(data.error || 'Failed to reset password');
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        showErrorMessage('Network error. Please try again.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

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

// Save mock users to localStorage
function saveMockUsers() {
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
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
        saveMockUsers();
        return true;
    }
    return false;
}

// Initialize mock users when the page loads
initializeMockUsers();
