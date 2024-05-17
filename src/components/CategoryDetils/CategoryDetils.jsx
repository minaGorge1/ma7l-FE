import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './CategoryDetils.css';
import { Link, useParams } from 'react-router-dom'
import axios from "axios";

//http://127.0.0.1:5000/subcategory?categoryId={subcategory.category._id}
//http://127.0.0.1:5000/product?subcategoryId={subcategory._id}

function CategoryDetils() {

  let { categoryId } = useParams()

  const [subcategories, setSubcategoryies] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSubcategory(categoryId);
    getProducts(categoryId)
  }, []);

  async function getSubcategory(categoryId) {
    try {
      const { data } = await axios.get(`http://127.0.0.1:5000/subcategory?categoryId=${categoryId}&isDeleted=false`);
      setSubcategoryies(data.subcategory);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }


  async function getProducts(categoryId, subcategoryId = null) {
    try {
      let api = `http://127.0.0.1:5000/product?categoryId=${categoryId}&isDeleted=false`
      if (subcategoryId) {
        api = `http://127.0.0.1:5000/product?categoryId=${categoryId}&subcategoryId=${subcategoryId}&isDeleted=false`
      }
      const { data } = await axios.get(api);
      setProducts(data.product);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return <div className="CategoryDetils container">

    <br />
    <br />
    <br />

    <div className='w-75 container align-items-center justify-content-center bg-body-tertiary p-3 border border-2 rounded'>
      <div className='row justify-content-center'>

        {subcategories?.map((subcategory, i) => <div key={i} className='col-2'>
          <button onClick={() => { getProducts(categoryId, subcategory._id) }} className='py-1 h6 btn btn-outline-primary item'>
            {subcategory.name}
          </button></div>

        )}

      </div>
    </div>

    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />

    <div className='row align-items-center justify-content-center bg-body-tertiary p-3 border border-2 rounded '>

      {products?.map((products, i) => <Link key={i} className='col-1'
        to={'/subcategorydetils/' + categoryId + '/products/' + products.id}>
        <button className='py-1 h6 btn btn-outline-dark item'>
          {products.name}
        </button></Link>
      )}
    </div>


    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p>Error: {error}</p>
    ) : null}

   
  </div>
}

CategoryDetils.propTypes = {};

CategoryDetils.defaultProps = {};

export default CategoryDetils;
