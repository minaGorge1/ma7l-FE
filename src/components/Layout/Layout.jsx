import React from 'react';
import PropTypes from 'prop-types';
import Footer from '../Footer/Footer.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = ({ userDate, logout }) => (
  <>
    <Navbar userDate={userDate} logout={logout} />
    <div className='container'>
      <Outlet></Outlet>
    </div>
    <Footer />
  </>
);


export default Layout;
