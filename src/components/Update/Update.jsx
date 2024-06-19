import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Update.css';
import { Link, useParams } from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { boolean } from 'yup';



function Update({ userData }) {
  //brand - product  - order - subcategory - category - title - customer

  let { type } = useParams()
  let { id } = useParams()
  let navigate = useNavigate()

  const headers = {
    "authorization": `Min@__${localStorage.getItem("token")}`
  }



  // all ids relationship in result to get it all
  const [ids, setIds] = useState(["categoryId", "subcategoryId", "titleId", "brandId"])

  // all anther ids relationship in result to get it all 
  const [allIds, setAllIds] = useState({})
  // all anther ids relationship in result to get it all to display
  const [allIdsDisplay, setAllIdsDisplay] = useState({})

  // id relationship in result 
  let [ownedIds, setOwnedIds] = useState({})



  //objects to undisplayed from result to display data
  const [display, setDisplay] = useState(["category", "subcategory", "categoryId", "subcategoryId", "titleId", "brandId", "details", "createdBy", "createdAt", "updatedAt", "__v", "updatedBy", "isDeleted", "status"])

  //update data for the selected item
  const [NewData, setNewData] = useState({});

  //result all
  const [result, setResult] = useState([]);

  //result don't have Ids
  const [values, setValues] = useState({});

  const [status, setStatus] = useState(["صافي", "ليه فلوس", "عليه فلوس"]);

  const [selectedItem, setSelectedItem] = useState({});

  const [deleteS, setDeleteS] = useState(boolean);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    setLoading(true)
    if (getDate(id, type)) {
      setLoading(false)
    }
  }, []);

  useEffect(() => {

    handleeDataDisplay()
  }, [selectedItem]);



  async function getDate(id, type) {

    try {
      let api = `http://127.0.0.1:5000/${type}?_id=${id}`
      const { message, ...resultData } = (await axios.get(api)).data;


      if (resultData) {
        let res = resultData[type][0]
        let filteredObj = Object.keys(res).reduce((acc, key) => {
          if (!display.includes(key)) {
            acc[key] = res[key];
          }
          setDeleteS(resultData[type][0].isDeleted)
          return acc;
        }, {});
        handleIds(res)
        setResult(res);
        setValues(filteredObj)
      }

    } catch (error) {
      setError(error.response.data.message);
    }

  }

  //update
  async function update() {

    try {
      console.log(NewData);
      let api = `http://127.0.0.1:5000/${type}/${id}/update`
      const { data } = await axios.post(api, NewData, { headers })

      if (data.message === "Done") {
        getDate(id, type)
      }
    } catch (error) {
      setError(error.response.data.message);
    }

  }

  //get wanted ids like title or title and category
  function handleIds(res) {
    let filteredObj = Object.keys(res).reduce((acc, key) => {

      if (ids.includes(key)) {
        acc[key.split("I")[0]] = res[key];
        getIdsData(key.split("I")[0], res[key])
      }

      return acc;
    }, {});

  }
  //get data ids all and wanted
  async function getIdsData(key, id) {
    try {
      let apiAll = `http://127.0.0.1:5000/${key}`;
      let apiOwned = `http://127.0.0.1:5000/${key}?_id=${id}`;


      const responseAll = await axios.get(apiAll);
      const responseOwned = await axios.get(apiOwned);

      const { message: messageAll, ...dataAll } = responseAll.data;
      const { message: messageOwned, ...dataOwned } = responseOwned.data;

      //all
      setAllIds(prevState => {
        if (!prevState[key] || !Array.isArray(prevState[key]) || !prevState[key].some(item => item._id === dataAll[key][0]._id)) {
          return { ...prevState, [key]: dataAll[key] };
        } else {
          return prevState;
        }
      });
      setAllIdsDisplay(prevState => {
        if (!prevState[key] || !Array.isArray(prevState[key]) || !prevState[key].some(item => item._id === dataAll[key][0]._id)) {
          return { ...prevState, [key]: dataAll[key] };
        } else {
          return prevState;
        }
      })

      //owned
      setOwnedIds((prevState) => {
        if (!prevState[key]) {
          return { ...prevState, [key]: dataOwned[key][0] };
        } else {
          return prevState;
        }
      });

      /* This code checks if an object with the key key already exists in
       the ownedIds array and if its _id matches the _id of dataOwned[key][0].
       If such an object does not exist, it adds a new object to the ownedIds array 
       with the key key and the value dataOwned[key][0].
       Otherwise, it returns the current prevState unchanged. */

      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  }
  //handle ids display
  function handleeDataDisplay() {
    Object.keys(selectedItem).forEach((keyS) => {
      if (allIds[keyS]) {
        const selectedItemData = allIds[keyS].find((el) => el.name === selectedItem[keyS]);

        if (selectedItemData) {
          Object.keys(selectedItemData).forEach((key) => {
            if (allIds[key]) {
              setAllIdsDisplay((prev) => ({
                ...prev,
                [key]: selectedItemData[key]  // Assuming you want to initialize the value to an empty string
              }));
            }
          });
        }
      }
    });
  }

  //delete product
  async function deleteData(type, id) {

    try {
      let { data } = await axios.delete(`http://localhost:5000/${type}/${id}/delete`, { headers })
      if (data.message === 'Done') {
        navigate("../Search")
      }
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  }

  async function restoreData(type, id) {

    try {
      const newData = { "isDeleted": false }
      let api = `http://127.0.0.1:5000/${type}/${id}/update`
      let { data } = await axios.post(api, newData, { headers })

      if (data.message === 'Done') {
        getDate(id, type)
      }
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  }



  return (<div className="Update container p-1 mb-5 w-100">

    <div className=''>

      <div className='bg-dark p-3 justify-content-around align-content-center my-2 border border-black'>


        {values ? Object.keys(values)?.map(key => (

          <div className='m-2 bg-light p-2 rounded mb-4 row justify-content-between align-content-center' key={key}>

            {!(userData.role === "Admin") ? <>
              <span className='col-2 fs-4'>  {key} : </span>
              <span className='col-10 fs-4'> {values[key]}</span>
            </> : ""}



            {userData.role === "Admin" ? <>
              <span className='col-5'> Key: {key},&nbsp; Value:  {values[key]} </span>
              <span className='col-2'>New {key} :</span>

              <input className=' col-3 ' onChange={(el) => {
                setNewData((prevData) => ({
                  ...prevData,
                  [key]: el.target?.value
                }));
              }}
                type="text" name={key} id={key} />


              <button className='btn col-1 btn-primary' onClick={update}> update</button> </> : ""
            }

          </div>


        )) : "Loading..."}


        {result.details ? Object.keys(result.details)?.map(key => (
          <div className='m-2 bg-light p-2 rounded mb-4 row justify-content-between align-content-center' key={key}>

            {!(userData.role === "Admin") ? <>
              <span className='col-2 fs-4'> {key} : </span>
              <span className='col-10 fs-4'> {values[key]}</span>
            </> : ""}

            {userData.role === "Admin" ? <>
              <span className='col-5'> Key: {key},&nbsp; Value: {result.details[key]} </span>
              <span className='col-2'>New {key} :</span>

              <input className=' col-3 ' onChange={(el) => {
                setNewData((prevData) => ({
                  ...prevData,
                  details: { [key]: el.target?.value }

                }));
              }}
                type="text" name={key} id={key} />


              <button className='btn col-1 btn-primary' onClick={update}> update</button> </> : ""
            }
          </div>


        )) : ""}

        {ownedIds ? Object.keys(ownedIds)?.map(key => (
          <div className='m-2 bg-light p-2 rounded mb-4 row justify-content-between align-content-center' key={key}>

            {!(userData.role === "Admin") ? <>
              <span className='col-3 fs-4'>  {key} : </span>
              <span className='col-9 fs-4'>{ownedIds[key]?.name}</span>
            </> : ""}

            {userData.role === "Admin" ? <>
              <span className='col-5'> Key: {key} ,&nbsp; Name: {ownedIds[key]?.name}</span>
              <span className='col-2'>New {key} :</span>

              <div className=" dropdown col-2">
                <div className="nav-item dropdown btn btn-outline-primary">
                  <Link className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {Object.keys(selectedItem)?.some((k) => k === key) ? selectedItem[key] : 'Select an item'}
                  </Link>
                  <ul className="dropdown-menu">

                    {allIdsDisplay[key]?.map((item, i) => (
                      <button key={i}

                        onClick={(e) => {
                          setNewData((prevData) => ({
                            ...prevData,
                            [`${key}Id`]: item._id

                          }));


                          setSelectedItem((prev) => ({
                            ...prev,
                            [key]: item.name
                          }));  // Update the selected item
                          handleeDataDisplay()

                        }}

                        className="dropdown-item w-75 d-block text-start mx-3">
                        {item.name}
                      </button>
                    ))}
                  </ul>
                </div>
              </div>


              <button className='btn col-1 btn-primary' onClick={update}> update</button> </> : ""

            }
          </div>

        )) : ""}



        {result.status ?
          <div className='m-2 bg-light p-2 rounded mb-4 row justify-content-between align-content-center'>

            {!(userData.role === "Admin") ? <>
              <span className='col-3 fs-4'>  status : </span>
              <span className='col-9 fs-4'>{result.status}</span>
            </> : ""}

            {userData.role === "Admin" ? <>
              <span className='col-5'> status : ,&nbsp; {result.status}</span>
              <span className='col-2'>New status :</span>

              <div className=" dropdown col-2">
                <div className="nav-item dropdown btn btn-outline-primary">
                  <Link className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {(selectedItem)?.status ? selectedItem.status : 'Select an item'}
                  </Link>
                  <ul className="dropdown-menu">

                    {status?.map((item, i) => (
                      <button key={i}

                        onClick={(e) => {
                          setNewData((prevData) => ({
                            ...prevData,
                            status: item

                          }));


                          setSelectedItem((prev) => ({
                            ...prev,
                            status: item
                          }));  // Update the selected item
                          handleeDataDisplay()

                        }}

                        className="dropdown-item w-75 d-block text-start mx-3">
                        {item}
                      </button>
                    ))}
                  </ul>
                </div>
              </div>


              <button className='btn col-1 btn-primary' onClick={update}> update</button> </> : ""

            }
          </div>

          : ""}

        {deleteS && userData && userData.role === "Admin" ?
          <>
            <button className=' ms-2 col-2 btn btn-success' onClick={() => { restoreData(type, id) }}> restoration</button>
          </> :
          <>
            <button className=' ms-2 col-2 btn btn-danger' onClick={() => { deleteData(type, id) }}> delete</button>
          </>

        }


      </div>
    </div>



    {
      loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : null
    }

  </div >
  )
};



Update.propTypes = {};

Update.defaultProps = {};

export default Update;
