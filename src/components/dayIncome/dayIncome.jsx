import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import './dayIncome.css';
import axios from 'axios';

import moment from 'moment/moment';

function DayIncome({ userData }) {


  const now = new Date();
  /* const hours = now.getHours();
  const time = `${hours > 12 ? hours - 12 : hours} : ${now.getMinutes()} ${hours >= 12 ? 'PM' : 'AM'}`; */
  const dateNow = moment(now).format('DD-MM-YYYY');

  //income
  const [income, setIncome] = useState({});

  //to show or hide details order
  const [openUpdate, setOpenUpdate] = useState({})

  //update data for the selected item
  const [NewData, setNewData] = useState({});

  //startDate 
  const [startDate, setStartDate] = useState(dateNow);


  const headers = {
    "authorization": `Min@__${localStorage.getItem("token")}`
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  useEffect(() => {
    if (startDate) {
      getDate();
    }
    setLoading(false);

  }, []);


  async function getDate() {
    const newData = { date: startDate };
    const api = "http://127.0.0.1:5000/income/create";

    console.log(api, newData, { headers });

    try {
      setLoading(true);

      const { message, ...resultData } = (await axios.post(api, newData, { headers })).data;

      if (message === "Done") {
        setIncome(resultData.income)
        console.log(income);
      } else {
        // setOrders([])
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }




  /* async function update(id) {

    try {
      let api = `http://127.0.0.1:5000/order/${id}/update`
      const { data } = await axios.put(api, NewData, { headers })
      if (data.message === "Done") {
        getDate()
      }
    } catch (error) {
      setError(error.response.data.message);
    }

  } */



  return <div className="DayIncome my-5 pb-2">
    {/* day income Component */}


    <div className="justify-content-between container align-item-center row">



      <div className="justify-content-around container align-item-center row mb-3">
        <div className='row '>


          {/* {date}*/}
          <div className='py-2 col-4 align-item-center justify-content-around '>
            <div className='row  '>
              <span className='col-3'>date: </span>
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


      {loading ? (
        <div className="text-center">
          <span>Loading products...</span>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (<div className='  p-3'>
        <div className='justify-content-between container align-item-center row my-2'>
          <h2 className='text-center'> daily mony</h2>
          <hr />
          <div>
            <ul className='justify-content-between container align-item-center row my-2'>
              <span className="col-3 fs-4">date :</span>
              <span className='col-3 fs-4'>{income.date}</span>
            </ul>
            <ul className='justify-content-between container align-item-center row my-2'>
              <span className="col-3 fs-4">mony :</span>
              <span className='col-3 fs-4'>{income.mony}</span>
            </ul>
            <ul className='justify-content-between container align-item-center row my-2'>
              <span className="col-3 fs-4">profDay :</span>
              <span className='col-3 fs-4'>{income.profDay}</span>
            </ul>
            <ul className='justify-content-between container align-item-center row my-2'>
              <span className="col-3 fs-4">monyCheck :</span>
              <span className='col-3 fs-4'>{income.monyCheck}</span>
            </ul>
            <ul className='justify-content-between container align-item-center row my-2'>
              <span className="col-3 fs-4">description :</span>
              <span className='col-3 fs-4'>{income.description}</span>
            </ul>
            {/* expenses */}
          </div>

        </div>

      </div>)
      }
    </div>
  </div >
}



DayIncome.propTypes = {};

DayIncome.defaultProps = {};

export default DayIncome;
