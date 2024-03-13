import React from 'react';

import './Navbar.css';
import { Link } from 'react-router-dom';



export default function Navbar({ userDate, logout }) {

  return <>
    <nav className="navbar mb-4 nav-color navbar-expand-lg bg-black-opacity">
      <div className="container-fluid">
        <Link className="navbar-brand fs-3" to="home" >Youssef Henaan</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {userDate !== null ?
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="home" >Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="Update">Update</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="Search">Search</Link>
                </li>
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown
                  </Link>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" >Action</Link></li>
                    <li><Link className="dropdown-item" >Another action</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" >Something else here</Link></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link disabled" aria-disabled="true">Disabled</Link>
                </li>
              </ul>
              <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-dark" type="submit">Search</button>
              </form>
            </>
            : null
          }

          {!userDate ? <>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="login">login</Link>
              </li>
              <li className=" nav-item">
                <Link className="nav-link" to="register">register</Link>
              </li>
            </ul>


          </> : <ul className="m-2 nav-item">
            <button className="btn btn-outline-dark" onClick={logout} type="submit">
              <Link className="nav-link" to="login">logout</Link>
            </button>

          </ul>
          }


        </div>
      </div>
    </nav>
  </>
};

Navbar.propTypes = {};

Navbar.defaultProps = {};


