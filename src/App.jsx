import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home/Home.jsx';
import Layout from './components/Layout/Layout.jsx';
import Login from './components/Login/Login.jsx';
import Products from './components/Products/Products.jsx';
import Register from './components/Register/Register.jsx';
import NotFound from './components/NotFound/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.js';
import CategoryDetils from './components/CategoryDetils/CategoryDetils.jsx';
import Update from './components/Update/Update.jsx';
import Search from './components/Search/Search.jsx';
import Create from './components/Create/Create.jsx';
import Order from './components/Order/Order.jsx';

import Categories from './components/Categories/Categories.jsx';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from "react-router-dom";






function App() {
  const [userData, setUserData] = useState(null);
  const [arrayProducts, setArrayProducts] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('token') != null) {
      saveUserData()
    }
  }, []);

  function saveUserData() {
    let encodedToken = localStorage.getItem("token")
    if (encodedToken) {
      let decodedToken = jwtDecode(encodedToken)
    
      setUserData(decodedToken)
    }
    else {
      setUserData(null)
    }

  }

  //logout


  async function logout() {
    /* if (userData) {
      try {
        await axios.post('http://localhost:5000/auth//log-out', userData)
      } catch (error) {
        console.log(error);
      }
  
    } */

    localStorage.removeItem('token')
    setUserData(null)
    return <Navigate to='/login' />

  }
 
  async function addProduct(pro) {
    if (!arrayProducts.includes(pro)) {
      setArrayProducts(prevProducts => [...prevProducts, pro]);
      
    }
  }
  async function deleteProduct(pro) {
    if (pro) {
     if (arrayProducts.includes(pro)) {
      setArrayProducts(prevProducts => prevProducts.filter(el => el !== pro));
      
    } 
    }else {
      setArrayProducts([])
    }
    
  }


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Layout userData={userData} logout={logout}  arrayProducts={arrayProducts}/>}
        >
          <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route index path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

          <Route path="categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="categorydetils/:categoryId" element={<ProtectedRoute><CategoryDetils /></ProtectedRoute>} />
          <Route path="subcategorydetils/:subcategoryId/product/:productId" element={<ProtectedRoute><Products userData={userData} addProduct={addProduct} /></ProtectedRoute>} />

        

          <Route path="update/:type/:id" element={<ProtectedRoute><Update userData={userData} /></ProtectedRoute>} />
          <Route path="search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="create" element={<ProtectedRoute><Create userData={userData} /></ProtectedRoute>} />
          <Route path="order" element={<ProtectedRoute><Order arrayProducts={arrayProducts} addProduct={addProduct} deleteProduct={deleteProduct}/></ProtectedRoute>} />



          <Route path="login" element={<Login saveUserData={saveUserData} />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
