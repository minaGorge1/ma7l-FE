import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './MissingProducts.css';
import axios from 'axios';
import { Link, Navigate, useParams } from 'react-router-dom'

function MissingProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("")
  const [product, setProduct] = useState([]);
  const [disProduct, setDisProduct] = useState([]);

  //id data
  const [idsData, setIdsData] = useState([]);
  //ids
  const [ids, setIds] = useState(["categoryId", "subcategoryId", "titleId", "brandId", "customerId"])


  useEffect(() => {
    setLoading(true)
    getIdsData();
    getDate();
    setLoading(false)

  }, []);


  // get all id data 
  async function getIdsData() {

    try {
      const promises = ids.map(async (el) => {
        el = el.split("I")[0];
        let api = `http://127.0.0.1:5000/${el}?isDeleted=false`;
        const response = await axios.get(api);
        const { message, ...data } = response.data;

        // Process data for each request
        if (message === "Done") {
          setIdsData((prevState) => ({
            ...prevState,
            [el]: data[el],
          }));
        }
      });

      await Promise.all(promises);


    } catch (error) {
      setError(error.message);
    }
    finally {

    }
  }

  async function getDate(title = "657c656b1935a2a5ad47c237", num = 30) {

    try {
      setTitle(title)
      setLoading(true)
      let api = `http://127.0.0.1:5000/product?stock[lt]=${num}&titleId=${title}&isDeleted=false`
      const { message, ...resultData } = (await axios.get(api)).data;

      if (message === "Done" && resultData.product.length > 0) {
        const processedData = resultData.product.map((el) => {
          const transformedProduct = { ...el };
          Object.entries(el).forEach(([key, value]) => {
            if (ids.includes(key)) {
              const idValue = key.split("I")[0];
              transformedProduct[idValue] = idsData[idValue]?.find((item) => item._id === value);
            }
          });
          return transformedProduct;
        });
        setProduct(processedData);
      }

      if (product[0]?.brand) {
        setLoading(false)
      }

    } catch (error) {
      setError(error.response.data.message);
    }
    finally {
      /* setLoading(false) */
    }

  }



  return <div className="MissingProducts counter mb-5">
    MissingProducts Component


    <div className='m-4'>
      <span className='col-5 fs-4'>title </span>
      <span><div className=" dropdown col-5">
        <div className="nav-item dropdown btn btn-outline-success">
          <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            title
          </Link>
          <ul className="dropdown-menu">
            {idsData?.title?.map((e, Key) => (
              <button key={Key} onClick={() => getDate(e.id)}
                className="dropdown-item w-75 d-block text-start mx-3">
                {e.name}
              </button>
            ))}
          </ul>
        </div>
      </div></span>

    </div>

    <div className=''>

      {/* table info */}
      <div>

        <div className='py-2 text-white h6 bg-black  text item justify-content-between align-item-center row'>
          <span className='py-2 col-1 text-center '>Name</span>
          <span className='py-2 col-1 text-center '>Type</span>
          <span className='py-2 col-1 text-center '>Title</span>
          <span className='py-2 col-1 text-center '>category</span>
          <span className='py-2 col-2 text-center '>subcategory</span>
          <span className='py-2 col-1 text-center '>brand</span>
          <span className='py-2 col-1 text-center '>Final Price</span>
          <span className='py-2 col-1 text-center '>Real Price</span>{/*  admin */}
          <span className='py-2 col-1 text-center rounded-5'>Stock</span>
          <span className='py-2 col-1 text-center rounded-5'></span>
          <span className='py-2 col-1 text-center rounded-5'></span>
        </div>

      </div>



      {loading ? (
        <div className="text-center">
          <span>Loading products...</span>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        [...new Set(product)].map((el) => (
          <div key={el._id} className="p-1">
            <div className="p-1 fs-5 text-white bg-black opacity-75 item justify-content-between align-item-center row rounded-3">
              <span className="py-2 col-1 text-center">{el.name}</span>
              <span className="py-2 col-1 text-center">{el.Type}</span>
              <span className="py-2 col-1 text-center">{el.title?.name}</span>
              <span className="py-2 col-1 text-center">{el.category?.name}</span>
              <span className="py-2 col-2 text-center">{el.subcategory?.name}</span>
              <span className="py-2 col-1 text-center">{el.brand?.name}</span>
              <span className="py-2 col-1 text-center">{el.finalPrice}</span>
              <span className="py-2 col-1 text-center realPrice">{el.realPrice}</span>
              <span className="py-2 col-1 text-center border-danger border-bottom-4">{el.stock}</span>

              <span className="py-2 col-1 text-center rounded-5">
                <Link to={`http://localhost:3000/subcategorydetils/${el?.subcategory?.id}/product/${el._id}`}>
                  <button className="btn btn-success" onClick={() => { }}>
                    data
                  </button>
                </Link>
              </span>

              <span className="py-2 col-1 text-center">
                <Link className="btn btn-primary" to={`http://localhost:3000/update/product/${el._id}`}>
                  Edit
                </Link>
              </span>
            </div>
          </div>
        ))
      )}


    </div>

  </div>
}



MissingProducts.propTypes = {};

MissingProducts.defaultProps = {};

export default MissingProducts;
