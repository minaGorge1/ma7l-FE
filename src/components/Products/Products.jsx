import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Products.css';
import { Link, useParams } from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Products({ userDate }) {
  let { subcategoryId } = useParams()
  let { productId } = useParams()
  let navigate = useNavigate()
  let headers = {
    "authorization": `Min@__${localStorage.getItem("token")}`
  }

  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProduct(productId)
    getProducts(subcategoryId)
  }, []);



  async function getProduct(productId) {
    try {

      let api = `http://127.0.0.1:5000/product?_id=${productId}`
      const { data } = await axios.get(api);
      if (data.product.length === 0){
        alert('product not found')
        navigate('/')
      }
      setProduct(data.product[0]);
      getbrand(data.product[0]?.brandId)
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  async function getbrand(brandId) {
    try {

      let api = `http://127.0.0.1:5000/brand?_id=${brandId}`
      const { data } = await axios.get(api);
      setProduct((prevProduct) => ({ ...prevProduct, brand: data.brand[0] }));
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  

  async function getProducts(subcategoryId) {
    try {
      let api = `http://127.0.0.1:5000/product?subcategoryId=${subcategoryId}`
      const { data } = await axios.get(api);
      setProducts(data.product);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }


//delete product
  async function deleteData() {

    try {
      let { data } = await axios.delete(`http://localhost:5000/product/${productId}/delete`, { headers })
      if (data.message === 'Done') {
        navigate("/")
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }





  //details
  return <div className="Products container">


    <div className='  justify-content-around align-item-center'>
      <div className='row justify-content-around'>

        <div className='col-5 bg-body-tertiary border p-2 rounded mt-3 '>
          <p className='fs-3 px-3'>product info</p>
          <hr className='mx-3 w-75' />
          <div className='px-3 fs-5'>
            <span>id : {product?._id}</span>
            <br />
            <span>name :</span> <span>{product?.name}</span>
            <br />
            <span>stock :</span> <span>{product?.stock}</span>
            <br />

            {product.description ? <><span>description :</span> <span>{product?.description}</span></> : ""}
            
            {userDate && userDate.role === "Admin" && (
              <div className=''>
                <span>realPrice :</span> <span className='realPrice text-danger'>{product?.realPrice}</span>
                <br />
              </div>
            )}
            <span>finalPrice :</span> <span>{product?.finalPrice}</span>

            <br />
            <br />

            {userDate && userDate.role === "Admin" && (
              <div className=''>
                <button className=' btn btn-primary me-2' onClick={()=>{navigate("../update")}}> Edit</button>
                {/* <button className=' btn btn-success me-2'> create</button> */}
                <button className=' btn btn-danger' onClick={deleteData}> delete</button>
                <br />
              </div>
            )}
          </div>


        </div>

        <div className='col-5 bg-body-tertiary border p-2 rounded mt-3'>
          <p className='fs-3 px-3'>brand info</p>
          <hr className='mx-3 w-75' />
          <div className='px-3 fs-5'>
            <br />
            <span>brand name :</span> <span>{product?.brand?.name}</span>
            <br />
            {product?.brand?.description && (
              <>
                <span>description :</span> <span>{product.brand.description}</span>
              </>
            )}
          </div>
        </div>

        <div>

        </div>


      </div>
    </div>



    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p>Error: {error}</p>
    ) : null}
  </div>
}



Products.propTypes = {};

Products.defaultProps = {};

export default Products;
