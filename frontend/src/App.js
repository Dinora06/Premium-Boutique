import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ProductListPage from './pages/ProductsListPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CheckoutPage from './pages/CheckoutPage'
import NavBar from './components/Navbar'
import PaymentStatus from './components/PaymentStatus'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import CardUpdatePage from './pages/CardUpdatePage'
import CardDetailsPage from './pages/CardDetailsPage'
import AccountPage from './pages/AccountPage'
import AccountUpdatePage from './pages/AccountUpdatePage'
import DeleteUserAccountPage from './pages/DeleteUserAccountPage'
import AllAddressesOfUserPage from './pages/AllAddressesOfUserPage'
import AddressUpdatePage from './pages/AddressUpdatePage'
import OrdersListPage from './pages/OrdersListPage'
import ProductCreatePage from './pages/ProductCreatePage'
import ProductUpdatePage from './pages/ProductUpdatePage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminUsersListPage from './pages/AdminUsersListPage'
import PlaceholderPage from './pages/PlaceholderPage'
import WishlistPage from './pages/WishlistPage'
import NotFound from './pages/NotFoundPage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const App = () => {

  return (
    <div>
      <Router>
        <NavBar />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <div className="container mt-4">
          <Switch>
            <Route path="/" component={ProductListPage} exact />
            <Route path="/new-product/" component={ProductCreatePage} exact />
            <Route path="/product/:id/" component={ProductDetailsPage} exact />
            <Route path="/product-update/:id/" component={ProductUpdatePage} exact />
            <Route path="/product/:id/checkout/" component={CheckoutPage} exact />
            <Route path="/payment-status" component={PaymentStatus} exact />
            <Route path="/login" component={Login} exact />
            <Route path="/register" component={Register} exact />
            <Route path="/wishlist" component={WishlistPage} exact />
            <Route path="/account" component={AccountPage} exact />
            <Route path="/account/update/" component={AccountUpdatePage} exact />
            <Route path="/account/delete/" component={DeleteUserAccountPage} exact />
            <Route path="/stripe-card-details" component={CardDetailsPage} exact />
            <Route path="/stripe-card-update" component={CardUpdatePage} exact />
            <Route path="/all-addresses/" component={AllAddressesOfUserPage} exact />
            <Route path="/all-addresses/:id/" component={AddressUpdatePage} exact />
            <Route path="/all-orders/" component={OrdersListPage} exact />
            <Route exact path="/admin-dashboard" component={AdminDashboardPage} />
            <Route exact path="/admin-users" component={AdminUsersListPage} />
            <Route exact path="/topshirish-punktlari" render={() => <PlaceholderPage title="Topshirish punktlari" />} />
            <Route exact path="/sotuvchi" render={() => <PlaceholderPage title="Sotuvchi bo'lish" />} />
            <Route exact path="/savol-javob" render={() => <PlaceholderPage title="Savol-javob" />} />
            <Route path="" component={NotFound} exact />
          </Switch>
        </div>
      </Router>
    </div >
  )
}

export default App
