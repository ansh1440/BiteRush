# 🍕 BiteRush - Food Delivery Platform

> A modern, full-stack food delivery application featuring React.js frontend and Spring Boot backend with comprehensive admin and user management systems.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Author](#author)

## ✨ Features

### 🔧 Admin Panel
- **Food Management**: Create, read, update, and delete food items
- **Order Management**: Track and manage customer orders
- **Secure Authentication**: Admin login with JWT tokens
- **File Upload**: Image management for food items

### 👤 User Panel
- **Food Catalog**: Browse and search food items by categories
- **Shopping Cart**: Add/remove items with quantity management
- **Order Placement**: Seamless checkout process
- **OTP Authentication**: Secure user registration and login
- **Payment Integration**: Razorpay payment gateway
- **Order Tracking**: Real-time order status updates

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **CSS3** - Styling
- **Axios** - HTTP client
- **Context API** - State management
- **React Router** - Navigation

### Backend
- **Spring Boot** - Java framework
- **Spring Security** - Authentication & authorization
- **JWT** - Token-based authentication
- **MySQL** - Database
- **Maven** - Dependency management
- **Multipart File Upload** - Image handling

## 📁 Project Structure

```
BiteRush/
├── adminpanel/adminpanel/     # Admin dashboard
│   ├── src/
│   ├── public/
│   └── package.json
├── userpanel/biterush/        # Customer interface
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/                   # Spring Boot API
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── pom.xml
└── README.md
```

## 📋 Prerequisites

Ensure you have the following installed:

- **Node.js** (v14.0 or higher)
- **npm** or **yarn**
- **Java** (JDK 11 or higher)
- **Maven** (v3.6 or higher)
- **MySQL** (v8.0 or higher)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ansh1440/BiteRush.git
cd BiteRush
```

### 2. Database Setup
```sql
CREATE DATABASE biterush;
USE biterush;
```

### 3. Backend Setup
```bash
cd backend
# Configure database in src/main/resources/application.properties
mvn clean install
mvn spring-boot:run
```

### 4. Frontend Setup

**Admin Panel:**
```bash
cd adminpanel/adminpanel
npm install
npm start
```

**User Panel:**
```bash
cd userpanel/biterush
npm install
npm start
```

## 🎯 Usage

- **Admin Panel**: http://localhost:3000
- **User Panel**: http://localhost:3001
- **Backend API**: http://localhost:8080

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-otp` - OTP verification

### Food Management
- `GET /api/foods` - Get all food items
- `POST /api/foods` - Create food item (Admin)
- `PUT /api/foods/{id}` - Update food item (Admin)
- `DELETE /api/foods/{id}` - Delete food item (Admin)

### Order Management
- `POST /api/orders` - Place order
- `GET /api/orders/user/{userId}` - Get user orders
- `GET /api/orders` - Get all orders (Admin)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Ansh More**
- GitHub: [@ansh1440](https://github.com/ansh1440)
- LinkedIn: [Connect with me](https://linkedin.com/in/ansh-more)

---

⭐ **Star this repository if you found it helpful!**

