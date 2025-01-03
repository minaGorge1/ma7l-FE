import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import DayIncome from './components/dayIncome/dayIncome'
import MissingProducts from './components/MissingProducts/MissingProducts'
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

/* const fs = window.require("fs")
const pathModule = window.require("path")
const { app } = window.require("@electron/remote")

const formatSize = (size) => {
  if (size === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; */

function App() {
  /* const [path, setPath] = useState(app.getAppPath())

  const files = useMemo(
    () =>
      fs
        .readdirSync(path)
        .map(file => {
          const stats = fs.statSync(pathModule.join(path, file))
          return {
            name: file,
            size: stats.isFile() / formatSize(stats.size ?? 0) : null,
            directory: stats.isDirectory()
          }
        }).sort((a, b) => {
          if (a.directory === b.directory) {
            return a.name.localCompare(b.name)
          }
          return a.directory ? -1 : 1
        })
      [path]
  )
    const onBack = () => setPath(pathModule.dirname(path))
    const onOpen = folder => setPath(pathModule.join(path, folder))

    const [searchString , setSearchString] = useState('');
    const filteredFiles = files.filters(s => s.name.startWith(searchString))
  */
  /* const [files, setFiles] = useState([]);
  const appPath = app.getAppPath();

  useEffect(() => {
    const readFiles = () => {
      try {
        const fileNames = fs.readdirSync(appPath);
        const fileDetails = fileNames.map(file => {
          const filePath = pathModule.join(appPath, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: stats.isFile() ? formatSize(stats.size) : null,
            directory: stats.isDirectory(),
          };
        }).sort((a, b) => {
          if (a.directory === b.directory) {
            return a.name.localeCompare(b.name); // Corrected from localCompare to localeCompare
          }
          return a.directory ? -1 : 1; // Directories first
        });

        setFiles(fileDetails);
      } catch (error) {
        console.error('Error reading files:', error);
      }
    };

    readFiles();
  }, [appPath]); */

  const [userData, setUserData] = useState(null);
  const [arrayProducts, setArrayProducts] = useState([]);
  //customer
  const [customerApp, setCustomer] = useState({})

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

  async function setCustomerApp(value) {
    setCustomer(value)
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
          <Route path="order" element={<ProtectedRoute><Order userData={userData} arrayProducts={arrayProducts} addProduct={addProduct} deleteProduct={deleteProduct} setCustomerApp={setCustomerApp} customerApp={customerApp} /></ProtectedRoute>} />

          <Route path="history" element={<ProtectedRoute><History userData={userData} /></ProtectedRoute>} />
          <Route path="dayincome" element={<ProtectedRoute><DayIncome userData={userData} /></ProtectedRoute>} />
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