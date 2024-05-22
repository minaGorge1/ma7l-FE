import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Order.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

export function Order({ arrayProducts, addProduct, deleteProduct }) {

  // result from search
  const [result, setResult] = useState([]);
  // search close
  const [isVisible, setIsVisible] = useState(false);




  //id data
  const [idsData, setIdsData] = useState([]);
  //ids
  const [ids, setIds] = useState(["categoryId", "subcategoryId", "titleId", "brandId", "customerId"])

  //product
  // what input in search
  const [searchQuery, setSearchQuery] = useState('');
  // type product
  const [itemQuery, setItemQuery] = useState('product');
  // products needed
  const [productsDisplay, setProductsDisplay] = useState([])
  //products send
  let [products, setProducts] = useState([]);

  //customer

  const [customerName, setCustomerName] = useState('');
  const [names, setNames] = useState([]);

  //error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    refData()
    getIdsData()

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


  // see in product in cart
  function refData() {
    if (arrayProducts.length > 0) {
      [...new Set(arrayProducts)].forEach((el) => {
        addToProducts(el)
      });

    }
  }

  // handle search
  function handleClick() {
    setIsVisible(false);
  }

  const handleSearchPro = (e) => {
    setSearchQuery(e.target.value);
    search(searchQuery)
  };



  async function search(searchQuery) {

    try {
      let api = `http://127.0.0.1:5000/product?search=${searchQuery}&isDeleted=false`
      const { message, ...resultData } = (await axios.get(api)).data;


      resultData.product = resultData.product.map((el) => {
        for (const id of ids) {
          for (const key in el) {
            if (id === key) {
              const idValue = key.split("I")[0];
              if (idsData[idValue]) {
                el[idValue] = idsData[idValue].find((item) => item._id === el[id]);
              }
            }
          }
        }
        return el;
      });


      setResult(resultData.product);
      console.log(resultData.product)
    } catch (error) {
      setError(error.message);
    }

  }

  //handle search customer

  const handleSearchCus = (value) => {
    setCustomerName(value);
  };

  useEffect(() => {
    if (customerName) {
      const matchingNames = idsData.customer.filter((el) => el.name === customerName);
      setNames(matchingNames);
    } else {
      setNames([]);
    }
  }, [customerName]);

  const options = idsData.customer ? idsData.customer.map((el) => ({
    value: el._id,
    label: el.name,
  })) : [];



  function addToProducts(item) {
    if (!productsDisplay.includes(item)) {
      /* setProductsDisplay(prevProducts => [...prevProducts, item] ); */

      /*   const uniqueItems = new Set(productsDisplay);
        uniqueItems.add(item); 
        setProductsDisplay(Array.from(uniqueItems)); */

      if (!productsDisplay.some(product => item === product)) {
        setProductsDisplay(prev => {
          const newProduct = item
          const filteredProducts = prev.filter(product => product !== item);
          return [...filteredProducts, newProduct];
        });
      }

      if (!products.some(product => item._id === product.productId)) {
        setProducts(prev => {
          const newProduct = {
            productId: item._id,
            quantity: "1",
            discount: "",
            inchPrice: ""
          };
          const filteredProducts = prev.filter(product => product.productId !== item._id);
          return [...filteredProducts, newProduct];
        });
      }

      addProduct(item);
    }
  }

  function deleteToProducts(item) {

    setProductsDisplay(prevProducts => prevProducts.filter(el => el !== item));

    setProducts((prev) => (
      prev.filter(el => el.productId !== item._id)

    ));

    deleteProduct(item)
  }


  return (<div className="Search  position-relative ">
    Order Component

    {/* icon search */}
    <div className=' position-search p-4  col-12' style={{ display: isVisible ? 'block' : 'none' }} >
      <div className=' bg-white rounded-3 p-3 h-100 position-relative icon-search'>

        <div onClick={handleClick} className='position-absolute  top-0 end-0 me-4 fs-2 text-center rounded-5 px-3 mt-3 close-search'>
          x
        </div>

        <br />

        {/* search */}
        <div className="container position-fixed my-4">


          <div className=' justify-content-center align-item-around'>
            <div className='row justify-content-center'>
              <input className="col-2 w-50 form-control m-1"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={handleSearchPro} />

              <div className='col-3  justify-content-around align-items-center d-flex '>




                <button className=" btn btn-primary  "
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

        {/* result */}
        <div className='container  text-white  mt-4'>
          <div className=' justify-content-center align-item-center row'>

            {result?.map((el, i) => <div
              key={i}
              className='col-4 text-decoration-none'>
              <div className='p-2 text-white m-2 h6  bg-black opacity-75 text  item justify-content-center align-item-center row'>
                <div className='col-6 my-2'>
                  <span>name: </span> <span>{el.name}</span>
                </div>

                <div className='col-6 my-2'>
                  <span>brand: </span> <span>{el.brand.name}</span>
                </div>

                <div className='col-6 my-2'>
                  <span>title: </span> <span>{el.title.name}</span>
                </div>

                <div className='col-6 my-2'>
                  <span>category: </span> <span>{el.category.name}</span>
                </div>

                <div className='col-12 my-2'>
                  <span>subcategory: </span> <span>{el.subcategory.name}</span>
                </div>


                <Link to={`http://localhost:3000/subcategorydetils/${el.subcategoryId}/product/${el._id}`} className='col-6 '>
                  <button className='btn btn-success' onClick={() => { }}>data</button>
                </Link>
                <button className='col-6 btn btn-info' onClick={() => {
                  addToProducts(el);
                }}>add</button>

              </div>
            </div>
            )}

          </div>
        </div>


      </div>
    </div>


    <br />




    {/* open search */}
    <div className=' justify-content-center align-content-center row container py-2'>

      <button className=" btn btn-success col-3"
        onClick={() => {
          setIsVisible(true)
        }}>Search Products</button>

    </div>

    <hr />
    {/* custmer name */}

    <div className=' justify-content-between align-content-center row container  py-2'>
      <div className='  row col-8 '>

        <div className='col-3'><span>customer: </span></div>

        <Select
          className="search-dropdown col-5"
          value={customerName}
          onChange={handleSearchCus}
          options={options}
        />


      </div>
    </div>
    <hr />
    {/* take order */}
    <div className='container  text-white rounded p-4 bg-light mt-4'>
      <div className=' justify-content-center align-item-center row'>

        {/* head table */}
        <div className='p-2 text-white  h6  bg-black opacity-75 text  item justify-content-center align-item-center row'>
          <span className=' py-2 col-2 '>name</span>
          <span className=' py-2 col-2 '>Price unit</span>
          <span className=' py-2 col-2 '>realPrice</span>{/*  admin */}
          <span className=' py-2 col-2 '>stock</span>




          <Link className='col-2 '>
            <button className=' btn btn-danger' onClick={() => {
              setProductsDisplay([]);
              setProducts([]);
              deleteProduct();
            }}>Delete All</button>
          </Link>

          <span className=' py-2 col-1 '>final prise</span>
        </div>


        {/* data display in table */}
        {products.length > 0 && [...new Set(productsDisplay)]?.map((el, i) =>
          <div
            key={i}
            className=' text-decoration-none '>
            <div className='p-2 text-white  h6  bg-black opacity-75 text  item justify-content-center align-item-center row'>
              <span className=' py-2 col-2 '>{el.name}</span>
              <span className=' py-2 col-2 '>{el.finalPrice}</span>
              <span className=' py-2 col-2 '>{el.realPrice}</span>{/*  admin */}
              <span className=" col-2  ">
                <input className="w-50 py-2"
                  placeholder={el.stock}
                  value={el?.quantity}
                  onChange={(e) => {

                    setProducts(prev => {
                      const index = prev.findIndex(item => item.productId === el._id);
                      if (index !== -1) {
                        const newArray = [...prev];
                        newArray[index].quantity = e.target.value;
                        return newArray;
                      } else {
                        return prev;
                      }
                    });

                    setProductsDisplay(prev => {
                      const index = prev.findIndex(item => item._id === el._id);
                      if (index !== -1) {
                        const newArray = [...prev];
                        newArray[index].quantity = e.target.value;
                        return newArray;
                      } else {
                        return prev;
                      }
                    });

                  }} />
              </span>





              <Link className='col-2 '>
                <button className=' btn btn-danger' onClick={() => { deleteToProducts(el) }}>delete</button>
              </Link>

              <span className=' py-2 col-1 text-center '>{el.finalPrice * (el?.quantity || products?.find(item => item.productId === el._id)?.quantity || 0)}</span>
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
