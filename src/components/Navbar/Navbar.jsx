import React, { useEffect } from 'react';

import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';



export default function Navbar({ userData, logout }) {
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      const expiresAt = userData?.exp;
      const isTokenExpired = Date.now() / 1000 > expiresAt;

      if (isTokenExpired || userData === null) {
        navigate('/login', { replace: true });
        logout()
      }
    }, 7200); // Run the code block every 7200 seconds (2 hours)


    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [userData, navigate]);

  useEffect(() => {
    let timeoutId = null;
    let idleTime = 0;

    const handleIdle = () => {
      idleTime = idleTime + 1;
      if (idleTime >= 300) { // 5 minutes
        // perform actions when user is AFK or browser is frozen
        navigate('/login', { replace: true });
      }
    };

    const handleMouseMove = () => {
      idleTime = 0;
      clearTimeout(timeoutId);
    };

    document.addEventListener('mousemove', handleMouseMove);

    timeoutId = setInterval(handleIdle, 1000); // check every 1 second

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timeoutId);
    };
  }, [navigate]);


  return <>
    <nav className="navbar  nav-color navbar-expand-lg bg-black-opacity">
      <div className="container-fluid">
        <Link className="navbar-brand fs-3" to="home" >Youssef Henaan</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {userData !== null ?
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="home" >Home</Link>
                </li>

                <li className="nav-item">
                  {userData.role === "Admin" ? <>
                    <Link className="nav-link" to="create">Create</Link>
                  </> : null}
                </li>

                <li className="nav-item">
                  {userData.role === "Admin" ? <>
                    <Link className="nav-link" to="dayincome">Day Income</Link>
                  </> : null}
                </li>


                <li className="nav-item">
                  <Link className="nav-link" to="Search">Search</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="history">History</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="missingproducts">Missing Products</Link>
                </li>
                {/* <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown
                  </Link>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" >Action</Link></li>
                    <li><Link className="dropdown-item" >Another action</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" >Something else here</Link></li>
                  </ul>
                </li> */}
                {/* <li className="nav-item">
                  <Link className="nav-link disabled" aria-disabled="true">Disabled</Link>
                </li> */}
                <li className="nav-item mx-4">
                  <Link className="btn btn-light" to="order">Order</Link>
                </li>
              </ul>
              <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-dark" type="submit">Search</button>
              </form>

            </>
            : null
          }

          {!userData ? <>
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


