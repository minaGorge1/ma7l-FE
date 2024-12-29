import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Order.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import joi from 'joi';

export function Order({ arrayProducts, addProduct, deleteProduct, userData, setCustomerApp, customerApp }) {

  const headers = {
    "authorization": `Min@__${localStorage.getItem("token")}`
  }

  //result from search
  const [result, setResult] = useState([]);
  //search open close
  const [isVisible, setIsVisible] = useState(false);
  //payment open close
  const [isVisiblePayment, setIsVisiblePayment] = useState(false);
  //id data
  const [idsData, setIdsData] = useState([]);
  //ids
  const [ids, setIds] = useState(["categoryId", "subcategoryId", "titleId", "brandId", "customerId"])

  //product
  // what input in search
  const [searchQuery, setSearchQuery] = useState('');
  // products needed
  const [productsDisplay, setProductsDisplay] = useState([])
  //products send
  let [products, setProducts] = useState([]);
  // final price to display
  const [finalPrice, setFinalPrice] = useState(0);
  // final price to paid
  const [finalPriceReal, setFinalPriceReal] = useState(0);
  //customer
  const [customer, setCustomer] = useState({})

  //add money
  const [addMoney, setAddMoney] = useState(false)

  //status 
  const [status, setStatus] = useState(['انتظار', 'تم الدفع', 'رفض'])

  //Order
  const [order, setOrder] = useState({});

  //send Order
  const [orderDone, setOrderDone] = useState(false);

  //transaction
  // status to transaction
  const [statusT, setStatusT] = useState(["صافي", "ليه فلوس", "عليه فلوس"]);
  // clarification to dropdown
  const [clarification, setClarification] = useState(["دين", "دفع"]);
  // typeMoney to dropdown
  const [typeM, seTypeM] = useState(["تحويل", "كاش"]);
  // NewData Trans to update
  const [newTransactionData, setNewTransactionData] = useState({
    clarification: '',
    type: '',
    amount: '', // Initialize with an empty string
    description: 'empty' // Initialize with an empty string
  });
  // open create Transactions
  const [openCreateTrans, setOpenCreateTrans] = useState(false);

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

  //customer name
  const options = idsData.customer ? idsData.customer.map((el) => ({
    value: el._id, // id
    label: el.name, //  aly bizhr
    money: el.money,
    status: el.status
  })) : [];

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
      }, { products, orderDone });

      setFinalPrice(newFinalPrice);

      setOrder((prevOrder) => ({
        ...prevOrder,
        products,
        profitMargin: (prevOrder.paid ? prevOrder.paid : newFinalPrice) - realPrice

      }));
    }
    /* setOrder({ ...order, profitMargin: .target?.value || finalPrice }); */
  }, [products, order.paid]);

  //REFRESH component
  function refresh() {
    setProductsDisplay([]);
    setProducts([]);
    deleteProduct();
    setFinalPrice("0")
    setSearchQuery("")
    setCustomer({})
    setCustomerApp({})
    setAddMoney(false)
    setFinalPriceReal("0")
    setResult([])
    getIdsData()
    setIsVisible(false)
    setIsVisiblePayment(false)
  }
  /*   console.log({ order, finalPriceReal, finalPrice, customer });
   */
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
    if (customerApp) {
      setCustomer(customerApp)
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
    setIsVisiblePayment(false);
  }

  const handleSearchPro = (e) => {
    setSearchQuery(e.target.value);
    search(e.target.value)
  };

  async function search(value) {

    try {

      let api = `http://127.0.0.1:5000/product?search=${value}|name=${value}&isDeleted=false`
      const { message, ...resultData } = (await axios.get(api)).data;


      // Check if products exist and are an array
      if (Array.isArray(resultData.product)) {
        const updatedProducts = resultData.product.map((product) => {
          const updatedProduct = { ...product }; // Create a shallow copy of the product

          for (const id of ids) {
            if (updatedProduct[id]) {
              const idValue = id.split("I")[0];
              if (idsData[idValue]) {
                updatedProduct[idValue] = idsData[idValue].find((item) => item._id === updatedProduct[id]);
              }
            }
          }

          return updatedProduct; // Return the updated product
        });

        setResult(updatedProducts);
      } else {
        console.warn("No products found or products is not an array.");
        setResult([]); // Optionally set an empty array if no products
      }
    } catch (error) {
      setError(error.response.data.message);
    }

  }

  //handle search customer

  const handleSearchCus = (value) => {
    setOrder(prevOrder => ({ ...prevOrder, customerId: value?.value || " " }))
    setCustomer(value)
    setCustomerApp(value)
  };

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
      setOrderDone(true)
      let api = `http://127.0.0.1:5000/order/create`
      const { data } = await axios.post(api, order, { headers });
      if (data.message === "Done") {
        setIsVisiblePayment(false)
        setOpenCreateTrans(false)
        refData()
        getIdsData()
        refresh()

        alert("Create Order Successfully")
      }
    } catch (error) {
      setError(error.response.data.message);

    }

  }

  function editMoney() {
    if (customer.status === "عليه فلوس" && !addMoney) {
      setFinalPriceReal(Number(finalPrice) + Number(customer.money))
    } else if (customer.status === "ليه فلوس" && !addMoney) {
      finalPrice > customer.money ?
        setFinalPriceReal(finalPrice - customer.money) :
        setFinalPriceReal(-(customer.money - finalPrice))
    } else (
      setFinalPriceReal(finalPrice)
    )
  }

  //create Transaction
  async function createTransaction() {
    try {

      let api = `http://127.0.0.1:5000/customer/${customer.value}/createTransactions`
      const { data } = await axios.post(api, newTransactionData, { headers })


      if (data.message === "Done") {
        /* getDate(id, type) */
        /* setOpenCreateTrans(false) */
        const neWCus = {
          value: data.customer._id, // id
          label: data.customer.name, //  aly bizhr
          money: data.customer.money,
          status: data.customer.status
        }
        await setCustomer(neWCus)
        await setCustomerApp(neWCus)
        /* refData()  
        getIdsData() */
        /* refresh() */
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  }


  return (
    <div className='background-order'>

      <div className={`Search position-relative  ${!isVisiblePayment ? 'container' : 'p-5'}`} >
        {/* Order Component */}

        {/* icon search */}
        <div className=' position-search p-4 mt-4 col-12 ' style={{ display: isVisible ? 'block' : 'none' }} >
          <div className=' bg-white rounded-3 p-3 h-100 position-relative icon-search '>

            <div onClick={handleClick} className='position-absolute  top-0 end-0 me-4 fs-2 text-center rounded-5 px-3 mt-3 close-search'>
              x
            </div>

            <br />

            {/* search */}
            <div className="container position-fixed my-4">

              <div className=' justify-content-center align-item-around row '>

                <input className="col-2 w-50 form-control m-1 "
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={handleSearchPro} />

                <div className='col-3  justify-content-around align-items-center d-flex '>




                  <button className=" btn btn-primary  "
                    onClick={() => {
                      search(searchQuery)
                    }}>Search</button>



                </div>

              </div>
            </div>

            <br />
            <br />

            {/* result */}
            <div className='container  text-white  mt-4'>
              <div className=' justify-content-center align-item-center row'>

                {result?.filter(el => el.stock > 0).map((el, i) => <div
                  key={i}
                  className='col-4 text-decoration-none'>
                  <div className='p-2 text-white m-2 h6  bg-black opacity-100 text  item justify-content-center align-item-center row'>
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

                    <div className='col-6 my-2'>
                      <span>subcategory: </span> <span>{el.subcategory.name}</span>
                    </div>

                    <div className='col-6 my-2'>
                      <span>Price: </span> <span>{el.finalPrice}</span>
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

        <hr className='text-light h-25 ' />

        {/* custmer name */}
        <div className=' justify-content-between align-content-center row container  py-2'>
          <div className='  row  '>

            <div className='col-3 text-light fs-4'><span>customer : </span></div>

            <Select
              className="search-dropdown col-4"
              value={customer?.label || "select customer..."}
              placeholder={customer?.label || "select customer..."}
              onChange={handleSearchCus}
              options={options}
            />

            {customer.value ?
              <div className='col-5 '>
                <Link to={`http://localhost:3000/update/customer/${customer?.value}`} className='col-2 me-1'>
                  <button className='btn btn-success '>data</button>
                </Link>
                <button className='btn btn-danger col-2' onClick={() => {
                  setCustomer({})
                  setCustomerApp({})
                }} >delete</button>
              </div> : null}

          </div>
        </div>
        <hr className='text-light' />

        {/* note  + status + paid*/}

        <div className='justify-content-around align-item-center row container'>

          {/* note */}
          <div className="mb-3 col-6">
            <label htmlFor="exampleFormControlTextarea1" className="form-label text-black fs-5">Notes</label>
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
            <label htmlFor="exampleFormControlTextarea1" className="form-label text-light fs-4 me-2">status </label>

            <div className=" dropdown">
              <div className="nav-item dropdown btn btn-primary">
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
            {/*  <div>
            <label htmlFor="exampleFormControlTextarea1" className="form-label">paid</label>
            <input
              id="paid"
              name='paid'
              placeholder={finalPriceReal}
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
              className="form-control" rows="3" />
            {errorMessage.paid ?
              <div className=' text-danger mx-2 alert-danger'>{errorMessage.paid}</div>
              : <div className='d-blok text-danger m-2 alert-danger'>{errorMessage.paid}</div>}

          </div> */}

            <div className='pt-4  justify-content-around align-content-center row'>
              {(finalPrice > 0) || (customer?.label) ? (
                order.paid < finalPrice ? (
                  <div className=''>
                    <button className="btn btn-danger w-100"
                      onClick={() => {
                        /* createOrder() */
                        setIsVisiblePayment(true);
                      }}>Payment Form</button>
                    <p className='text-danger'>راجاء مراجعة الاسعار</p>
                  </div>
                ) : (
                  <div className=''>
                    <button className="btn btn-success w-100 p-4"
                      onClick={() => {
                        /* createOrder() */
                        setIsVisiblePayment(true);
                      }}>Payment Form</button>
                  </div>
                )
              ) : (
                <button className="btn btn-disabled" disabled
                  onClick={() => {
                    /* createOrder() */
                    setIsVisiblePayment(!isVisiblePayment);
                  }}>Payment Form</button>
              )}


            </div>
          </div>

        </div>

        {/* Payment Form */}
        <div className=' position-payment p-3 col-12 w-100 ' style={{ display: isVisiblePayment ? 'block' : 'none' }} >
          <div className=' justify-content-center row align-content-center ' >
            <div className=' w-50 my-2'>

              <div className=' bg-white rounded-3 h-100 position-relative icon-payment '>

                <div className='pt-3'>
                  <title>Payment Form</title>
                  <div onClick={handleClick} className='position-absolute  top-0 end-0 me-4 fs-2 text-center rounded-5 px-3 mt-3 close-search'>
                    x
                  </div>
                </div>

                <div >
                  <div className="row">
                    <div className="col-md-6 offset-md-3">
                      <h2 className="text-center mb-4">Payment Form</h2>

                      <div className=''>
                        <span>id :</span>
                        <span> {`816354603205/:${order.profitMargin};/49869%6&7{56-4)2`}</span>
                      </div>
                      <br />
                      <div>
                        <div className="form-group">
                          <label htmlFor="total">Total order:</label>
                          <input
                            type="text"
                            className="form-control"
                            id="total"
                            /* readOnly */
                            value={finalPrice}
                            onChange={(e) => { setFinalPrice(e.target.value) }}
                          />
                        </div>


                        {customer.label ?
                          <div className="form-group my-2">

                            <div className='border border-1 my-2 p-1 rounded-2'>
                              <label>customer data:</label>
                              <div>
                                <span className='fs-5'>customer :  </span>
                                <span className='fs-4 text-center ' >{customer.label}</span>
                              </div>

                              <div>
                                <span >status : &nbsp; &nbsp; </span>
                                <span className={`fs-4 text-center  ${customer.status === "ليه فلوس" || "صافي" ? "text-success" : "text-danger"}`} > {customer.status}</span>
                              </div>

                              <div>
                                <span >old money : &nbsp; &nbsp; </span>
                                <span className={`fs-4 text-center  ${!customer.status === "ليه فلوس" || "صافي" ? "text-success" : "text-danger"}`} > {customer.money}</span>
                              </div>

                              <div className='justify-content-end align-content-around row me-3'>
                                <Link className='col-2 text-center border-end'>
                                  <button className=' btn btn-success ' onClick={() => {
                                    setAddMoney(!addMoney)
                                    editMoney()
                                  }}>{customer.status === "عليه فلوس" ? "gam3" : "an2s"}</button>
                                </Link>
                              </div>
                            </div>

                          </div>
                          : null}

                        {/* paid */}
                        <div>
                          <label htmlFor="exampleFormControlTextarea1" className="form-label">Paid</label>
                          <input
                            id="paid"
                            name='paid'
                            placeholder={finalPriceReal ? finalPriceReal : finalPrice}
                            onChange={(e) => {
                              const { error } = validators.paidSchema.validate(e.target?.value);
                              if (error) {
                                setErrorMessage((prev) => {
                                  return { ...prev, paid: error.details[0].message };
                                }
                                );
                              } else {
                                setOrder({ ...order, paid: e.target?.value || finalPrice });
                                setOrderDone(true)
                                setErrorMessage("");
                              }
                            }}
                            className="form-control" /* id="exampleFormControlTextarea1" */ rows="3" />
                          {errorMessage.paid ?
                            <div className=' text-danger mx-2 alert-danger'>{errorMessage.paid}</div>
                            : <div className='d-blok text-danger m-2 alert-danger'>{errorMessage.paid}</div>}

                        </div>

                        {/* transaction */}

                        {/* button open transaction*/}
                        {customer.label ?
                          <div className='justify-content-end align-content-center row pt-2 '>
                            <button className='btn w-50 me-2 btn-success fs-5' onClick={() => {
                              setOpenCreateTrans(!openCreateTrans)
                              /* createTransaction(result._id) */
                            }}>create Transaction</button>

                          </div> : null}

                        {/* icon create transaction*/}
                        {customer.label ? openCreateTrans ?
                          <div className='justify-content-start align-content-center row border border-2 border-black p-2 my-2 mx-1'>

                            {/* clarification */}
                            <div className='mt-1'>
                              <span className='col-2 fs-5'>
                                <span> clarification : </span>

                                <span className=" dropdown col-2">
                                  <div className="nav-item dropdown btn btn-outline-dark">
                                    <button className="nav-link dropdown-toggle"
                                      role="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      {!(newTransactionData)?.clarification ? "select clarification" : newTransactionData.clarification}
                                    </button>
                                    <ul className="dropdown-menu">

                                      {clarification?.map((item, i) => (
                                        <button key={i}

                                          onClick={(e) => {
                                            e.preventDefault();
                                            setNewTransactionData((prevData) => ({
                                              ...prevData,
                                              clarification: item

                                            }));
                                            /* handleeDataDisplay() */
                                          }}

                                          className="dropdown-item w-75 d-block text-start mx-3">
                                          {item}
                                        </button>
                                      ))}
                                    </ul>
                                  </div>
                                </span>
                              </span>
                            </div>

                            {/* type */}
                            <div className='mt-2'>
                              <span className='col-6 fs-5'>
                                <span> type : </span>


                                <div className=" dropdown col-2">
                                  <div className="nav-item dropdown btn btn-outline-dark">
                                    <button className="nav-link dropdown-toggle"
                                      role="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      {!(newTransactionData)?.type ? "select type" : newTransactionData.type}
                                    </button>
                                    <ul className="dropdown-menu">

                                      {typeM?.map((item, i) => (
                                        <button key={i}

                                          onClick={(e) => {
                                            e.preventDefault();
                                            setNewTransactionData((prevData) => ({
                                              ...prevData,
                                              type: item

                                            }));
                                            /* handleeDataDisplay() */
                                          }}

                                          className="dropdown-item w-75 d-block text-start mx-3">
                                          {item}
                                        </button>
                                      ))}

                                    </ul>
                                  </div>
                                </div>
                              </span>
                            </div>
                            {/* money */}
                            <div>
                              <span className='col-3 fs-5'>
                                <span> money : </span>

                                <input
                                  className='mt-2'
                                  placeholder={order?.paid ? order?.paid - finalPrice : "mony"}
                                  type="number"
                                  /* value={newTransactionData?.amount || 0} */
                                  onChange={(e) => setNewTransactionData({ ...newTransactionData, amount: e.target.value })}
                                />

                              </span>

                            </div>
                            {/* description */}
                            <div>
                              <span className='col-2 fs-5'>
                                <span> description : </span>

                                <input
                                  className='mt-2'
                                  placeholder="description"
                                  type="text"
                                  /* value={newTransactionData?.description || 0} */
                                  onChange={(e) => setNewTransactionData({ ...newTransactionData, description: e.target.value })}
                                />

                              </span>
                            </div>

                            <div className='justify-content-end align-content-center row mb-2'>

                              {/* // Check if the required fields in newTransactionData are filled */}
                              {newTransactionData.clarification || newTransactionData.type || newTransactionData.amount || newTransactionData.description ? (
                                <button
                                  className='btn col-3 mt-2 btn-primary'
                                  onClick={() => {
                                    createTransaction(result._id);

                                  }}
                                >
                                  Done.!
                                </button>
                              ) : (
                                <button className='btn col-3 mt-2 btn-disabled' disabled>
                                  Done.!
                                </button>
                              )}
                            </div>

                          </div> : null : null}


                        {/* <div className="form-group">
                        <label htmlFor="paidAmount">Paid Amount:</label>
                        <input type="text" className="form-control" id="paidAmount" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="remaining">Remaining:</label>
                        <input type="text" className="form-control" id="remaining" readOnly />
                      </div> */}
                        <div className="form-group">
                          <label htmlFor="notes">Notes:</label>
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
                            value={order?.note}
                            id="notes"
                            className="form-control"
                            rows="3"
                            style={{ resize: "none" }}
                          ></textarea>
                        </div>

                        <div className="form-group my-2">
                          <label htmlFor="status">Status :  &nbsp;  &nbsp;</label>

                          <div className=" dropdown ">
                            <div className="nav-item dropdown btn btn-outline-primary ">
                              <Link className="nav-link dropdown-toggle " role="button" data-bs-toggle="dropdown" aria-expanded="false">
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

                        <div>
                          {order.paid < finalPrice ? (
                            <div className=''>
                              <button className="btn btn-danger w-100"
                                onClick={() => {
                                  createOrder()
                                  setIsVisiblePayment(!isVisiblePayment);
                                }}>Done...</button>
                              <p className='text-danger'>راجاء مراجعة الاسعار</p>
                            </div>
                          ) : (
                            <div className=''>
                              <button className="btn btn-success w-100 "
                                onClick={() => {
                                  createOrder()
                                  setIsVisiblePayment(!isVisiblePayment);
                                }}>Done...</button>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>


        {/* take order */}
        <div className='container  text-white rounded p-4 my-4'>
          <div className=' justify-content-center align-item-center row'>

            {/* head table */}
            <div className='py-2 text-white  h6  bg-black opacity-100 text  item justify-content-between align-item-center row'>
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
                  setFinalPrice(0)
                }}>Delete All</button>
              </Link>

              <span className=' py-2 col-1 '>Final prise</span>
            </div>


            {/* data display in table */}
            {products.length > 0 && [...new Set(productsDisplay)]?.map((el, i) =>
              <div
                key={i}
                className=' text-decoration-none '>
                <div className='p-2 text-white  h6  bg-black opacity-100 text  item justify-content-between align-item-center row'>
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
                  {(userData.role === "Admin") ?
                    <span className=' py-2 text-center col-1 realPrice border-end'>{el.realPrice}</span>
                    : <span className='col-10 fs-4'> ___ </span>}


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

            {customer.value ?
              <div
                className=' text-decoration-none '>
                <div className='p-2 text-white  h6  bg-black opacity-100 text  item justify-content-between align-item-center row'>
                  <span className=' py-2 text-center col-2 ms-1 border-end'>حساب سابق</span>

                  {/* realPrice */}
                  <span className=' py-2 col-1 text-center border-end'>___</span>
                  {/* quantity */}
                  <span className=' py-2 col-1 text-center border-end'>___</span>

                  {/* discount */}
                  <span className=' py-2 col-1 text-center border-end'>___</span>

                  <span className=' py-2 col-1 text-center border-end'>___</span>


                  {/* status */}
                  <span className=' py-2 col-2 text-center border-end'>{customer.status}</span>

                  <Link className='col-2 text-center border-end'>
                    <button className=' btn btn-success ' onClick={() => {
                      setAddMoney(!addMoney)
                      editMoney()
                    }}>{customer.status === "عليه فلوس" ? "gam3" : "an2s"}</button>
                  </Link>

                  <span className=' py-2 col-1 text-center text-center' >
                    {/* {el.finalPriceUnit * (el?.quantity || products?.find(item => item.productId === el._id)?.quantity || 0)} */}
                    {customer.money}
                  </span>

                </div>
              </div> : ""}

            {/*     enum: ["صافي", "ليه فلوس", "عليه فلوس"]
 */}

            <div className='bg-black opacity-100 text-center item justify-content-end row align-content-end'>

              {customer.money ? (
                <>
                  {customer.status === "عليه فلوس" && addMoney ? (
                    <span className='col-3 ms-4 py-2 fs-5'>
                      <span className='ps-4 col-2 fs-5'>( يدفع ) :</span>
                      <span className='ps-4 col-2 fs-4'>{Number(finalPrice) + Number(customer.money)}</span>
                    </span>
                  ) : customer.status === "ليه فلوس" && addMoney ? (
                    finalPrice > customer.money ? (
                      <span className='col-3 ms-4 py-2 fs-5'>
                        <span className='ps-4 col-2 fs-5'>( يدفع ) :</span>
                        <span className='ps-4 col-2 fs-4'>{finalPrice - customer.money}</span>
                      </span>
                    ) : (
                      <span className='col-3 ms-4 py-2 fs-5 bg-success'>
                        <span className='ps-4 col-2 fs-5'>( ليه ) :</span>
                        <span className='ps-4 col-2 fs-4 '>{customer.money - finalPrice}</span>
                      </span>
                    )
                  ) : (
                    <span className='col-3 ms-4 py-2 fs-5'>
                      <span className='ps-4 col-2 fs-5'>Final Price:</span>
                      <span className='ps-4 col-2 fs-4'>{finalPrice}</span>
                    </span>
                  )}
                </>
              ) : (
                <span className='col-3 ms-4 py-2 fs-5'>
                  <span className='ps-4 col-2 fs-5'>Final Price:</span>
                  <span className='ps-4 col-2 fs-4'>{finalPrice}</span>
                </span>
              )}
            </div>

          </div>
        </div>




        {
          error ? (
            <p>Error: {error}</p>
          ) : null
        }



      </div >

    </div>
  )
};

Order.propTypes = {};

Order.defaultProps = {};

export default Order;