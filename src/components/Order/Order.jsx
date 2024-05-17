import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Order.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

export function Order({ arrayProducts }) {

  useEffect(() => {
    if (arrayProducts[0]) {
      console.log(arrayProducts);
      addToProducts(arrayProducts[0])
    }

  }, []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [result, setResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemQuery, setItemQuery] = useState('');
  const [products, setProducts] = useState([])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    search(searchQuery)
  };

  async function search(searchQuery) {

    try {
      let api = `http://127.0.0.1:5000/product?search=${searchQuery}&isDeleted=false`
      const { message, ...resultData } = (await axios.get(api)).data;
      setResult(resultData.product);
    } catch (error) {
      setError(error.message);
    }

  }


  async function getArrayData(array) {
    try {
      const promises = array?.map(async (el) => {
        const api = `http://127.0.0.1:5000/product?_id=${el}`;
        const response = await axios.get(api);
        const { message, ...data } = response.data;
        console.log(data.product[0]);
        // Process data for each request
        if (message === "Done") {
          setProducts((prev) => [...prev, data.product[0]]);
        }
      });

      await Promise.all(promises);

    } catch (error) {
      setError(error.message);
    } finally {
      // Clean up or perform any necessary actions after the promises have settled
    }
  }

  function addToProducts(item) {
    setProducts(prevProducts => [...prevProducts, item]);
  }

  function deleteToProducts(item) {
    setProducts(prevProducts => prevProducts.filter(el => el !== item));
  }



  return (<div className="Search my-5 py-3">
    Order Component




    <div className="container ">

      <div className=' justify-content-center align-item-around'>
        <div className='row justify-content-center'>
          <input className="col-3 w-50 form-control m-1"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchQuery}
            onChange={handleSearch} />

          <div className='col-3  justify-content-around align-items-center d-flex '>



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


    <div className='container  text-white rounded p-4'>
      <div className=' justify-content-center align-item-center row'>

        {result?.map((el, i) => <div
          key={i}
          className='col-4 text-decoration-none'>
          <div className='p-2 text-white m-2 h6  bg-black opacity-75 text  item justify-content-center align-item-center row'>
            <p className='col-4 my-2'>{el.name}</p>
            <Link to={`http://localhost:3000/update/${itemQuery}/${el._id}`} className='col-4 '>
              <button className='btn btn-success' onClick={() => { }}>data</button>
            </Link>
            <button className='col-4 btn btn-info' onClick={() => { addToProducts(el) }}>add</button>
          </div>
        </div>
        )}

      </div>
    </div>
    {error ? (
      <p>Error: {error}</p>
    ) : null}


    <div className='container  text-white rounded p-4 bg-light mt-4'>
      <div className=' justify-content-center align-item-center row'>


        <div className='p-2 text-white  h6  bg-dark opacity-75 text  item justify-content-center align-item-center row'>
          <span className=' py-2 col-2 '>name</span>
          <span className=' py-2 col-2 '>finalPrice</span>
          <span className=' py-2 col-2 '>realPrice</span>{/*  admin */}
          <span className=' py-2 col-2 '>stock</span>




          <Link className='col-2 '>
            <button className=' btn btn-danger' onClick={() => { setProducts([]) }}>Delete All</button>
          </Link>

          <button className='col-1 btn btn-info' onClick={() => { /* products.push(el)  */ }}>add</button>
        </div>



        {products?.map((el, i) => <div
          key={i}
          className=' text-decoration-none'>
          <div className='p-2 text-white  h6  bg-black opacity-75 text  item justify-content-center align-item-center row'>
            <span className=' py-2 col-2 '>{el.name}</span>
            <span className=' py-2 col-2 '>{el.finalPrice}</span>
            <span className=' py-2 col-2 '>{el.realPrice}</span>{/*  admin */}
            <span className=" col-2  ">
              <input className="w-50 py-2"
                placeholder={el.stock}
               /*  value={searchQuery} */
             /*    onChange={handleSearch} */ />
            </span>


            {/*  <input className="py-2 col-2 w-50 "
              placeholder={el.stock}
              value={searchQuery}
              onChange={handleSearch} /> */}




            <Link className='col-2 '>
              <button className=' btn btn-danger' onClick={() => { deleteToProducts(el) }}>delete</button>
            </Link>

            <button className='col-1 btn btn-info' onClick={() => { products.push(el) }}>add</button>
          </div>
        </div>
        )}

      </div>
    </div>
    {error ? (
      <p>Error: {error}</p>
    ) : null}



  </div>)
};

Order.propTypes = {};

Order.defaultProps = {};

export default Order;
