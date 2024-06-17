import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Footer from '../Footer/Footer.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import { Outlet, useNavigate } from 'react-router-dom';
import './Layout.css';

const Layout = ({ userData, logout }) => {

  const navigate = useNavigate() 

  /* useEffect(() => {

  const expiresAt = Date.now() + userData?.exp * 1000;
  const isTokenExpired = Date.now() > expiresAt;
  console.log(isTokenExpired); 
  if (isTokenExpired || userData === null) {
    navigate('/login', { replace: true });
  }
}, [10000]); */

return <>
  <Navbar userData={userData} logout={logout} />
  <div className='container'>
    <Outlet></Outlet>
  </div>
  <Footer />
</>
};


export default Layout;
