import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './History.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Select from 'react-select';
function History({ userData }) {
  //order came from db
  const [orders, setOrders] = useState([])

  //customer came from db
  const [customers, setCustomers] = useState([])

  //to show or hide details order
  const [orderDetails, setOrderDetails] = useState({})

  //update data for the selected item
  const [NewData, setNewData] = useState({});

  //status 
  const [status, setStatus] = useState(['انتظار', 'تم الدفع', 'رفض'])


  const headers = {
    "authorization": `Min@__${localStorage.getItem("token")}`
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const now = new Date();
  const hours = now.getHours();
  const time = `${hours > 12 ? hours - 12 : hours} : ${now.getMinutes()} ${hours >= 12 ? 'PM' : 'AM'}`;
  const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;

  console.log(`${time} ${date}`)

  useEffect(() => {
    getDate()
    getDateCustomer()
    setLoading(false);


  }, []);
  /* userId: { type: Types.ObjectId, ref: "User", required: true },
  customerId: { type: Types.ObjectId, ref: "Customer" },
  products: [{
      name: { type: String, required: true },
      productId: { type: Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1, required: true },
      discount: { type: Number, default: 0 },
      inchPrice: { type: Number, default: 0 },
      unitPrice: { type: Number, default: 1, required: true },
      finalPrice: { type: Number, default: 1, required: true }
  }],
  finalPrice: { type: Number, default: 1, required: true },
  paid: { type: Number, default: 1, required: true },
  profitMargin: { type: Number, default: 1, required: true },
  status: {
      type: String,
      default: 'تم الدفع',
      enum: ['انتظار', 'تم الدفع', 'رفض']
  },
  isDeleted: { type: Boolean, default: false } */

  async function getDate() {

    try {

      setLoading(true)
      let api = `http://127.0.0.1:5000/order?date=${date}&isDeleted=false`
      const { message, ...resultData } = (await axios.get(api)).data;

      console.log(resultData);
      if (await message === "Done" & resultData.order.length > 0) {

        setOrders(() => {
          return [...resultData.order]
        });

        setOrderDetails(() =>
          resultData.order.reduce((acc, el) => ({ ...acc, [el._id]: false }), {})
        )
      } else {
        setOrders([])
      }

      setLoading(false)
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  /* get all customers */
  async function getDateCustomer() {

    try {

      setLoading(true)
      let api = `http://localhost:5000/customer?isDeleted=false`
      const { message, ...resultData } = (await axios.get(api)).data;

      console.log(resultData);
      if (await message === "Done" & resultData.customer.length > 0) {

        setCustomers(() => {
          return [...resultData.customer]
        });

      }
      setLoading(false)
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  //update customer
  const handleSearchCus = (value) => {
    setNewData(prevOrder => ({ ...prevOrder, customerId: value?.value || " " }))
  };

  //customer name
  const options = customers ? customers.map((el) => ({
    value: el._id, // id
    label: el.name, //  aly bizhr
  })) : [];



  async function update(id) {

    try {
      console.log(NewData);
      let api = `http://127.0.0.1:5000/order/${id}/update`
      const { data } = await axios.put(api, NewData, { headers })
      console.log(data);
      if (data.message === "Done") {
        getDate()
      }
    } catch (error) {
      setError(error.response.data.message);
    }

  }



  return <div className="History my-5 pb-2">
    History Component


    <div className="justify-content-between align-item-center row">
      {loading ? (
        <div className="text-center">
          <span>Loading products...</span>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        orders.length > 0 ? ([...new Set(orders)].map((el) => (

          <div key={el._id}
            className={` p-2 rounded-3 bg-black opacity-75 my-3`}>

            <div className="p-1 fs-5 text-white item justify-content-between align-item-center row mb-2">

              {/* id order */}
              <div>
                <span className="py-2 col-2 text-center opacity-50">id :&nbsp; &nbsp;</span>
                <span className="py-2 col-2 text-center text-danger">{el._id}</span>
              </div>

              {/* time */}
              <div className="justify-content-between align-item-center row mb-1">
                <span className='col-5'>
                  <span className="py-2 col-2 text-center opacity-50">Time :&nbsp; &nbsp;</span>
                  <span className="py-2 col-2 text-center">{el.time}</span>
                </span>


                {userData.role === "Admin" ?
                  <span className="col-7 justify-content-between align-item-center row ">

                    <span className='col-6'>
                      <input className='' onChange={(el) => {
                        setNewData((prevData) => ({
                          ...prevData,
                          time: el.target?.value || null
                        }));
                      }}
                        type="text" />

                    </span>


                    <span className='col-6 '>
                      <button className='btn btn-primary' onClick={() => { update(el._id) }}> update</button> </span>
                  </span> : " "
                }
              </div>

              {/* date */}
              <div className="justify-content-between align-item-center row mb-1">
                <span className='col-5'>
                  <span className="py-2 col-5 text-center opacity-50">Date :&nbsp; &nbsp;</span>
                  <span className="py-2 col-5 text-center">{el.date}</span>
                </span>

                {userData.role === "Admin" ?
                  <span className="col-7 justify-content-between align-item-center row ">

                    <span className='col-6'>
                      <input className='' onChange={(el) => {
                        setNewData((prevData) => ({
                          ...prevData,
                          date: el.target?.value || null
                        }));
                      }}
                        type="text" />

                    </span>

                    <span className='col-6 '>
                      <button className='btn btn-primary' onClick={() => { update(el._id) }}> update</button> </span>
                  </span> : " "
                }

              </div>

              {/* customer */}
              <div className="justify-content-between align-item-center row my-2">

                <span className='col-5'>
                  <span className="py-2 col-1 text-center opacity-50">customer :&nbsp; &nbsp;</span>
                  <span className="py-2 col-2 text-center">
                    {el.customerId
                      ? customers?.find((cus) => cus._id === el.customerId)?.name
                      : "none"}
                  </span>
                </span>


                <span className="col-7 justify-content-between align-item-center row ">
                  <Select
                    className="search-dropdown text-black col-8 "
                    /*  value={customerName} */
                    onChange={() => {
                      handleSearchCus()
                      /* update(el._id) */
                    }}
                    options={options}
                  />

                  <span className='col-3 '>
                    <button className='btn btn-primary' onClick={() => { update(el._id) }}> update</button>
                  </span>

                </span>

              </div>
              {/* note */}
              <div className="justify-content-between align-item-center row mb-1">
                <span className='col-5'>
                  <span className="py-2 col-1 text-center opacity-50">note :&nbsp; &nbsp;</span>
                  <span className="py-2 col-2 text-center">{el?.note || "empty"}</span>
                </span>

                {userData.role === "Admin" ?
                  <span className="col-7 justify-content-between align-item-center row mb-1">

                    <span className='col-6'>
                      <input className='' onChange={(el) => {
                        setNewData((prevData) => ({
                          ...prevData,
                          note: el.target?.value
                        }));
                      }}
                        type="text" />

                    </span>

                    <span className='col-6 '>
                      <button className='btn btn-primary' onClick={() => { update(el._id) }}> update</button> </span>
                  </span> : " "
                }

              </div>
              {/* status */}
              <div className="justify-content-between align-item-center row mb-1">

                <span className='col-5'>
                  <span className="py-2 col-1 text-center opacity-50">status :&nbsp; &nbsp;</span>
                  <span className="py-2 col-2 text-center">{el.status}</span>
                </span>
                <span className='justify-content-between align-item-between row col-7'>

                  <span className=" col-6 dropdown">
                    <span className="nav-item dropdown btn btn-outline-primary">
                      <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {!NewData?.status ? el.status : (NewData?.status || "Dropdown")}
                      </Link>
                      <ul className="dropdown-menu">
                        {status.map((item, k) => (
                          <button key={k} onClick={(e) => {
                            setNewData({ ...NewData, status: item });
                          }}
                            className="dropdown-item w-75 d-block text-start mx-3">
                            {item}
                          </button>
                        ))}
                      </ul>
                    </span>

                  </span>
                  <span className='col-6 '>
                    <button className='btn btn-primary' onClick={() => { update(el._id) }}> update</button>
                  </span>
                </span>





              </div>

              <div>
                {/* profit */}
                <span className="py-2 col-1 text-center opacity-50">profit :</span>
                <span className='col-1 ps-4 py-1 fs-4 realPrice'>{el.profitMargin}</span>
              </div>

              {!orderDetails[el._id] ?
                <div>
                  {/* Final Prise */}
                  <div>
                    <span className="py-2 col-1 text-center opacity-50">Final Prise :</span>
                    <span className='col-1 ps-4 py-1 fs-4 '>{el.finalPrice}</span>
                  </div>
                  {/* paid */}
                  <div className="justify-content-between align-item-center row">

                    <span className='col-5'>
                      <span className="py-2 col-1 text-center opacity-50">Paid :</span>
                      <span className='col-1 ps-4 py-1 fs-4 '>{el.paid}</span>
                    </span>

                    {userData.role === "Admin" ?
                      <span className="col-7 justify-content-between align-item-center row">

                        <span className='col-6'>
                          <input className='' onChange={(el) => {
                            setNewData((prevData) => ({
                              ...prevData,
                              paid: el.target?.value
                            }));
                          }}
                            type="text" />

                        </span>

                        <span className='col-6 '>
                          <button className='btn btn-primary ' onClick={() => { update(el._id) }}> update</button> </span>
                      </span>
                      : " "
                    }


                  </div>
                </div> : " "}



              <div className='text-white text-center mt-2  item  justify-content-end row align-content-center'>

                <Link className="btn btn-primary col-2 details" onClick={() => {
                  orderDetails[el._id] ?
                    setOrderDetails({ ...orderDetails, [el._id]: false })
                    :
                    setOrderDetails({ ...orderDetails, [el._id]: true })
                }}>
                  {orderDetails[el._id] ? "hide" : "show"}</Link>

              </div>

              {/*  <span className="py-2 col-1 text-center">
                <Link className="btn btn-primary " to={`http://localhost:3000/update/product/${el._id}`}>
                  Edit
                </Link>
              </span> */}


            </div>
            {/* table */}
            {orderDetails[el._id] ?

              <div className=' container '>
                {/* head table */}
                <div className='py-2 text-white  h6  bg-danger  item justify-content-between align-item-center row'>
                  <span className=' pt-2 col-3 text-center  border-end'>ID</span>
                  <span className=' p-2 col-1   border-end'>Name</span>
                  <span className=' p-2 col-1  border-end'>Price unit</span>
                  <span className=' p-2 col-1  border-end'>Discount</span>
                  <span className=' p-2 col-1  border-end'>Price unit after discount</span>
                  <span className=' p-2 col-1  border-end'>quantity</span>
                  <span className=' p-2 col-1  border-end'>inchPrice</span>
                  <span className=' p-2 col-1 '>Final prise</span>
                  <span className=' p-2 col-1 '></span>
                </div>

                {el.products.map((product, index) => {
                  return (
                    <div
                      className='py-2 text-white  h6  bg-danger  item justify-content-between align-item-center row'
                      key={index}
                    >
                      <span className='p-2 col-3 text-center border-end'>{product.productId}</span>
                      <span className='p-2 col-1 text-center border-end'>{product.name}</span>
                      <span className='p-2 col-1 text-center border-end'>{(product?.discount || 0) + product.unitPrice}</span>

                      <span className='p-2 col-1 text-center border-end'>{product.discount}</span>
                      <span className='p-2 col-1 text-center border-end'>{product.unitPrice}</span>
                      <span className='p-2 col-1 text-center border-end'>{product.quantity}</span>
                      <span className='p-2 col-1 text-center border-end'>{(product?.inchPrice || "______")}</span>
                      <span className='p-2 col-1'>{product.finalPrice}</span>
                      <span className="py-2 col-1 text-center rounded-5">
                        <Link to={`http://localhost:3000/product/${product.productId}`}>
                          <button className="btn btn-success" onClick={() => { }}>
                            data
                          </button>
                        </Link>
                      </span>

                    </div>
                  );
                })}

                <div className='text-white text-center   item  justify-content-end row align-content-center'>
                  <span className='opacity-50 col-2 ps-4 py-2  fs-5'>Final Prise :</span>
                  <span className='col-1 ps-4 py-1 fs-4'>{el.finalPrice}</span>
                </div>

                <div className='text-white text-center   item  justify-content-end row align-content-center'>
                  <span className='opacity-50 col-2 ps-4 py-2  fs-5'>Paid :</span>
                  <span className='col-1 ps-4 py-1 fs-4'>{el.paid}</span>
                </div>


              </div>
              : " "}





          </div>
        ))) : (<div className='text-danger text-center p-3'>
          <span> No orders found</span>
        </div>)
      )}
    </div>
  </div >
}



History.propTypes = {};

History.defaultProps = {};

export default History;
