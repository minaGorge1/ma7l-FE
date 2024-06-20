import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './History.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function History() {
  const [orders, setOrders] = useState([])

  const [orderDetails, setOrderDetails] = useState({})
  console.log(orderDetails);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const now = new Date();
  const hours = now.getHours();
  const time = `${hours > 12 ? hours - 12 : hours} : ${now.getMinutes()} ${hours >= 12 ? 'PM' : 'AM'}`;
  const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;

  console.log(`${time} ${date}`)

  useEffect(() => {

    getDate()
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
              <div>
                <span className="py-2 col-2 text-center opacity-50">Time :&nbsp; &nbsp;</span>
                <span className="py-2 col-2 text-center">{el.time}</span>
              </div>

              <div>
                <span className="py-2 col-5 text-center opacity-50">Data :&nbsp; &nbsp;</span>
                <span className="py-2 col-5 text-center">{el.date}</span>
              </div>

              <div>
                <span className="py-2 col-2 text-center opacity-50">id :&nbsp; &nbsp;</span>
                <span className="py-2 col-2 text-center text-danger">{el._id}</span>
              </div>

              <div>
                <span className="py-2 col-1 text-center opacity-50">customer :&nbsp; &nbsp;</span>
                <span className="py-2 col-2 text-center">{el?.customer || "none"}</span>
              </div>

              <div>
                <span className="py-2 col-1 text-center opacity-50">note :&nbsp; &nbsp;</span>
                <span className="py-2 col-2 text-center">{el?.note || "empty"}</span>
              </div>

              <div>
                <span className="py-2 col-1 text-center opacity-50">status :&nbsp; &nbsp;</span>
                <span className="py-2 col-2 text-center">{el.status}</span>
              </div>

              <div>
                <span className="py-2 col-1 text-center opacity-50">profitMargin :</span>
                <span className='col-1 ps-4 py-1 fs-4 realPrice'>{el.profitMargin}</span>
              </div>

              {!orderDetails[el._id] ? <div>
                <div>
                  <span className="py-2 col-1 text-center opacity-50">Final Prise :</span>
                  <span className='col-1 ps-4 py-1 fs-4 '>{el.finalPrice}</span>
                </div>

                <div>
                  <span className="py-2 col-1 text-center opacity-50">Paid :</span>
                  <span className='col-1 ps-4 py-1 fs-4 '>{el.paid}</span>
                </div>
              </div> : " "}



              <div className='text-white text-center   item  justify-content-end row align-content-center'>

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
