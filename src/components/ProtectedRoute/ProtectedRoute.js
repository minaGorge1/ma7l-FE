import React from 'react';
import PropTypes from 'prop-types';
import './ProtectedRoute.css';
import { Navigate } from "react-router-dom";

export default function ProtectedRoute(props) {

  if (localStorage.getItem('token') == null) {
    // navigate login  
    return <Navigate to={'/login'} />
  }
  else {
    //navigate
    return props.children;
  }

}

ProtectedRoute.propTypes = {};

ProtectedRoute.defaultProps = {};


/* 
<ProtectedRoute>
  <Home/>
</ProtectedRoute>  // al home at7tt fy al props.children bta3 ProtectedRoute 
 */