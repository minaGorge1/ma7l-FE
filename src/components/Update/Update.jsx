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
  const [display, setDisplay] = useState(["_id", "category", "subcategory", "categoryId",
    "subcategoryId", "titleId", "brandId", "details", "createdBy", "createdAt", "updatedAt",
    "__v", "updatedBy", "isDeleted", "status", "transactions"])

  //update data for the selected item
  const [NewData, setNewData] = useState({});

  //result all
  const [result, setResult] = useState([]);

  //result don't have Ids
  const [values, setValues] = useState({});
  // status to dropdown
  const [status, setStatus] = useState(["صافي", "ليه فلوس", "عليه فلوس"]);
  // clarification to dropdown
  const [clarification, setClarification] = useState(["دين", "دفع"]);
  // typeMoney to dropdown
  const [typeM, seTypeM] = useState(["تحويل", "كاش"]);

  const [selectedItem, setSelectedItem] = useState({});

  const [deleteS, setDeleteS] = useState(boolean);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // display Transactions
  const [displayTransactions, setDisplayTransactions] = useState(false);
  // cont Transactions
  const [contTransactions, setContTransactions] = useState(-2);
  // NewData Trans to update
  const [newTransactionData, setNewTransactionData] = useState({});
  // NewData Trans to update id
  const [editTransactionId, setEditTransactionId] = useState(null);

  // open create Transactions
  const [openCreateTrans, setOpenCreateTrans] = useState(false);



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
      let apiAll = `http://127.0.0.1:5000/${key}?isDeleted=false`;
      let apiOwned = `http://127.0.0.1:5000/${key}?_id=${id}&isDeleted=false`;


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

  //delete data
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
  //restore data
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

  //create Transaction
  async function createTransaction(customerId) {
    try {

      let api = `http://127.0.0.1:5000/customer/${customerId}/createTransactions`
      const { data } = await axios.post(api, newTransactionData, { headers })

      if (data.message === "Done") {
        getDate(id, type)
      }
    } catch (error) {
      console.log(error.response.data);

      setError(error.response.data.message);
    }
  }

  //update Transaction
  async function updateTransaction(customerId, transactionsId) {
    try {
      let api = `http://127.0.0.1:5000/customer/${customerId}/updateTransactions/${transactionsId}`
      const { data } = await axios.post(api, newTransactionData, { headers })

      if (data.message === "Done") {
        getDate(id, type)
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  //delete Transaction
  async function deleteTransaction(customerId, transactionsId) {
    try {
      let api = `http://127.0.0.1:5000/customer/${customerId}/deleteTransactions/${transactionsId}`
      const { data } = await axios.delete(api, { headers })

      if (data.message === "Done") {
        getDate(id, type)
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  }
  //display trans
  const toggleTransactions = () => {
    setDisplayTransactions(prev => !prev);
  };

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
              <span className='col-5'> {key}&nbsp; : &nbsp; {values[key]} </span>
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

        {/* details in products */}
        {result.details ? Object.keys(result.details)?.map(key => (
          <div className='m-2 bg-light p-2 rounded mb-4 row justify-content-between align-content-center' key={key}>

            {!(userData.role === "Admin") ? <>
              <span className='col-2 fs-4'> {key} : </span>
              <span className='col-10 fs-4'> {values[key]}</span>
            </> : ""}

            {userData.role === "Admin" ? <>
              <span className='col-5'>  {key}&nbsp; : &nbsp; {result.details[key]} </span>
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

        {/* ids */}
        {ownedIds ? Object.keys(ownedIds)?.map(key => (
          <div className='m-2 bg-light p-2 rounded mb-4 row justify-content-between align-content-center' key={key}>

            {!(userData.role === "Admin") ? <>
              <span className='col-3 fs-4'>  {key} : </span>
              <span className='col-9 fs-4'>{ownedIds[key]?.name}</span>
            </> : ""}

            {userData.role === "Admin" ? <>
              <span className='col-5'>  {key} &nbsp; : &nbsp;{ownedIds[key]?.name}</span>
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


        {/* status in customer */}

        {result.status ?
          <div className='m-2 bg-light p-2 rounded mb-4 row justify-content-between align-content-center'>

            {/* not adamin */}
            {!(userData.role === "Admin") ? <>
              <span className='col-3 fs-4'>  status : </span>
              <span className={`col-9 fs-4 ${result.status === "عليه فلوس" ?
                'text-danger' : result.status === "ليه فلوس" ?
                  'text-primary' : 'text-success'}`}>
                {result.status}
              </span>
            </> : ""}

            {/* dropdown + update to adamin */}
            {userData.role === "Admin" ? <>
              <span className="col-6 ">
                <span className="">status : </span>
                <span className={` fs-4 ${result.status === "عليه فلوس" ?
                  'text-danger' : result.status === 'ليه فلوس' ?
                    'text-primary' : 'text-success'}`}>
                  {result.status}</span>
              </span>


              <span className='col-3'>New status :</span>

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


              <button className='btn col-1 btn-primary' onClick={update}> update</button>
              <div className='justify-content-end align-content-center row pt-2 '>
                <button className='btn col-2 ms-3 btn-success fs-5' onClick={() => {
                  setOpenCreateTrans(!openCreateTrans)
                  /* createTransaction(result._id) */
                }}>create Transaction</button>

              </div>

              {openCreateTrans ?
                <div className='justify-content-start align-content-center row border border-2 border-black p-2 mt-2 mx-1'>

                  <div className='mt-1'>
                    <span className='col-2 fs-5'>
                      <span> clarification : </span>

                      <span className=" dropdown col-2">
                        <div className="nav-item dropdown btn btn-outline-dark">
                          <Link className="nav-link dropdown-toggle"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {!(newTransactionData)?.clarification ? "select clarification" : newTransactionData.clarification}
                          </Link>
                          <ul className="dropdown-menu">

                            {clarification?.map((item, i) => (
                              <button key={i}

                                onClick={(e) => {
                                  setNewTransactionData((prevData) => ({
                                    ...prevData,
                                    clarification: item

                                  }));
                                  handleeDataDisplay()
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

                  <div className='mt-2'>
                    <span className='col-6 fs-5'>
                      <span> type : </span>


                      <span className=" dropdown col-2">
                        <div className="nav-item dropdown btn btn-outline-dark">
                          <Link className="nav-link dropdown-toggle"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {!(newTransactionData)?.type ? "select type" : newTransactionData.type}
                          </Link>
                          <ul className="dropdown-menu">

                            {typeM?.map((item, i) => (
                              <button key={i}

                                onClick={(e) => {
                                  setNewTransactionData((prevData) => ({
                                    ...prevData,
                                    type: item

                                  }));
                                  handleeDataDisplay()
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

                  <div>
                    <span className='col-3 fs-5'>
                      <span> money : </span>

                      <input
                        className='mt-2'
                        placeholder="money"
                        type="number"
                        /* value={newTransactionData?.amount || 0} */
                        onChange={(e) => setNewTransactionData({ ...newTransactionData, amount: e.target.value })}
                      />

                    </span>

                  </div>

                  <div>
                    <span className='col-2 fs-5'>
                      <span> description : </span>

                      <input
                        className='mt-2'
                        placeholder="description"
                        type="text"
                        /* value={newTransactionData?.description || "empty"} */
                        onChange={(e) => setNewTransactionData({ ...newTransactionData, description: e.target.value })}
                      />

                    </span>
                  </div>

                  <div className='justify-content-end align-content-center row mb-2'>

                    {/* // Check if the required fields in newTransactionData are filled */}
                    {newTransactionData.clarification || newTransactionData.type || newTransactionData.amount || newTransactionData.description ? (
                      <button
                        className='btn col-1 me-2 btn-primary'
                        onClick={() => {
                          createTransaction(result._id);

                        }}
                      >
                        Done.!
                      </button>
                    ) : (
                      <button className='btn col-1 me-2 btn-disabled' disabled>
                        Done.!
                      </button>
                    )}
                  </div>

                </div> : null}

            </> : ""
            }


            {result.transactions.length > 0 ? (
              <div className='text-center'>
                <button className="dropbtn col-3 m-2" onClick={toggleTransactions}>
                  {displayTransactions ? 'Hide Transactions' : 'Show Transactions'}
                </button>
              </div>
            ) : null}

            <div className={`dropdown-content mt-2 ${displayTransactions ? 'show' : ''}`}>

              <div className={`text-center fs-4`}>
                <span>Transactions</span>
                <span className='justify-content-end row'>
                  <button className='btn col-1 btn-dark fs-5 me-2' onClick={() => { setContTransactions(prevCount => prevCount - 1) }}>more</button>
                  <button className='btn col-1 btn-dark fs-5 me-2' onClick={() => { setContTransactions(prevCount => prevCount - prevCount) }}>all</button>
                </span>
              </div>
              {result.transactions?.slice(contTransactions).reverse().map((transaction, key) => {

                // Create a Date object
                const date = new Date(transaction.date);

                // Get the day, month, and year
                const day = String(date.getUTCDate()).padStart(2, '0'); // Pad with leading zero if needed
                const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
                const year = date.getUTCFullYear();

                // Get the hour and minute
                let hour = date.getUTCHours(); // Get hour in UTC
                const minute = String(date.getUTCMinutes()).padStart(2, '0'); // Get minutes in UTC and pad with leading zero

                // Convert to 12-hour format
                const ampm = hour >= 12 ? 'PM' : 'AM'; // Determine AM or PM
                hour = hour % 12; // Convert hour to 12-hour format
                hour = hour ? String(hour).padStart(2, '0') : '12'; // Convert 0 to 12 and pad with leading zero if needed

                // Format the date as dd/mm/yyyy and time as HH:mm
                const formattedDate = `${day}/${month}/${year}`;
                const formattedTime = `${hour}:${minute} ${ampm}`;

                return (
                  <div key={key} className={`p-1 my-3 row justify-content-start 
                    align-content-center border border-2 border-black 
                    ${transaction.clarification === "دفع" ?
                      'bg-daf2' : transaction.clarification === "دين" ?
                        'bg-modan' : ''}`}>

                    <div className='row'>
                      <span className='col-2 fs-5'>
                        <span> date : </span>
                        <span> {formattedDate}</span>
                      </span>
                      <span className='col-2 fs-5'>
                        <span> time : </span>
                        <span> {formattedTime}</span>
                      </span>
                    </div>

                    <div className="row">
                      <span className='col-2 fs-5'>
                        <span> clarification : </span>
                        {editTransactionId === transaction._id ?
                          <span className=" dropdown col-2">
                            <div className="nav-item dropdown btn btn-outline-dark">
                              <Link className="nav-link dropdown-toggle"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                {!(newTransactionData)?.clarification ? transaction.clarification : newTransactionData.clarification}
                              </Link>
                              <ul className="dropdown-menu">

                                {clarification?.map((item, i) => (
                                  <button key={i}

                                    onClick={(e) => {
                                      setNewTransactionData((prevData) => ({
                                        ...prevData,
                                        clarification: item

                                      }));
                                      handleeDataDisplay()
                                    }}

                                    className="dropdown-item w-75 d-block text-start mx-3">
                                    {item}
                                  </button>
                                ))}
                              </ul>
                            </div>
                          </span> :
                          <span> {transaction.clarification}</span>
                        }
                      </span>

                      <span className='col-3 fs-5'>
                        <span> type : </span>

                        {editTransactionId === transaction._id ?
                          <span className=" dropdown col-2">
                            <div className="nav-item dropdown btn btn-outline-dark">
                              <Link className="nav-link dropdown-toggle"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                {!(newTransactionData)?.type ? transaction.type : newTransactionData.type}
                              </Link>
                              <ul className="dropdown-menu">

                                {typeM?.map((item, i) => (
                                  <button key={i}

                                    onClick={(e) => {
                                      setNewTransactionData((prevData) => ({
                                        ...prevData,
                                        type: item

                                      }));
                                      handleeDataDisplay()
                                    }}

                                    className="dropdown-item w-75 d-block text-start mx-3">
                                    {item}
                                  </button>
                                ))}
                              </ul>
                            </div>
                          </span> :
                          <span> {transaction.type}</span>
                        }
                      </span>
                    </div>

                    <div >
                      <span className='col-3 fs-5'>
                        <span> money : </span>
                        {/* <span> {transaction.amount}</span> */}
                        {editTransactionId === transaction._id ? (
                          <input
                            className='mt-2'
                            placeholder={transaction.amount}
                            type="number"
                            value={newTransactionData?.amount}
                            onChange={(e) => setNewTransactionData({ ...newTransactionData, amount: e.target.value })}
                          />
                        ) : (
                          <span>{transaction.amount}</span>
                        )}
                      </span>

                    </div>

                    <div>
                      <span className='col-2 fs-5'>
                        <span> description : </span>
                        {/* <span> {transaction.description}</span> */}

                        {editTransactionId === transaction._id ? (
                          <input
                            className='mt-2'
                            placeholder={transaction.description}
                            type="text"
                            value={newTransactionData?.description}
                            onChange={(e) => setNewTransactionData({ ...newTransactionData, description: e.target.value })}
                          />
                        ) : (
                          <span> {transaction.description}</span>
                        )}

                      </span>
                    </div>

                    <div className='justify-content-end align-content-center row mb-2'>
                      {editTransactionId === transaction._id ? (
                        // Check if the required fields in newTransactionData are filled
                        newTransactionData.clarification || newTransactionData.type || newTransactionData.amount || newTransactionData.description ? (
                          <button
                            className='btn col-1 me-2 btn-primary'
                            onClick={() => {
                              updateTransaction(result._id, transaction._id); // Pass newTransactionData to the update function
                              setEditTransactionId(null); // Reset edit state after updating
                            }}
                          >
                            Update
                          </button>
                        ) : (
                          <button className='btn col-1 me-2 btn-disabled' disabled>
                            Update
                          </button>
                        )
                      ) : null}

                      <button className='btn col-1 me-2 btn-success' onClick={() => {

                        { editTransactionId ? setEditTransactionId(null) : setEditTransactionId(transaction._id) }
                      }}> Edit</button>
                      <button className='btn col-1 btn-danger' onClick={() => { deleteTransaction(result._id, transaction._id) }}> delete</button>
                    </div>

                  </div>
                )
              })}

            </div>

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
