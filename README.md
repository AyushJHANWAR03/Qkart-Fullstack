# QKart - E-commerce Platform

A full-stack e-commerce platform built with Node.js, Express, MongoDB, and React.

## Features

- User authentication (login/register)
- Product browsing and search
- Shopping cart functionality
- Address management
- Order placement
- Wallet system

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/qkart.git
cd qkart
```

2. Install dependencies:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env
```

4. Start MongoDB:
```bash
# Make sure MongoDB is running on your system
# On macOS/Linux:
mongod

# On Windows:
net start MongoDB
```

5. Import initial data:
```bash
# Run the data import script
node src/scripts/importData.js
```

6. Start the application:
```bash
# Start backend server (in one terminal)
npm start

# Start frontend development server (in another terminal)
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8082

## Default User Credentials

You can use these credentials to test the application:
- Email: crio-user@gmail.com
- Password: criouser123

## API Endpoints

### Authentication
- POST /v1/auth/register - Register a new user
- POST /v1/auth/login - Login user

### Products
- GET /v1/products - Get all products
- GET /v1/products/:id - Get product by ID

### Cart
- GET /v1/cart - Get user's cart
- POST /v1/cart - Add product to cart
- PUT /v1/cart - Update product quantity
- DELETE /v1/cart/:productId - Remove product from cart
- PUT /v1/cart/checkout - Checkout cart

### User
- GET /v1/users/:userId - Get user details
- PUT /v1/users/:userId - Update user address
- GET /v1/users/:userId/addresses - Get user's addresses
- POST /v1/users/:userId/addresses - Add new address
- DELETE /v1/users/:userId/addresses/:addressId - Delete address

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
