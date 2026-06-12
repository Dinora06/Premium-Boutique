# Premium Boutique

A Premium FullStack Ecommerce Clothing App built with **Django** (Backend) and **React** (Frontend).

## About this App
**Premium Boutique** is a modern, fully functional ecommerce platform specialized in clothing for Men, Women, and Children. The platform provides a seamless shopping experience where users can view products, filter by categories, add items to their wishlist, and purchase products using secure payment gateways (Stripe). 

The platform features an intuitive **Admin Dashboard** allowing administrators to:
- Manage Users
- Create, Update, and Delete Products
- View and Manage Orders
- Track Inventory
- Add real-world product images directly through the platform.

## Key Features
- **User Authentication**: Secure JWT-based login and registration system.
- **Product Filtering & Searching**: Users can easily find what they are looking for by using categories or the search bar.
- **Shopping Cart & Checkout**: Integrated checkout process with address selection.
- **Wishlist**: Users can save their favorite items for later.
- **Payments**: Integrated Stripe payments for smooth and secure transactions.
- **Responsive Design**: The website is fully responsive, ensuring a great experience on desktops, tablets, and mobile devices.
- **CI/CD Pipeline**: Fully automated deployment to AWS EC2 using GitHub Actions and Docker.

## Tech Stack
### Frontend
- **React.js**
- **React Router DOM**
- **Redux** (State Management)
- **Axios** (API Requests)
- **Vanilla CSS** (Custom Styling for a premium look)

### Backend
- **Django**
- **Django REST Framework** (DRF)
- **Simple JWT** (Authentication)
- **SQLite / PostgreSQL**
- **Stripe API** (Payments integration)

### Deployment & DevOps
- **Docker & Docker Compose**
- **Nginx** (Reverse Proxy)
- **AWS EC2** (Hosting)
- **GitHub Actions** (CI/CD Pipeline)

---

## Installation & Running Locally

### Backend Setup
1. Open terminal and navigate to the `backend` folder.
2. Create a virtual environment:
   ```bash
   python -m venv env
   ```
3. Activate the environment:
   - Windows: `env\Scripts\activate`
   - Mac/Linux: `source env/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder.
2. Install Node.js packages:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

Happy Coding!
