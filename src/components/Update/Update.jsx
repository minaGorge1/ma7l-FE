import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Update.css';
import { Link, useParams } from 'react-router-dom'
import axios from 'axios';




function Update() {
  //brand - product  - order - subcategory - category - title - customers

  let { type } = useParams()
  let { id } = useParams()

  const headers = {
    "authorization": `Min@__${localStorage.getItem("token")}`
  }

  const [ids, setIds] = useState(["categoryId", "subcategoryId", "titleId", "brandId"])
  const [display, setDisplay] = useState(["categoryId", "subcategoryId", "titleId", "brandId", "details", "id", "_id", "createdBy", "isDeleted", "createdAt", "updatedAt", "__v", "updatedBy"])
  const [result, setResult] = useState([]);
  const [NewData, setNewData] = useState({});
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true)
    if (getDate(id, type)) {
      setLoading(false)
    }
  }, []);


  async function getDate(id, type) {

    try {
      let api = `http://127.0.0.1:5000/${type}?_id=${id}`
      const { message, ...resultData } = (await axios.get(api)).data;

      let data = Object.values(resultData)
      if (data) {
        let res = data[0][0]
        let filteredObj = Object.keys(res).reduce((acc, key) => {
          if (!display.includes(key)) {
            acc[key] = res[key];
          }
          return acc;
        }, {});
        handleIds(res)
        setResult(res);
        console.log(res);
        setValues(filteredObj)
      }

    } catch (error) {
      setError(error.message);
    }

  }

  /*  function handleValues() {
     const updatedValues = { ...values };
     Object.keys(NewData).forEach((newItem) => {
       if (result.hasOwnProperty(newItem)) {
         updatedValues[newItem] = NewData[newItem];
       }
     });
     setValues(updatedValues);
 
   } */



  async function update() {

    try {
      /* await handleValues() */
      /* result = NewData */
      console.log(NewData);
      let api = `http://127.0.0.1:5000/${type}/${id}/update`
      const { data } = await axios.post(api, NewData, { headers })

      if (data.message === "Done") {
        getDate(id, type)
      }
    } catch (error) {
      setError(error.message);
    }

  }

  function handleIds(res) {
    let filteredObj = Object.keys(res).reduce((acc, key) => {

      if (ids.includes(key)) {
        console.log(key.split("I")[0]);
        acc[key] = res[key];
      }

      return acc;
    }, {});
    console.log(filteredObj);
  }

  /* for (const key in result) {
    if (result.hasOwnProperty(key)) {
      const value = result[key];
      console.log(`Key: ${key}, Value: ${value}`);
    }
  } */



  return (<div className="Update container p-1 mb-5 w-100">

    <div className=''>

      <div className='bg-dark p-3 justify-content-around align-content-center my-2 border border-black'>



        {values ? Object.keys(values)?.map(key => (

          <div className='m-2 bg-light p-2 rounded mb-4 row justify-content-between align-content-center' key={key}>
            <span className='col-5'> Key: {key}, Value: {values[key]} </span>
            <span className='col-2'>New {key} :</span>

            <input className=' col-3 ' onChange={(el) => {
              setNewData((prevData) => ({
                ...prevData,
                [key]: el.target?.value
              }));
            }}
              type="text" name={key} id={key} />
            <button className='btn col-1 btn-primary' onClick={update}> update</button>
          </div>


        )) : "Loading..."}


        {result.details ? Object.keys(result.details)?.map(key => (
          <div className='m-2 bg-light p-2 rounded mb-4 row justify-content-between align-content-center' key={key}>
            <span className='col-5'> Key: {key}, Value: {result.details[key]} </span>
            <span className='col-2'>New {key} :</span>

            <input className=' col-3 ' onChange={(el) => {
              setNewData((prevData) => ({
                ...prevData,
                details: { [key]: el.target?.value }

              }));
            }}
              type="text" name={key} id={key} />
            <button className='btn col-1 btn-primary' onClick={update}> update</button>
          </div>


        )) : ""}

        {result.details ? Object.keys(result.details)?.map(key => (
          <div className='m-2 bg-light p-2 rounded mb-4 row justify-content-between align-content-center' key={key}>
            <span className='col-5'> Key: {key}, Value: {result.details[key]} </span>
            <span className='col-2'>New {key} :</span>

            <input className=' col-3 ' onChange={(el) => {
              setNewData((prevData) => ({
                ...prevData,
                details: { [key]: el.target?.value }

              }));
            }}
              type="text" name={key} id={key} />
            <button className='btn col-1 btn-primary' onClick={update}> update</button>
          </div>


        )) : ""}

      </div>
    </div>



    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p>Error: {error}</p>
    ) : null}

  </div>
  )
};



Update.propTypes = {};

Update.defaultProps = {};

export default Update;
