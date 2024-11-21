import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Order.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import joi from 'joi';

export function Order({ arrayProducts, addProduct, deleteProduct }) {

  const headers = {
    "authorization": `Min@__${localStorage.getItem("token")}`
  }

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
  // final price
  const [finalPrice, setFinalPrice] = useState(0);


  //status 
  const [status, setStatus] = useState(['انتظار', 'تم الدفع', 'رفض'])

  //Order
  const [order, setOrder] = useState({});

  //validators
  const validators = {
    noteSchema: joi.string().max(200),
    paidSchema: joi.number().positive(),
    quantitySchema: joi.number().positive().min(1),
    discountSchema: joi.number(),
    inchPriceSchema: joi.number().min(0).positive()
  }


  //error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState({});

  useEffect(() => {
    refData()
    getIdsData()
  }, []);


  useEffect(() => {
    if (products.length > 0) {
      let newFinalPrice = 0;
      let profit = 0;
      let realPrice = 0;

      [...new Set(productsDisplay)]?.reduce((acc, el) => {

        const price = el.finalPriceUnit * (el?.quantity || products?.find(item => item.productId === el._id)?.quantity || 0);
        realPrice += el.realPrice * (el?.quantity || products?.find(item => item.productId === el._id)?.quantity || 0);
        const discount = el?.discount * (el?.quantity || products?.find(item => item.productId === el._id)?.quantity || 0);
        acc[el.name] = price;
        newFinalPrice += price;
        profit += (price - realPrice);
        return acc;
      }, {});

      setFinalPrice(newFinalPrice);

      setOrder((prevOrder) => ({
        ...prevOrder,
        products,
        profitMargin: (prevOrder?.paid || newFinalPrice) - realPrice,

      }));
    }
    /* setOrder({ ...order, profitMargin: .target?.value || finalPrice }); */
  }, [products]);

  //REFRESH component
  function refresh() {
    setProductsDisplay([]);
    setProducts([]);
    deleteProduct();
    setFinalPrice("0")
    setSearchQuery("")
    setResult([])
    getIdsData()
  }

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
      setError(error.response.data.message);
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
  /*   function refData() {
      if (arrayProducts.length > 0) {
        const uniqueProducts = arrayProducts.filter((product, index, self) => {
          return index === self.findIndex((t) => t.id === product.id);
        });
        uniqueProducts.forEach(addToProducts)
      }
    } */

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
      let api = `http://127.0.0.1:5000/product?search=${searchQuery}|name=${searchQuery}&isDeleted=false`
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
    } catch (error) {
      setError(error.response.data.message);
    }

  }

  //handle search customer

  const handleSearchCus = (value) => {
    setOrder(prevOrder => ({ ...prevOrder, customerId: value?.value || " " }))

  };

  //customer name

  const options = idsData.customer ? idsData.customer.map((el) => ({
    value: el._id, // id
    label: el.name, //  aly bizhr
  })) : [];



  //add product and delete

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
            /*     discount: "",
                inchPrice: "" */
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

  //create order

  async function createOrder() {

    try {
      /*  setOrder(prevOrder => ({ ...prevOrder, "ProfitMargin":  })) */
      
      let api = `http://127.0.0.1:5000/order/create`
      const { data } = await axios.post(api, order, { headers });
      if (data.message === "Done") {
        refresh()

        alert("Created Successfully")
      }
    } catch (error) {
      setError(error.response.data.message);
      
    }

  }


  return (<div className="Search position-relative ">
    {/* Order Component */}

    {/* icon search */}
    <div className=' position-search p-4  col-12' style={{ display: isVisible ? 'block' : 'none' }} >
      <div className=' bg-white rounded-3 p-3 h-100 position-relative icon-search'>

        <div onClick={handleClick} className='position-absolute  top-0 end-0 me-4 fs-2 text-center rounded-5 px-3 mt-3 close-search'>
          x
        </div>

        <br />

        {/* search */}
        <div className="container position-fixed my-4">


          <div className=' justify-content-center align-item-around '>
            <div className='row justify-content-center '>
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


                <Link to={`http://localhost:3000/product/${el._id}`} className='col-6 '>
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
          /*  value={customerName} */
          onChange={handleSearchCus}
          options={options}
        />


      </div>
    </div>
    <hr />

    {/* note  + status + paid*/}

    <div className='justify-content-around align-item-center row container'>

      {/* note */}
      <div className="mb-3 col-6">
        <label htmlFor="exampleFormControlTextarea1" className="form-label">Notes</label>
        <textarea
          onChange={(e) => {
            const { error } = validators.noteSchema.validate(e.target?.value);
            if (error) {
              setErrorMessage((prev) => {
                return { ...prev, note: error.details[0].message };
              }
              );
            } else {
              setErrorMessage("");
            }
            setOrder(prevOrder => ({ ...prevOrder, note: e.target?.value || " " }));
          }}
          className="form-control" id="fixedTextarea" rows="3" style={{ resize: "none" }}></textarea>
        {errorMessage.note ?
          <div className=' text-danger mx-2 alert-danger'>{errorMessage.note}</div>
          : <div className='d-blok text-danger m-2 alert-danger'>{errorMessage.note}</div>}
      </div>

      {/* status */}
      <div className="mb-3 col-3 border-start border-end">
        <label htmlFor="exampleFormControlTextarea1" className="form-label">status</label>

        <div className=" dropdown">
          <div className="nav-item dropdown btn btn-outline-primary">
            <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {order.status ? order.status : "Dropdown"}
            </Link>
            <ul className="dropdown-menu">
              {status.map((item, k) => (
                <button key={k} onClick={(e) => {
                  setOrder({ ...order, status: item });
                }}
                  className="dropdown-item w-75 d-block text-start mx-3">
                  {item}
                </button>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* paid + order done*/}
      <div className="mb-3 col-3">

        {/* paid */}
        <div>
          <label htmlFor="exampleFormControlTextarea1" className="form-label">paid</label>
          <input
            id="paid"
            name='paid'
            placeholder={finalPrice}
            onChange={(e) => {
              const { error } = validators.paidSchema.validate(e.target?.value);
              if (error) {
                setErrorMessage((prev) => {
                  return { ...prev, paid: error.details[0].message };
                }
                );

              } else {
                setOrder({ ...order, paid: e.target?.value || finalPrice });
                setErrorMessage("");
              }
            }}
            className="form-control" /* id="exampleFormControlTextarea1" */ rows="3" />
          {errorMessage.paid ?
            <div className=' text-danger mx-2 alert-danger'>{errorMessage.paid}</div>
            : <div className='d-blok text-danger m-2 alert-danger'>{errorMessage.paid}</div>}

        </div>

        <div className='pt-4 '>

          {order.paid < finalPrice ?
            <div>
              <button className=" btn btn-danger "
                onClick={() => {
                  createOrder()
                }}>Done</button>
              <p className='text-danger'>راجاء مراجعة الاسعار</p>
            </div>
            :
            <div>
              <button className=" btn btn-success "
                onClick={() => {
                  createOrder()
                }}>Done</button>
            </div>

          }

        </div>
      </div>

    </div>


    {/* take order */}
    <div className='container  text-white rounded p-4 bg-light my-5'>
      <div className=' justify-content-center align-item-center row'>

        {/* head table */}
        <div className='py-2 text-white  h6  bg-black opacity-75 text  item justify-content-between align-item-center row'>
          <span className=' py-2 col-1 text-center  border-end'>Name</span>
          <span className=' py-2 col-1 text-center border-end'>Price unit</span>
          <span className=' py-2 col-1 text-center border-end'>Real Price</span>{/*  admin */}
          <span className=' py-2 col-1 text-center border-end'>Stock</span>
          <span className=' py-2 col-1 text-center border-end'>discount</span>
          <span className=' py-2 text-center col-1 ms-1 border-end'>Category</span>
          <span className=' py-2 col-1 text-center border-end'>Brand</span>
          <span className=' py-2 col-1 text-center border-end'>inchPrice</span>




          <Link className='col-2 text-center border-end'>
            <button className=' btn btn-danger' onClick={() => {
              setProductsDisplay([]);
              setProducts([]);
              deleteProduct();
            }}>Delete All</button>
          </Link>

          <span className=' py-2 col-1 '>Final prise</span>
        </div>


        {/* data display in table */}
        {products.length > 0 && [...new Set(productsDisplay)]?.map((el, i) =>
          <div
            key={i}
            className=' text-decoration-none '>
            <div className='p-2 text-white  h6  bg-black opacity-75 text  item justify-content-between align-item-center row'>
              <span className=' py-2 text-center col-1 ms-1 border-end'>{el.name}</span>

              {/* Price unit */}
              {el.subcategory?.details?.inchPrice ? //lw siwr
                <span className=' py-2 text-center col-1 border-end'>
                  {el.finalPriceUnit =
                    Math.ceil(el.inchPrice ? el.inchPrice * el.name.split("*")[0]  //lw md5l s3r al inch
                      : el.subcategory.details.inchPrice * el.name.split("*")[0]) - (el?.discount || "0")} {/* lw mad5lsh s3r al inch */}
                  {/* {setProducts(prev => {
                    const index = prev.findIndex(item => item.productId === el._id);
                    if (index !== -1) {
                      const newArray = [...prev];
                      newArray[index].unitPrice = el.finalPriceUnit;
                      return newArray;
                    } else {
                      return prev;
                    }
                  }) 
                  }*/}
                </span>
                :
                <span className=' py-2 text-center col-1 border-end'>

                  <span>{el.finalPriceUnit =
                    (el.finalPrice - (el?.discount || 0))}</span>


                </span>}

              {/* realPrice */}
              <span className=' py-2 text-center col-1 realPrice border-end'>{el.realPrice}</span>{/*  admin */}

              {/* quantity */}
              <span className=" col-1 text-center border-end">
                <input className="w-50 py-2 "
                  placeholder={el.stock}
                  value={el.quantity || ""}
                  onChange={(e) => {

                    const { error } = validators.quantitySchema.validate(e.target.value || " ");
                    if (error) {

                      setErrorMessage((prev) => {
                        return {
                          ...prev,
                          quantity: { [el.name]: error.details[0].message }
                        };
                      }
                      );

                    } else {
                      setErrorMessage("");
                    }

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
                        newArray[index].quantity = e.target?.value;
                        return newArray;
                      } else {
                        return prev;
                      }
                    });

                  }} />
                {errorMessage?.quantity?.[el.name] ?
                  <div className=' text-danger m-2 alert-danger'>{errorMessage?.quantity?.[el.name]}</div>
                  : " "}
              </span>

              {/* discount */}
              <span className='col-1 text-center border-end'>
                <input className="w-50 py-2 "
                  placeholder="dis"
                  value={el?.discount || ""}
                  onChange={(e) => {

                    const { error } = validators.discountSchema.validate(e.target.value || " ");
                    if (error) {

                      setErrorMessage((prev) => {
                        return { ...prev, discount: { [el.name]: error.details[0].message } };
                      }
                      );

                    } else {
                      setErrorMessage("");
                    }

                    setProducts(prev => {
                      const index = prev.findIndex(item => item.productId === el._id);
                      if (index !== -1) {
                        const newArray = [...prev];
                        newArray[index].discount = e?.target.value;
                        return newArray;
                      } else {
                        return prev;
                      }
                    });

                    setProductsDisplay(prev => {
                      const index = prev.findIndex(item => item._id === el._id);
                      if (index !== -1) {
                        const newArray = [...prev];
                        newArray[index].discount = e?.target.value || "";
                        return newArray;
                      } else {
                        return prev;
                      }
                    });

                  }} />
                {errorMessage?.discount?.[el.name] ?
                  <div className=' text-danger m-2 alert-danger'>{errorMessage?.discount?.[el.name]}</div>
                  : " "}
              </span>

              <span className=' py-2 text-center col-1 ms-1 border-end'>{el.category.name}</span>

              {/* brand */}
              <span className=' py-2 col-1 text-center border-end'>{el.brand.name}</span>

              {/* inchPrice */}
              {el.subcategory.details?.inchPrice ?
                <span className=" col-1 text-center border-end">
                  <input className="py-2 w-100 text-center "
                    placeholder={el?.subcategory.details?.inchPrice}
                    value={el?.inchPrice || ""}
                    onChange={(e) => {
                      const { error } = validators.inchPriceSchema.validate(e.target.value || " ");
                      if (error) {

                        setErrorMessage((prev) => {
                          return { ...prev, inchPrice: { [el.name]: error.details[0].message } };
                        }
                        );

                      } else {
                        setErrorMessage("");
                      }

                      setProducts(prev => {
                        const index = prev.findIndex(item => item.productId === el._id);
                        if (index !== -1) {
                          const newArray = [...prev];
                          e.target?.value ? newArray[index].inchPrice = e.target.value
                            : newArray[index].inchPrice = el.subcategory.details.inchPrice
                          /*  newArray[index].inchPrice = e.target.value || el?.subcategory.details?.inchPrice; */
                          return newArray;
                        } else {
                          return prev;
                        }
                        /*  {...prev ,inchPrice : newArray} */
                      });

                      setProductsDisplay(prev => {
                        const index = prev.findIndex(item => item._id === el._id);
                        if (index !== -1) {
                          const newArray = [...prev];
                          newArray[index].inchPrice = e.target.value;
                          return newArray;
                        } else {
                          return prev;
                        }
                      });

                    }} />
                  {errorMessage?.inchPrice?.[el.name] ?
                    <div className=' text-danger m-2 alert-danger'>{errorMessage?.inchPrice?.[el.name]}</div>
                    : " "} </span>
                : <span className=' py-2 col-1 text-center border-end'>___</span>}

              <Link className='col-2 text-center border-end'>
                <button className=' btn btn-danger ' onClick={() => { deleteToProducts(el) }}>Delete</button>
              </Link>

              <span className=' py-2 col-1 text-center text-center' >
                {el.finalPriceUnit * (el?.quantity || products?.find(item => item.productId === el._id)?.quantity || 0)}
              </span>

            </div>
          </div>

        )}

        <div className=' bg-black opacity-75 text-center   item  justify-content-end row align-content-center'>
          <span className='col-2 ps-4 py-2  fs-5'>Final Prise :</span>

          <span className='col-1 ps-4 py-1 fs-4'>{finalPrice}</span>
        </div>

      </div>
    </div>




    {
      error ? (
        <p>Error: {error}</p>
      ) : null
    }



  </div >)
};

Order.propTypes = {};

Order.defaultProps = {};

export default Order;