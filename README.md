# AI-Based Car Service Booking and Customer Support Chatbot

A modern web-based car service management platform that allows users to book vehicle services online, manage appointments, and receive instant customer support through an AI-powered chatbot.

---

## 📌 Overview

This project is designed to simplify the vehicle servicing process for both customers and service centers.

The system allows customers to browse available services, book appointments online, track booking status, and communicate with an AI-powered chatbot for quick assistance.

It also provides an admin dashboard for managing services, bookings, customers, and service status updates.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| Online Service Booking | Customers can book vehicle services easily through the platform |
| AI Customer Support Chatbot | Provides instant responses to customer queries |
| Service Management | Admin can add, edit, delete, and update available services |
| Booking Management | Customers can view and manage their bookings |
| Booking Status Tracking | Customers can track current booking progress |
| Admin Dashboard | Manage services, bookings, and customer data |
| JWT Authentication | Secure login and registration system |
| Protected APIs | Only authenticated users can access protected routes |
| Popular Services | Admin can mark selected services as popular |
| Responsive UI | Clean and mobile-friendly user interface |

---

## 🧠 System Workflow

1. User creates an account or logs in  
2. User browses available car services  
3. User selects a service and books an appointment  
4. Booking details are stored in the backend database  
5. User can view booking status from dashboard  
6. Admin manages services and booking requests  
7. AI chatbot provides instant customer support  
8. Booking history and service data are maintained in the system  

---

## 🛠 Tech Stack

### Frontend

| Technology | Usage |
|---|---|
| React | Frontend UI development |
| Tailwind CSS | Styling and responsive design |
| Axios | API communication |
| React Router | Navigation and protected routes |
| Local Storage | JWT token storage |

### Backend

| Technology | Usage |
|---|---|
| Django | Backend framework |
| Django REST Framework | API development |
| Simple JWT | Authentication system |
| SQLite | Database storage |

---

## 🔐 Authentication System

The project uses JWT-based authentication for secure access.

### Implemented Features

- User Signup  
- User Login  
- Access Token & Refresh Token generation  
- Protected APIs using authentication middleware  
- Role-based access for admin and users  

---

## 📊 Service Management

The admin panel supports complete service management.

| Feature | Description |
|---|---|
| Add Service | Create new car service |
| Update Service | Modify service details |
| Delete Service | Remove unwanted service |
| Toggle Popular | Mark service as popular |
| Active / Inactive Status | Control service visibility |

---

## 📅 Booking Management

The system supports booking lifecycle management.

| Feature | Description |
|---|---|
| Create Booking | User can book a service |
| My Bookings | User can view personal bookings |
| Cancel Booking | User can cancel pending bookings |
| Booking Status | View current service progress |
| Update Status | Admin can update booking status |

---

## 🤖 AI Customer Support Chatbot

The chatbot helps users with quick assistance.

### Supported Functions

- Service information  
- Booking guidance  
- General customer queries  
- Instant responses without waiting for staff  

---

## 🎯 Why This Project?

Traditional manual booking systems often create delays, confusion, and poor customer communication.

This system improves service management by providing:

- Faster booking process  
- Better customer experience  
- Reduced manual workload  
- Easy service tracking  
- Centralized digital management  

---

## 🚀 Future Enhancements

| Enhancement | Description |
|---|---|
| Payment Integration | Online payment during booking |
| Service Reminder Notifications | Automatic reminders before appointment |
| Live Vehicle Tracking | Track service progress in real time |
| AI Recommendation System | Suggest services based on vehicle history |

---

## ⚠ Current Limitations

- Online payment is not yet integrated  
- Chatbot currently handles only predefined queries  
- Booking slots are basic and can be expanded further  

---

## 👥 Team Members

| Name | Role | Responsibilities |
|---|---|---|
| Anshida P | Backend Development | Developed APIs, authentication, database integration, service management, and booking management |
| Ajmal M K | Frontend Development | Designed UI, service pages, booking pages, dashboard, and frontend integration |

---

## ▶️ Running the Project

### Clone the Repository

```bash
git clone https://github.com/your-username/car-service-chatbot.git