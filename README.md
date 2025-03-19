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


2. Install dependencies:

    ```bash
    npm install

3. Create a .env file in the server folder with the following variables (replace placeholders with your credentials):

    ```bash
    MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
    JWT_SECRET=your_jwt_secret
    EMAIL_USER=yourgmail@gmail.com
    EMAIL_PASS=your_app_password

4. Start the server:

    ```bash
    npm run dev


### Client Setup
1. Navigate to the client directory:

    ```bash
    cd client

2. Install dependencies:

    ```bash
    npm install

3. Ensure your client/package.json includes a proxy:

    ```json
    {
    "proxy": "http://localhost:5000"
    }

4. Start the React app:

    ```bash
    npm start

--

## Usage
Authentication:
Users can register, log in, and reset their passwords using OTP. The JWT token stores the user role.

Funding Requests:
Logged-in users can create and manage funding requests. Admins have the ability to manage all requests.

Financial Literacy Resources:
Everyone can view resources and search by title or description. Only logged-in users can add new resources, which display the creator's name and creation date.

Alternative Financing:
View information on various alternative financing channels.

AI Credit Evaluation:
Access a simulated AI tool that calculates a credit score and provides a funding recommendation.

Admin Panel:
Admin users can log in (with role: "admin") to access the admin dashboard for managing all funding requests and resources.

--

Project Structure

    ```bash
    Copy
    Edit
    FinHER/
    ├── client/
    │   ├── public/
    │   ├── src/
    │   │   ├── App.js
    │   │   ├── NavBar.js
    │   │   ├── AdminDashboard.js
    │   │   ├── Auth.js
    │   │   ├── Home.js
    │   │   ├── Dashboard.js
    │   │   ├── CreditEvaluation.js
    │   │   ├── FinancialLiteracy.js
    │   │   ├── AlternativeFunding.js
    │   │   ├── FundingRequestDetail.js
    │   │   ├── ForgotPasswordOTP.js
    │   │   ├── ResetPassword.js
    │   │   └── ...other components
    │   └── package.json
    ├── server/
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── FundingRequest.js
    │   │   ├── AlternativeFundingOption.js
    │   │   └── FinancialLiteracyResource.js
    │   ├── routes/
    │   │   ├── literacyRoutes.js
    │   │   └── ...other route files
    │   ├── middleware/
    │   │   └── authMiddleware.js
    │   ├── server.js
    │   └── package.json
    ├── .env (in server/)
    └── README.md

--

Future Enhancements
Enhanced UI/UX:
Continue to refine animations, transitions, and visual design for a smoother user experience.

Advanced AI Integration:
Replace the simulated credit evaluation with a real ML model or integrate external credit scoring APIs.

Expanded Admin Features:
Add detailed content moderation and analytics in the admin panel.

User Feedback:
Implement feedback forms or surveys to gather insights and further improve the platform.

--

License

    ```bash
    This project is open source and available under the MIT License.