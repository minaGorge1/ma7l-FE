import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Search.css';



function Search() {
  //brand - product  - order - subcategory - category - title - customers

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [result, setResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemQuery, setItemQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(["brand", "product", "subcategory", "category", "title", "customer"])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  function handleFilter(item) {
    setItemQuery(item)
    search(searchQuery, item)
  }

  async function search(searchQuery, item = "product") {

    try {
      let api = `http://127.0.0.1:5000/${item}?search=${searchQuery}`
      const { message, ...resultData } = (await axios.get(api)).data;

      let data = Object.values(resultData)
      setResult(data);
    } catch (error) {
      setError(error.message);
    }

  }


  return (<div className="Search">
    Search Component




    <div className="container">

      <div className=' justify-content-center align-item-around'>
        <div className='row justify-content-center'>
          <input className="col-3 w-50 form-control m-1"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchQuery}
            onChange={handleSearch} />

          <div className='col-3  justify-content-around align-items-center d-flex '>

            {/* filter */}
            <div className=" dropdown">
              <div className="nav-item dropdown btn btn-outline-primary">
                <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Dropdown
                </Link>
                <ul className="dropdown-menu">
                  {filteredProducts.map((item) => (
                    <button key={item} onClick={() => handleFilter(item)}
                      className="dropdown-item w-75 d-block text-start mx-3">
                      {item}
                    </button>
                  ))}
                </ul>
              </div>
            </div>


            {/* search */}
            <button className=" btn btn-primary "
              onClick={() => {
                if (itemQuery) {
                  search(searchQuery, itemQuery)
                }
              }}>Search</button>

          </div>
        </div>
      </div>
    </div>

    <br />
    <br />
    <br />

    <div className='container  text-white rounded p-4'>
      <div className=' justify-content-center align-item-center row'>

        {result[0]?.map((el, i) => <Link
          to={`http://localhost:3000/update/${itemQuery}/${el._id}`}
          key={i}
          className='col-4 text-decoration-none'>
          <div className='p-2 text-white m-2 h6  bg-black opacity-75 text  item'>
           <p>{el.name}</p> 
          </div>
        </Link>
        )}

      </div>
    </div>
    {error ? (
      <p>Error: {error}</p>
    ) : null}

  </div>
  )
};







Search.propTypes = {};

Search.defaultProps = {};

export default Search;
