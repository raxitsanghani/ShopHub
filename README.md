# ShopHub - Modern E-commerce Application

A complete e-commerce application with modern login/signup system and Amazon-style navigation, built with HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.

## Features

✅ **Modern Login & Signup System**
- Phone, email, age, password, and confirm password fields
- Eye icon to toggle password visibility
- Form validation and error handling
- Beautiful success messages with green text in transparent boxes

✅ **Amazon-Style Top Navigation Bar**
- Dark theme with professional design
- Search functionality with category dropdown
- User account management
- Shopping cart with item count
- Language selection
- Delivery location information

✅ **Responsive Dashboard**
- Welcome message after successful login
- Interactive dashboard cards
- Modern card-based layout
- Hover effects and animations

✅ **Backend API**
- User registration and authentication
- JWT token-based security
- MongoDB database integration
- Password hashing with bcrypt
- RESTful API endpoints

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing
- **Styling**: Custom CSS with modern design principles

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
3. **Git** (optional) - [Download here](https://git-scm.com/)

## Installation & Setup

### 1. Clone or Download the Project
```bash
# If using Git
git clone <repository-url>
cd shophub-app

# Or simply download and extract the ZIP file
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up MongoDB
- Start MongoDB service on your machine
- The app will automatically connect to `mongodb://localhost:27017/shopHub`
- Or set a custom MongoDB URI in environment variables

### 4. Environment Variables (Optional)
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/shopHub
JWT_SECRET=your-super-secret-key-here
```

### 5. Start the Application
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 6. Access the Application
Open your browser and navigate to:
- **Login Page**: `http://localhost:3000`
- **Dashboard**: `http://localhost:3000/dashboard`

## Project Structure

```
shophub-app/
├── index.html          # Login/Signup page
├── dashboard.html      # Dashboard page
├── styles.css          # Login page styles
├── dashboard.css       # Dashboard styles
├── script.js           # Login page functionality
├── dashboard.js        # Dashboard functionality
├── server.js           # Node.js backend server
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (protected)

### Static Pages
- `GET /` - Login/Signup page
- `GET /dashboard` - Dashboard page

## Usage

### 1. User Registration
1. Open the application in your browser
2. Click on "Create Account" tab
3. Fill in all required fields:
   - Phone number
   - Email address
   - Age (13-120)
   - Password (minimum 8 characters)
   - Confirm password
4. Click "Create Account"
5. You'll see a success message and be redirected to the dashboard

### 2. User Login
1. Click on "Login" tab
2. Enter your email and password
3. Click "Login"
4. You'll see "Login successfully" message and be redirected to the dashboard

### 3. Dashboard Features
- **Navigation**: Use the Amazon-style top bar for navigation
- **Search**: Use the search bar to find products
- **Categories**: Select from the dropdown menu
- **Interactive Cards**: Click on dashboard cards for more information

## Customization

### Colors and Styling
- Edit `styles.css` for login page styling
- Edit `dashboard.css` for dashboard styling
- All colors are defined as CSS variables for easy customization

### Background Image
- Change the shopping-themed background in `styles.css`
- Update the URL in the `body::before` selector

### Database Schema
- Modify the user schema in `server.js` to add more fields
- Update the frontend forms accordingly

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check if the connection string is correct
   - Verify MongoDB is accessible on the default port (27017)

2. **Port Already in Use**
   - Change the PORT in `.env` file
   - Or kill the process using the current port

3. **Module Not Found Errors**
   - Run `npm install` to install dependencies
   - Check if all dependencies are listed in `package.json`

4. **CORS Issues**
   - The app includes CORS middleware
   - If issues persist, check browser console for errors

### Debug Mode
Run the server in development mode for detailed error logging:
```bash
npm run dev
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin resource sharing protection
- **Environment Variables**: Sensitive data stored in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions:
1. Check the troubleshooting section
2. Review the console logs
3. Ensure all prerequisites are met
4. Create an issue in the repository

---

**Happy Shopping with ShopHub! 🛍️**
