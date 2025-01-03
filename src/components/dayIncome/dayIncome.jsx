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
  const [newData, setNewData] = useState([{ nameE: "", monyE: " ", descriptionE: " ", _id: " " }]);


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

    }
    setLoading(false);

  }, [/* income */]);

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
      console.log( { message, ...resultData }); 
      if (message === "Done" ) {
        setIncome(resultData.income)

        setTotalMoney(() => {
          const totalExpenses = resultData.income.expenses.reduce((acc, expense) => {
            return expense.isDeleted ? acc : acc + expense.monyE;
          }, 0);
          return resultData.income.mony - totalExpenses;
        })

      } else {
        
        
        return setIncome( )
      }
    } catch (error) {
      setIncome({})
      setError(error?.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  async function createNewData() {
    // create a new object with the input data
    const newData = descriptionE
      ? [{ nameE, monyE, descriptionE }]
      : [{ nameE, monyE }];

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

    try {

      let api = `http://127.0.0.1:5000/income/${income._id}/update`
      const { message, ...resultData } = (await axios.post(api, dataN, { headers })).data;


      if (message === "Done") {
 
        setIncome(resultData.income)
        dataUpdate(" ");
        getDate()
      }
    } catch (error) {
      setError(error.response.data.message);
    }

  }

  function handleDeleteExpense(id) {
    // code to handle adding a new expense
    const expenses = [{ _id: id, isDeleted: true }]
    update({ expenses })
  };

  return <div className="DayIncome my-5 pb-2 container">
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

            <div className='justify-content-between container align-item-center row mt-2 mb-5 '>
              <h2 className='text-center'> daily money</h2>
              <hr />
              <div className='bg-secondary bg-opacity-10'>
                <ul className='justify-content-between container align-item-center row my-2'>
                  <span className="col-3 fs-4">date :</span>
                  <span className='col-3 fs-4'>{income.date}</span>
                </ul>
                <ul className='justify-content-between container align-item-center row my-2'>
                  <span className="col-3 fs-4">money :</span>
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
                        onClick={() => { !openUpdate ? setOpenUpdate(true) : setOpenUpdate(false) }}
                      >
                        edit
                      </button>
                    </div>

                    {income.expenses ? (
                      income.expenses.map((expense, index) => (
                        expense.isDeleted ? null : (
                          <div key={index} className="row justify-content-between align-item-center my-2 container">
                            <span className="col-2 fs-4">{expense.nameE}</span>
                            {openUpdate ? <input
                              className="col-1 fs-4"
                              type="text"
                              name={`nameE-${index}`}
                              id={`nameE-${index}`}
                              value={newData && newData[index] ? newData[index].nameE : " "}
                              onChange={(e) => {
                                const updatedData = [...newData];
                                updatedData[index] = { nameE: e.target.value, _id: expense._id };
                                setNewData(updatedData);
                              }}
                            /> : " "}

                            <span className="col-2 fs-5">{expense.descriptionE}</span>
                            {openUpdate ? <input
                              className="col-1 fs-4"
                              type="text"
                              name={`descriptionE-${index}`}
                              id={`descriptionE-${index}`}
                              value={newData && newData[index] ? newData[index].descriptionE : " "}
                              onChange={(e) => {
                                const updatedData = [...newData];
                                updatedData[index] = { descriptionE: e.target.value, _id: expense._id };
                                setNewData(updatedData);
                              }}
                            /> : " "}

                            <span className="col-2 fs-4">{expense.monyE}</span>
                            {openUpdate ? <input
                              className="col-1 fs-4"
                              type="text"
                              name={`monyE-${index}`}
                              id={`monyE-${index}`}
                              value={newData && newData[index] ? newData[index].monyE : " "}
                              onChange={(e) => {
                                const updatedData = [...newData];
                                updatedData[index] = { monyE: e.target.value, _id: expense._id };
                                setNewData(updatedData);
                              }}
                            /> : " "}

                            {openUpdate ?
                              <button
                                className='col-1 btn btn-success rounded-2'
                                onClick={() => update({ expenses: newData })}
                              >
                                edit
                              </button>
                              : " "}

                            {openUpdate ?
                              <dev className="row justify-content-end align-item-center my-2 ms-2">
                                <button className='col-1 btn btn-danger rounded-2'
                                  onClick={() => handleDeleteExpense(expense._id)} > delete </button>
                                <br />
                              </dev>

                              : " "}
                          </div>
                        )
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
                  <span className="col-3 fs-4">money Check :</span>
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
