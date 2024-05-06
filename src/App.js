import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import NavBar from "./components/navBar";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Products from "./components/Pages/user/Products";
import Admin from "./components/Pages/admin/Admin";
import Product from "./components/Pages/user/Product";
import Login from "./components/Pages/user/Login";
import Register from "./components/Pages/user/Register";


function App() {
  return (
    <Router>
      <ToastContainer />
      <NavBar />
      <Routes>
        <Route key="/products" exact path="/" element={<Products />} />
        <Route key="/product/id" exact path="/product/:id" element={<Product />} />
        <Route key="/admin" exact path="/admin" element={<Admin />} />
        <Route key="/login" exact path="/login" element={<Login />} />
        <Route key="/register" exact path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
