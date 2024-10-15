import React, { useCallback, useEffect, useState } from 'react';
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

  //to show or hide details expenses
  const [openUpdate, setOpenUpdate] = useState(false)

  //update data for the selected item
  const [NewData, setNewData] = useState({});

  //total Money 
 const [totalMoney, setTotalMoney] = useState(0)


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
      // reset the input fields
      setNameE('');
      setMonyE('');
      setDescriptionE('');
      setMonyCheck("")
      setTotalMoney(() => {
        const totalExpenses = income.expenses.reduce((acc, expense) => acc + expense.monyE, 0);
        return income.mony - totalExpenses;
      })
    }
    setLoading(false);

  }, []);

  const [dataUpdate, setDataUpdate] = useState({ expenses: [], monyCheck: {} }); // initialize an empty array to store the data
  const [nameE, setNameE] = useState(''); // initialize state for name input
  const [monyE, setMonyE] = useState(''); // initialize state for money input
  const [descriptionE, setDescriptionE] = useState('empty'); // initialize state for money input
  const [monyCheck, setMonyCheck] = useState(''); // initialize state for money input





  async function getDate() {
    const newData = { date: startDate };
    const api = "http://127.0.0.1:5000/income/create";


    try {
      setLoading(true);

      const { message, ...resultData } = (await axios.post(api, newData, { headers })).data;

      if (message === "Done") {
        setIncome(resultData.income)
        console.log(resultData.income);

      } else {

      }
    } catch (error) {
      setIncome({})
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  async function createNewData() {
    // create a new object with the input data
    const newData = descriptionE
      ? [{ nameE, monyE, descriptionE }]
      : [{ nameE, monyE }];


    console.log(monyCheck);
    if (nameE) {
      update({ expenses: newData });
    } else if (monyCheck) {
      /* await setDataUpdate({ ...dataUpdate, monyCheck }); */
      update({ monyCheck: monyCheck })
    }
    setNameE('');
    setMonyE('');
    setDescriptionE('');
    setMonyCheck('');
    /* await update(dataUpdate) */
  }


  async function update(dataN) {
    console.log(dataN);

    try {

      let api = `http://127.0.0.1:5000/income/${income._id}/update`
      const { message, ...resultData } = (await axios.post(api, dataN, { headers })).data;
      /* console.log(data.income.monyCheck); */
      console.log("After update:", dataUpdate);

      if (message === "Done") {
        console.log(resultData.income);
        setIncome(resultData.income)
        dataUpdate(" ");

      }
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data.message);
    }

  }

  const handleEditExpense = (expense) => {
    // code to handle editing an expense
  };

  const handleAddExpense = () => {
    // code to handle adding a new expense
  };

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
      <hr />

      {loading ? (
        <div className="text-center">
          <span>Loading products...</span>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (


        income.date ? (
          // render content when income is true
          <div className='  p-3'>
            {/* expenses */}
            <div className='p-2 bg-opacity-25 bg-secondary justify-content-between container align-item-center border border-2 border-black rounded-2'>
              <div className='row'>
                <span className="col-3 fs-4">Almasrif :</span>
                <br />
                <br />
                <div className='justify-content-around align-item-center  input-group p-1 fs-4'>
                  <input
                    className='col-5 rounded-2'
                    placeholder="name..."
                    value={nameE}
                    onChange={(e) => setNameE(e.target.value)}
                  />
                  <input
                    className='col-5  rounded-2'
                    placeholder="mony..."
                    value={monyE}
                    onChange={(e) => setMonyE(e.target.value)}
                  />

                  <br />


                  <div className='justify-content-around align-item-center  input-group my-1 fs-4'>
                    <input
                      className='rounded-2 col-8 mt-2'
                      placeholder="descriptionE..."
                      value={descriptionE}
                      onChange={(e) => setDescriptionE(e.target.value)}
                      style={{ resize: "none" }}
                    />


                    <button
                      className='col-2 mt-2 btn btn-primary rounded-2'
                      onClick={() => {
                        createNewData()
                      }}
                    >
                      Add
                    </button>
                  </div>

                </div>
              </div>
            </div>

            <br />
            <br />
            <hr />
            {/* daily mony */}

            <div className='justify-content-between container align-item-center row my-2 '>
              <h2 className='text-center'> daily mony</h2>
              <hr />
              <div className='bg-secondary bg-opacity-10'>
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
                  <div className=" container my-2 border border-2 border-black rounded-2">
                    <div className="row container justify-content-start align-item-center my-2 ">
                      <span className="col-2 fs-4">expenses :</span>
                      <button
                        className='col-2 btn btn-success rounded-2'
                        onClick={() => {!openUpdate? setOpenUpdate(true) : setOpenUpdate(false)}}
                      >
                        edit
                      </button>
                    </div>

                    {income.expenses ? (
                      income.expenses.map((expense, index) => (
                        <div key={index} className="row justify-content-between align-item-center my-2 container">
                          <span className="col-2 fs-4">{expense.nameE}</span>
                          <input  className="col-1 fs-4"/>
                          <span className="col-2 fs-5">{expense.descriptionE}</span>
                          <input  className="col-2 fs-4"/>
                          <span className="col-2 fs-4">{expense.monyE}</span>
                          <input  className="col-1 fs-4"/>
                          {openUpdate ?
                            <button
                              className='col-1 mx-1 btn btn-success rounded-2'
                              onClick={() => handleEditExpense(expense)}
                            >
                              edit
                            </button>
                            : " "}
                         {openUpdate ? 
             
                          <button className='col-1 btn btn-danger rounded-2' 
                          onClick={() => handleAddExpense(expense._id)} > delete </button>

: " "}
                        </div>
                      ))
                    ) : (
                      <span>No expenses found</span>
                    )}
                  </div>
                </ul>

                <ul className='justify-content-between container align-item-center row my-2'>
                  <span className="col-3 fs-4">total money :</span>
                  <span className='col-3 fs-4'>{totalMoney}</span>
                </ul>

                <ul className='justify-content-between container align-item-center row my-2'>
                  <span className="col-3 fs-4">monyCheck :</span>
                  {/* <span className='col-3 fs-4'>{income.monyCheck}</span> */}
                  <div className="col-3 fs-4">
                    <input
                      className='col-6 me-3  rounded-2'
                      placeholder={income.monyCheck}
                      value={monyCheck}
                      onChange={(e) => setMonyCheck(e.target.value)}
                    />
                    <button
                      className='col-3 btn btn-primary rounded-2'
                      onClick={() => { createNewData() }}
                    >
                      Add
                    </button>
                  </div>


                </ul>
                <ul className='justify-content-between container align-item-center row my-2'>
                  <span className="col-3 fs-4">description :</span>
                  <span className='col-3 fs-4'>{income.description}</span>
                </ul>

              </div>

            </div>

          </div>

        ) : (
          // render content when income is false
          <div className=' text-danger text-center fs-4'>Income is false!</div>
        )
      )


      }
    </div>
  </div >
}



DayIncome.propTypes = {};

DayIncome.defaultProps = {};

export default DayIncome;
