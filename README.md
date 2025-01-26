# **BIIT Map Server**

The **BIIT Map Server** is a backend system designed for managing geofences, users, vehicles, and real-time tracking. This system supports role-based access control for Admin, Manager, and Employee roles. It is built using **Node.js**, **Express**, and **PostgreSQL**.

---

## **Features**

- Role-based Access Control (Admin, Manager, Employee).
- Geofence Management (create, update, deactivate).
- User and Vehicle Management.
- Real-time Location Tracking.

---

## **Getting Started**

### **Prerequisites**
Ensure you have the following installed:
- **Node.js** (v14 or higher)
- **PostgreSQL**
- **npm** or **yarn**

### **Clone the Repository**
```bash
git clone https://github.com/devfaizanarshad/BIIT-MAP-SERVER.git
cd BIIT-MAP-SERVER
```

### **Install Dependencies**
Install the required Node.js dependencies:
```bash
npm install
```

### **Set Up Environment Variables**
Create a .env file in the root directory and add the following configuration:
```bash
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_NAME=your_database_name
```
### **Run the Server**
Start the development server with:
```bash
node server.js
```

### **Access the Server**
Once the server is running, it will be accessible at:
```bash
http://localhost:3000
``` 





