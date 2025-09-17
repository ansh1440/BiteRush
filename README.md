# BiteRush - Food Delivery Application

A complete food delivery application built with React.js frontend and Spring Boot backend.

## Project Structure

- **adminpanel/adminpanel/** - Admin panel for managing food items and orders
- **userpanel/biterush/** - User interface for ordering food
- **Backend** - Spring Boot API (separate repository)

## Features

### Admin Panel
- Add, update, delete food items
- Manage orders
- Admin authentication

### User Panel
- Browse food items
- Add items to cart
- Place orders
- User authentication with OTP
- Multiple payment options (PayPal, Razorpay)

## Technologies Used

### Frontend
- React.js
- CSS3
- Axios for API calls
- Context API for state management

### Backend
- Spring Boot
- Spring Security
- JWT Authentication
- MySQL Database
- File Upload handling

## Getting Started

### Prerequisites
- Node.js
- Java 11+
- MySQL

### Installation

1. Clone the repository
```bash
git clone https://github.com/ansh1440/BiteRush.git
```

2. Install frontend dependencies
```bash
# For Admin Panel
cd adminpanel/adminpanel
npm install

# For User Panel
cd userpanel/biterush
npm install
```

3. Start the applications
```bash
# Admin Panel
npm start

# User Panel
npm start
```

## Author

**Ansh More**
- GitHub: [@ansh1440](https://github.com/ansh1440)

## License

This project is licensed under the MIT License.