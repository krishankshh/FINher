# FinHER - Empowering Women Entrepreneurs

FinHER is a comprehensive web platform designed to empower women entrepreneurs by providing a one-stop solution for accessing funding opportunities, financial literacy resources, AI-powered credit evaluation, and alternative financing channels. The platform also features an admin panel for managing content, ensuring that the ecosystem remains secure, up-to-date, and user-friendly.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Server Setup](#server-setup)
  - [Client Setup](#client-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Features

- **User Authentication & OTP-Based Password Reset:**  
  - Secure registration and login with password hashing (using bcrypt).
  - OTP-based password reset to simplify the process without clickable links.

- **Funding Requests Management:**  
  - Create, read, update, and delete funding requests.
  - Only logged-in users can create or modify their requests.
  - Funding requests include detailed information such as entrepreneur name, requested amount, purpose, description, and contact details.

- **Financial Literacy Resources:**  
  - Publicly accessible resources (articles, videos, courses) that can be searched.
  - Only logged-in users can add new resources.
  - Each resource displays the creator’s name and creation date/time.

- **Alternative Financing Channels:**  
  - Information on government schemes, microloans, crowdfunding platforms, and angel networks to help entrepreneurs explore various funding options.

- **Robust AI Credit Evaluation System:**  
  - Simulated AI-powered credit evaluation using multiple inputs (e.g., business revenue, age, collateral value).
  - Provides a credit score and funding recommendation.

- **Admin Panel:**  
  - An admin user (role: `"admin"`) has full website access.
  - Admins can view, update, and delete all funding requests and resources.
  - The admin panel is accessible only to users with admin privileges.

- **Enhanced UI/UX:**  
  - Responsive design using Bootstrap.
  - Smooth page transitions with Framer Motion.
  - Toast notifications via React Toastify for immediate user feedback.
  - Sticky navigation with a modern black-themed NavBar.

---

## Tech Stack

- **Backend:**  
  - Node.js, Express  
  - MongoDB, Mongoose  
  - JWT for authentication  
  - Nodemailer for email-based OTP reset  
  - bcrypt for password hashing

- **Frontend:**  
  - React, React Router  
  - Bootstrap for responsive styling  
  - Framer Motion for animations  
  - React Toastify for notifications  
  - Axios for API calls

---

## Installation

### Server Setup

1. **Clone the repository** and navigate to the server directory:
   ```bash
   cd server
