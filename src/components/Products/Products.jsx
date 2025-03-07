import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Products.css';
import { Link, Navigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Products({ userData, addProduct }) {


  let { productId } = useParams()
  let navigate = useNavigate()
  let headers = {
    "authorization": `Min@__${localStorage.getItem("token")}`
  }

  const [product, setProduct] = useState({});
  const [productsRla, setProductsRla] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProduct(productId)
  }, [productId]);



  async function getProduct(productId) {
    try {

      let api = `http://127.0.0.1:5000/product?_id=${productId}`
      const { data } = await axios.get(api);
      if (data.product.length === 0) {
        alert('product not found')
        navigate('/')
      }
      setProduct(data.product[0]);

      getProducts(data.product[0]?.subcategoryId, data.product[0])

      getBrand(data.product[0]?.brandId)
      getCategory(data.product[0]?.categoryId)
      getSubcategory(data.product[0]?.subcategoryId)
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }


  async function getProducts(subcategoryId, realPro) {
    try {
      let api = `http://127.0.0.1:5000/product?subcategoryId=${subcategoryId}`
      const { data } = await axios.get(api);

      let filteredProducts = data.product.filter(el => el.name !== realPro.name);
      setProductsRla(filteredProducts);

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }


  async function getBrand(brandId) {
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

  async function getCategory(categoryId) {
    try {

      let api = `http://127.0.0.1:5000/category?_id=${categoryId}`
      const { data } = await axios.get(api);
      setProduct((prevProduct) => ({ ...prevProduct, category: data.category[0] }));
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  async function getSubcategory(subcategoryId) {
    try {

      let api = `http://127.0.0.1:5000/subcategory?_id=${subcategoryId}`
      const { data } = await axios.get(api);
      setProduct((prevProduct) => ({ ...prevProduct, subcategory: data.subcategory[0] }));
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
      console.log(error.message);
      setError(error.message);
      setLoading(false);
    }
  }





  //details
  return <div className="Products container mb-5">


    <div className='  justify-content-around align-item-center'>
      <div className='row justify-content-around'>

        {/* left icon */}
        <div className='col-5 bg-body-tertiary border py-2 rounded my-3 '>
          <p className='fs-3 px-3'>product info</p>
          <hr className='mx-3 w-75' />
          <div className='px-3 fs-5'>
            <span>id : {product?._id}</span>
            <br />
            <span>name :</span> <span>{product?.name}</span>
            <br />
            <span>stock :</span> <span>{product?.stock}</span>
            <br />
            <span>place :</span> <span>{product?.place}</span>
            <br />


            {userData && userData.role === "Admin" && (
              <div className=''>
                <span>realPrice :</span> <span className='realPrice text-danger'>{product?.realPrice}</span>
                <br />
              </div>
            )}
            <span>finalPrice :</span> <span>{product?.finalPrice}</span>

            <br />
            {product.description ? <><span>description :</span> <span>{product?.description}</span></> : ""}

            <br />
            <br />
            <div className='justify-content-center align-item-center row'>
              {userData && userData.role === "Admin" && (
                <div className=' col-8'>
                  <button className=' btn btn-primary me-2' onClick={() => { navigate(`../update/product/${product.id}`) }}> Edit</button>
                  {/* <button className=' btn btn-success me-2'> create</button> */}
                  <button className=' btn btn-danger' onClick={deleteData}> delete</button>

                </div>
              )}
              <button
                className=' btn btn-success me-2 col-3'
                onClick={() => {
                  addProduct(product);
                  navigate("../order");

                }}
              > add</button>


            </div>
          </div>

          <div >
            <hr className='mx-3 ' />
            <p className='fs-3 pt-3 px-3 my-3'>Related products </p>

            <div className='justify-content-between align-item-center p-3 m-3'>

              <div className='row justify-content-between'>
                {productsRla?.map((pro, key) => {
                  return (
                    <Link className='p-1 col-2 item' key={key} to={`../product/${pro._id}`}>
                      <button
                        className='h6 btn btn-outline-primary '
                      >
                        {pro.name}
                      </button>
                    </Link>

                  );
                })}
              </div>

            </div>

          </div>

        </div>


        {/* right icon */}
        <div className='col-5 border rounded my-3 py-2'>

          {/* display brand  */}
          <div className=' bg-body-tertiary border  rounded mt-3'>
            <p className='fs-3 px-3'>brand info</p>
            <hr className='mx-3 w-75' />
            <div className='p-3 fs-5'>
              <span>brand name :</span> <span>{product?.brand?.name}</span>
              <br />
              {product?.brand?.description && (
                <>
                  <span>description :</span> <span>{product.brand.description}</span>
                </>
              )}
              {userData && userData.role === "Admin" && (
                <span className=' justify-content-end align-content-center row'>
                  <span className='col-3'>
                    <button className=' btn btn-primary me-2' onClick={() => { navigate(`../update/brand/${product.brand._id}`) }}> Edit brand </button>

                  </span>

                </span>)}
            </div>
          </div>

          {/* display category  */}
          <div className=' bg-body-tertiary border p-2 rounded mt-3'>
            <p className='fs-3 px-3'>category info</p>
            <hr className='mx-3 w-75' />
            <div className='p-3 fs-5'>
              <span>category name :</span> <span>{product?.category?.name}</span>
              <br />
              {product?.category?.description && (
                <>
                  <span>description :</span> <span>{product.category.description}</span>
                </>
              )}
              {userData && userData.role === "Admin" && (
                <span className=' justify-content-end align-content-center row'>
                  <span className='col-3'>
                    <button className=' btn btn-primary me-2' onClick={() => { navigate(`../update/category/${product.category._id}`) }}> Edit category </button>

                  </span>

                </span>)}
            </div>
          </div>

          {/* display subcategory  */}

          <div className=' bg-body-tertiary border p-2 rounded mt-3'>
            <p className='fs-3 px-3'>subcategory info</p>
            <hr className='mx-3 w-75' />
            <div className='p-3 fs-5'>
              <span>subcategory name :</span> <span>{product?.subcategory?.name}</span>

              {product?.subcategory?.description && (
                <>
                  <br />
                  <span>description :</span> <span>{product.subcategory.description}</span>
                </>
              )}

              {product?.subcategory?.details?.inchPrice && (
                <>
                  <br />
                  <span>inch Price :</span> <span>{product.subcategory?.details?.inchPrice} El</span>
                </>
              )}
              {userData && userData.role === "Admin" && (
                <span className=' justify-content-end align-content-center row'>
                  <span className='col-3'>
                    <button className=' btn btn-primary me-2' onClick={() => { navigate(`../update/subcategory/${product.subcategory._id}`) }}> Edit subcategory </button>

                  </span>

                </span>)}
            </div>
          </div>

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
