# 📸 Instagram Post Management System

A full-stack web application for managing Instagram content, campaigns, clients, and Instagram accounts through a centralized platform.

## 🚀 Overview

The Instagram Post Management System (IPMS) is designed to simplify social media content management by providing role-based dashboards and centralized management of clients, campaigns, content, templates, and Instagram accounts.

The system follows a full-stack architecture with a Spring Boot REST API backend and a React-based frontend.

## ✨ Key Features

- 🔐 JWT-based authentication
- 👥 Role-based access control
- 📊 Role-specific dashboards
- 👤 Client management
- 📢 Campaign management
- 📱 Instagram account management
- 🖼️ Content library management
- 📝 Content template management
- 🔄 REST API integration
- 🔒 AES-256-CBC encryption for Instagram access tokens
- 📄 Pagination and structured API responses
- ⚠️ Global exception handling and validation

## 👨‍💻 User Roles

The application supports multiple roles:

- **ADMIN**
- **ACCOUNT_MANAGER**
- **SOCIAL_MEDIA_MANAGER**
- **CONTENT_CREATOR**
- **ANALYST**
- **CLIENT**
- **TEAM_MEMBER**

Each role is provided with appropriate access and dashboard functionality.

## 🛠️ Tech Stack

### Backend

- Java 17
- Spring Boot
- Spring Data JPA
- Hibernate
- Spring Security
- JWT
- Maven
- MySQL
- MapStruct
- OpenAPI / Swagger
- SLF4J

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- JavaScript

## 🏗️ Project Structure

```text
instagram-post-management-system/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── ipms.code-workspace
