import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import './History.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Select from 'react-select';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/fontawesome-free-solid';
import moment from 'moment/moment';

function History({ userData }) {

  const now = new Date();
  /* const hours = now.getHours();
  const time = `${hours > 12 ? hours - 12 : hours} : ${now.getMinutes()} ${hours >= 12 ? 'PM' : 'AM'}`; */
  const dateNow = moment(now).format('DD-MM-YYYY');


  //order came from db
  const [orders, setOrders] = useState([])

  //customer came from db 
  const [customers, setCustomers] = useState([])

  //to show or hide details order
  const [orderDetails, setOrderDetails] = useState({})

  //to show or hide details order
  const [openUpdate, setOpenUpdate] = useState({})

  //update data for the selected item
  const [NewData, setNewData] = useState({});

  //search by customer name 
  const [cusId, setCusId] = useState("");

  //startDate 
  const [startDate, setStartDate] = useState(dateNow);

  //check updates
  const [check, setCheck] = useState(false);

  //status 
  const [status, setStatus] = useState(['انتظار', 'تم الدفع', 'رفض'])

  //status to search
  const [statusToSearch, setStatusToSearch] = useState("")


  const headers = {
    "authorization": `Min@__${localStorage.getItem("token")}`
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


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

    let api = cusId
      ? `http://127.0.0.1:5000/order?customerId=${cusId}&isDeleted=false`
      : `http://127.0.0.1:5000/order?date=${startDate}&isDeleted=false`;

    if (statusToSearch) {
      api += `&status=${statusToSearch}`;
    }

    try {

      setLoading(true)

      const { message, ...resultData } = (await axios.get(api)).data;

      if (await message === "Done" & resultData.order.length > 0) {
        setOrders([ ])
        setOrders(() => {
          return [...resultData.order]
        });

        setOrderDetails(() =>
          resultData.order.reduce((acc, el) => ({ ...acc, [el._id]: false }), {})
        )

        setOpenUpdate(() =>
          resultData.order.reduce((acc, el) => ({
            ...acc, [el._id]: false,
            ...el.products.reduce((prodAcc, pro) => ({ ...prodAcc, [pro._id]: false })
              , {})
          }), {}))

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
  const handleSearchUpdateCus = (value) => {
    setNewData(prevOrder => ({ ...prevOrder, customerId: value?.value || " " }))
  };

  //customer name
  const options = customers ? customers.map((el) => ({
    value: el._id, // id
    label: el.name, //  aly bizhr
  })) : [];


  async function update(id) {
    /* console.log(NewData); */

    try {
      let api = `http://127.0.0.1:5000/order/${id}/update`
      const { data } = await axios.put(api, NewData, { headers })


      if (data.message === "Done") {
        getDate()

        setCheck(true)
      }
    } catch (error) {
      setError(error.response.data.message);
    }

  }

  async function deleteOrder(id) {

    try {
      let api = `http://127.0.0.1:5000/order/cancel/${id}`
      const { data } = await axios.patch(api, null, { headers })
      if (data.message === "Done") {
        getDate()
      }
    } catch (error) {
      setError(error.response.data.message);
    }

  }

  const handleSearchCus = (value) => {
    setCusId(value.value)

  };


  return <div className="History py-2 background-history">
    {/* History Component */}

    <div className='container my-5'>
      <div className="justify-content-between container align-item-center row">



        <div className="justify-content-around container align-item-center row mb-3">
          <div className='row'>

            {/* custmer name */}
            <div className='  row py-2 col-5 border-end border-black mx-5'>

              <div className='col-4 text-light fs-4'><span>customer : </span></div>

              <Select
                className="search-dropdown col-8"
                /*  value={customerName} */
                onChange={handleSearchCus}
                options={options}
              />


            </div>

            {/* Status To Search */}
            <div className='col-2 border-end border-black'>
              <span className=" col-6 dropdown">
                <span className="nav-item dropdown btn btn-primary">
                  <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {statusToSearch ? statusToSearch : "Dropdown"}
                  </Link>
                  <ul className="dropdown-menu">
                    {status.map((item, k) => (
                      <button key={k} onClick={(e) => {
                        setStatusToSearch(item);
                        getDate();
                      }}
                        className="dropdown-item w-75 d-block text-start mx-3">
                        {item}
                      </button>
                    ))}
                  </ul>
                </span>

              </span>
            </div>

            {/* {date}*/}
            <div className='py-2 col-4 align-item-center justify-content-around '>
              <div className='row  '>
                <span className='col-3 text-light fs-4'>date : </span>
                <span className='col-9' >

                  <DatePicker
                    className='form-control text-center'
                    /* value={} */
                    placeholderText={startDate}
                    onChange={(date) => {
                      setStartDate(moment(date).format('DD-MM-YYYY'));
                    }}
                    dateFormat="dd-MM-yyyy"
                    format="dd-MM-yyyy"
                  />

                </span>

              </div>

            </div>

            <div className='justify-content-end container align-item-center row my-2'>
              <button className="col-2 btn btn-success"
                type="submit"
                onClick={() => { getDate() }}
              >refresh</button>
            </div>

          </div>

        </div>

        <hr className='text-white' />
        {loading ? (
          <div className="text-center">
            <span>Loading products...</span>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (

          orders.length > 0 ? ([...new Set(orders)].reverse().map((el) => (

            <div key={el._id}
              className={` p-2 rounded-3  bg-orders-his my-3 container`}>

              <div className="p-1 fs-5 text-white item justify-content-between align-item-center row mb-2 container">

                {/* id order */}
                <div>
                  <span className="py-2 col-2 text-center text-black ">id :&nbsp; &nbsp;</span>
                  <span className="py-2 col-2 text-center text-danger">{el._id}</span>
                </div>

                {/* time */}
                <div className="justify-content-between align-item-center row mb-1">
                  <span className='col-5'>
                    <span className="py-2 col-2 text-center text-black ">Time :&nbsp; &nbsp;</span>
                    <span className="py-2 col-2 text-center">{el.time}</span>
                  </span>


                  {userData.role === "Admin" && openUpdate[el._id] ?
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
                    <span className="py-2 col-5 text-center text-black">Date :&nbsp; &nbsp;</span>
                    <span className="py-2 col-5 text-center">{el.date}</span>
                  </span>

                  {userData.role === "Admin" && openUpdate[el._id] ?
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
                    <span className="py-2 col-1 text-center text-black">customer :&nbsp; &nbsp;</span>
                    <span className="py-2 col-2 text-center">
                      {el.customerId
                        ? customers?.find((cus) => cus._id === el.customerId)?.name
                        : "none"}
                    </span>
                  </span>

                  {userData.role === "Admin" && openUpdate[el._id] ?
                    <span className="col-7 justify-content-between align-item-center row ">
                      <Select
                        className="search-dropdown text-black col-8 "
                        /*  value={customerName} */
                        onChange={handleSearchUpdateCus}
                        options={options}
                      />

                      <span className='col-3 '>
                        <button className='btn btn-primary' onClick={() => { update(el._id) }}> update</button>
                      </span>

                    </span> : " "
                  }


                </div>
                {/* note */}
                <div className="justify-content-between align-item-center row mb-1">
                  <span className='col-5'>
                    <span className="py-2 col-1 text-center text-black">note :&nbsp; &nbsp;</span>
                    <span className="py-2 col-2 text-center">{el?.note || "empty"}</span>
                  </span>

                  {userData.role === "Admin" && openUpdate[el._id] ?
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
                    <span className="py-2 col-1 text-center text-black">status :&nbsp; &nbsp;</span>
                    <span className="py-2 col-2 text-center">{el.status}</span>
                  </span>

                  {userData.role === "Admin" && openUpdate[el._id] ?
                    <span className='justify-content-between align-item-between row col-7'>

                      <span className=" col-6 dropdown">
                        <span className="nav-item dropdown btn btn-primary">
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
                    : ""}

                </div>

                {/* profit */}
                <div>
                  <span className="py-2 col-1 text-center text-black">profit :</span>
                  <span className='col-1 ps-4 py-1 fs-4 realPrice'>{el.profitMargin}</span>
                </div>

                {/* Final Prise */}
                <div>
                  <span className="py-2 col-1 text-center text-black">Final Prise :</span>
                  <span className='col-1 ps-4 py-1 fs-4 '>{el.finalPrice}</span>
                </div>

                {/* paid */}
                <div className="justify-content-between align-item-center row">

                  <span className='col-5'>
                    <span className="py-2 col-1 text-center text-black">Paid :</span>
                    <span className='col-1 ps-4 py-1 fs-4 '>{el.paid}</span>
                  </span>

                  {userData.role === "Admin" && openUpdate[el._id] ?
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

                <div className='text-white text-center mt-2  item  justify-content-end row align-content-center'>

                  <Link className="btn btn-danger col-2 details" onClick={() => {
                    deleteOrder(el._id)
                  }}
                  >
                    delete</Link>

                </div>

                <div className='text-white text-center mt-2  item  justify-content-end row align-content-center'>

                  <Link className="btn btn-success col-2 details" onClick={() => {
                    openUpdate[el._id] ?
                      setOpenUpdate({ ...openUpdate, [el._id]: false })
                      :
                      setOpenUpdate({ ...openUpdate, [el._id]: true })
                  }}>
                    {openUpdate[el._id] ? "close" : "update"}</Link>

                </div>

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

              {/* quantity discount inchPrice*/}
              {/* table */}
              {orderDetails[el._id] ?

                <div className='  mx-2'>
                  {/* head table */}
                  <div className='py-2 text-white  h6  bg-danger  item justify-content-between align-item-center row'>
                    <span className=' pt-2 col-3 text-center  border-end'>ID</span>
                    <span className=' p-2 col-1  border-end'>Name</span>
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

                        <span className='p-2 col-1 text-center border-end'>
                          <span>{product.discount}</span>
                          &nbsp; &nbsp;
                          <FontAwesomeIcon icon={['fas', 'edit']} className='icon-edit'
                            onClick={() => {
                              openUpdate[product.productId] ?
                                setOpenUpdate({ ...openUpdate, [product.productId]: false })
                                :
                                setOpenUpdate({ ...openUpdate, [product.productId]: true })
                            }}
                          />
                          {userData.role === "Admin" && openUpdate[product.productId] ?
                            <span className="col-12 justify-content-center align-item-center row bg-black">

                              <span className='p-2 col-10 text-center rounded-5'>
                                <input className='w-100'
                                  placeholder='new discount'
                                  onChange={(el) => {
                                    let products = [{
                                      productId: product.productId,
                                      discount: el.target?.value,
                                    }]
                                    setNewData((prevData) => ({
                                      ...prevData,
                                      products
                                    }))
                                  }}
                                  type="text" />

                              </span>


                            </span>
                            : " "
                          }
                        </span>

                        <span className='p-2 col-1 text-center border-end'>{product.unitPrice}</span>
                        <span className='p-2 col-1 text-center border-end'>
                          <span> {product.quantity}</span>
                          &nbsp; &nbsp;
                          <FontAwesomeIcon icon={['fas', 'edit']} className='icon-edit'
                            onClick={() => {
                              openUpdate[product.productId] ?
                                setOpenUpdate({ ...openUpdate, [product.productId]: false })
                                :
                                setOpenUpdate({ ...openUpdate, [product.productId]: true })
                            }}
                          />
                          {userData.role === "Admin" && openUpdate[product.productId] ?
                            <span className="col-12 justify-content-center align-item-center row bg-black">

                              <span className='p-2 col-10 text-center rounded-5'>
                                <input className='w-100'
                                  placeholder='new qua'
                                  onChange={(el) => {
                                    let products = [{
                                      productId: product.productId,
                                      quantity: el.target?.value,
                                    }]
                                    setNewData((prevData) => ({
                                      ...prevData,
                                      products
                                    }))
                                  }}
                                  type="text" />

                              </span>


                            </span>
                            : " "
                          }
                        </span>

                        <span className='p-2 col-1 text-center border-end'>
                          <span> {(product?.inchPrice || "______")}</span>
                          &nbsp; &nbsp;
                          {(product?.inchPrice ?
                            <span>
                              <FontAwesomeIcon icon={['fas', 'edit']} className='icon-edit'
                                onClick={() => {
                                  openUpdate[product.productId] ?
                                    setOpenUpdate({ ...openUpdate, [product.productId]: false })
                                    :
                                    setOpenUpdate({ ...openUpdate, [product.productId]: true })
                                }}
                              />
                              {userData.role === "Admin" && openUpdate[product.productId] ?
                                <span className="col-12 justify-content-center align-item-center row bg-black">

                                  <span className='p-2 col-10 text-center rounded-5'>
                                    <input className='w-100'
                                      placeholder='new inchPrice'
                                      onChange={(el) => {
                                        let products = [{
                                          productId: product.productId,
                                          inchPrice: el.target?.value,
                                        }]
                                        setNewData((prevData) => ({
                                          ...prevData,
                                          products
                                        }))
                                      }}
                                      type="text" />

                                  </span>


                                </span>
                                : " "
                              }
                            </span>

                            : " ")}

                        </span>

                        <span className='p-2 col-1'>{product.finalPrice}</span>
                        <span className="py-2 col-1 text-center rounded-5">
                          <Link to={`http://localhost:3000/product/${product.productId}`}>
                            <button className="btn btn-success" onClick={() => { }}>
                              data
                            </button>
                          </Link>
                          <br />
                          <br />
                          {userData.role === "Admin" && openUpdate[product.productId] ?
                            <span className='py-2 col-1 text-center rounded-5'>
                              <button className='btn btn-primary ' onClick={() => { update(el._id) }}> update</button>
                            </span>
                            : " "
                          }
                        </span>

                      </div>
                    );
                  })}

                  <div className='text-white text-center   item  justify-content-end row align-content-center'>
                    <span className='text-black col-2 ps-4 py-2  fs-5'>Final Prise :</span>
                    <span className='col-1 ps-4 py-1 fs-4'>{el.finalPrice}</span>
                  </div>

                  <div className='text-white text-center   item  justify-content-end row align-content-center'>
                    <span className='text-black col-2 ps-4 py-2  fs-5'>Paid :</span>
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
    </div>
  </div >
}



History.propTypes = {};

History.defaultProps = {};

export default History;
