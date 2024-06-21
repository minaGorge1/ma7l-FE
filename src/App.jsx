import './App.css';
import { BrowserRouter as Router, Routes, Route , useNavigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';
import Products from './components/Products/Products';
import Register from './components/Register/Register';
import NotFound from './components/NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import CategoryDetils from './components/CategoryDetils/CategoryDetils';
import Update from './components/Update/Update';
import Search from './components/Search/Search';
import Create from './components/Create/Create';
import Order from './components/Order/Order';
import History from './components/History/History'
import MissingProducts from './components/MissingProducts/MissingProducts'
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

function App() {
  
  const [userData, setUserData] = useState(null);
  const [arrayProducts, setArrayProducts] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('token') != null) {
      saveUserData()
    }

  }, []);


  function saveUserData() {
    let encodedToken = localStorage.getItem('token');
    if (encodedToken) {
      let decodedToken = jwtDecode(encodedToken);
      setUserData(decodedToken);
    } else {
      setUserData(null);
    }
  }

  async function logout() {
    localStorage.removeItem('token');
    setUserData(null);
    return <Navigate to='/login' />;
  }

  async function addProduct(pro) {
    if (!arrayProducts.includes(pro)) {
      setArrayProducts((prevProducts) => [...prevProducts, pro]);
    }
  }

  async function deleteProduct(pro) {
    if (pro) {
      if (arrayProducts.includes(pro)) {
        setArrayProducts((prevProducts) => prevProducts.filter((el) => el !== pro));
      }
    } else {
      setArrayProducts([]);
    }
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              userData={userData}
              logout={logout}
              arrayProducts={arrayProducts}
            />
          }
        >
          <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route index path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />


          <Route path="categorydetils/:categoryId" element={<ProtectedRoute><CategoryDetils /></ProtectedRoute>} />
          <Route path="product/:productId" element={<ProtectedRoute><Products userData={userData} addProduct={addProduct} /></ProtectedRoute>} />

          <Route path="update/:type/:id" element={<ProtectedRoute><Update userData={userData} /></ProtectedRoute>} />
          <Route path="search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="create" element={<ProtectedRoute><Create userData={userData} /></ProtectedRoute>} />
          <Route path="order" element={<ProtectedRoute><Order arrayProducts={arrayProducts} addProduct={addProduct} deleteProduct={deleteProduct} /></ProtectedRoute>} />

          <Route path="History" element={<ProtectedRoute><History userData={userData}/></ProtectedRoute>} />
          <Route path="missingproducts" element={<ProtectedRoute><MissingProducts /></ProtectedRoute>} />

          <Route path="login" element={<Login saveUserData={saveUserData} />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}


export default App;