import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Update.css';
import { Link, useParams } from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



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


  // id relationship in result 
  let [ownedIds, setOwnedIds] = useState({})

  // all ids relationship in result
  const [idsData, setIdsData] = useState({})

  //objects to undisplayed from result to display data
  const [display, setDisplay] = useState(["category", "Subcategory", "categoryId", "subcategoryId", "titleId", "brandId", "details", "id", "_id", "createdBy", "isDeleted", "createdAt", "updatedAt", "__v", "updatedBy"])

  //update data for the selected item
  const [NewData, setNewData] = useState({});

  //result all
  const [result, setResult] = useState([]);

  //result don't have Ids
  const [values, setValues] = useState({});

  const [selectedItem, setSelectedItem] = useState({});

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
      /*  console.log(resultData[type][0]); */

      if (resultData) {
        let res = resultData[type][0]
        let filteredObj = Object.keys(res).reduce((acc, key) => {
          if (!display.includes(key)) {
            acc[key] = res[key];
          }
          return acc;
        }, {});
        handleIds(res)
        setResult(res);
        setValues(filteredObj)
      }

    } catch (error) {
      setError(error.message);
    }

  }


  async function update() {

    try {
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
        /* console.log(key.split("I")[0]);
        console.log(`${key} = ${res[key]}`); */
        acc[key.split("I")[0]] = res[key];
        getIdsData(key.split("I")[0], res[key])
      }
      setIdsData(acc)
      return acc;
    }, {});

  }

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
      setError(error.message);
      setLoading(false);
    }
  }

  //delete product
  async function deleteData(type, id) {

    try {
      let { data } = await axios.delete(`http://localhost:5000/${type}/${id}/delete`, { headers })
      console.log(`http://localhost:5000/${type}/${id}/delete`);
      if (data.message === 'Done') {
        navigate("/")
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
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
                  <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {Object.keys(selectedItem)?.some((k) => k === key) ? selectedItem[key] : 'Select an item'}
                  </Link>
                  <ul className="dropdown-menu">

                    {allIds[key].map((item, i) => (
                      <button key={i}

                        onClick={(e) => {
                          setNewData((prevData) => ({
                            ...prevData,
                            [`${key}Id`]: item._id

                          }));
                          setSelectedItem({ [key]: item.name });  // Update the selected item
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

        {userData && userData.role === "Admin" && (
          <button className=' ms-2 col-2 btn btn-danger' onClick={() => { deleteData(type, id) }}> delete</button>
        )}

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
