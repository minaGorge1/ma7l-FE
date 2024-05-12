import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Create.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

//brand - product  - order - subcategory - category - title - customer

//brand & title
/*
export const createTitle = joi.object({
    name:joi.string().min(2).max(50).required(),
    }).required()

http://127.0.0.1:5000/brand/create/
name:joi.string().min(2).max(50).required(),
{
    "name":"55w"
}
*/

//category
/*
export const createCategory = joi.object({
    name: joi.string().min(2).max(50).required(),
    titleId: generalFields.id,
}).required()

http://localhost:5000/category/create/t/65edac6e344ad998990d10cc
name: joi.string().min(2).max(50).required(),
    titleId: generalFields.id,
    {
     "name": "22w2"
}

*/

//subcategory
/*
http://localhost:5000/subcategory/create/c/65edaffb5c1e8ec217135ee1

 export const createSubcategory = joi.object({
    categoryId: generalFields.id,
    name:joi.string().min(2).max(50).required(),
    details: joi.object()
}).required()

    {
    "name": "17",
    "details": {
        "inchPrice": 1.6
    }
}
*/

//customer
/*
http://localhost:5000/customer/create

name: joi.string().max(20).required(),
    phone: joi.array().items(joi.number().required()),
    address: joi.string(),
    mony: joi.number(),
    description: joi.string(),
    status: joi.string().valid('صافي', 'ليه فلوس', 'عليه فلوس').default('صافي'),

{
    "name": "sss",
    "phone": ["01009557026"],
    "address": "sh16",
    mony: 111 ,
    "description": "tager",
    status  enum: ["صافي","ليه فلوس", "عليه فلوس"]
}
*/

//product
/* 
http://127.0.0.1:5000/product/create

export const createProduct = joi.object({
    name: joi.string().min(2).max(50).required(),
    description: joi.string(),
    stock: joi.number().positive().integer().min(1).required(),
    finalPrice: joi.number().positive().min(1).required(),
    realPrice: joi.number().positive().min(1).required(),
    details: joi.object(),
    titleId: generalFields.id,
    categoryId: generalFields.id,
    brandId: generalFields.id,
    subcategoryId: generalFields.id,
}).required()

{
    "name": "555",
     "details": "", //obj
    "stock": "55",
    "realPrice": "110",
    "finalPrice": "15",
    finalPrice
     "description": "", 
    "titleId": "657c656b1935a2a5ad47c237",
    "categoryId": "657c6c98641ad2876dfd0244",
    "subcategoryId": "65eb25b1e750a304c1fbc895",
    "brandId": "657f24fb8765541de7c04ab2"
}
*/

function Create() {

  //loading...
  const [loading, setLoading] = useState(false);
  //error massege
  const [error, setError] = useState(null);
  //update data for the selected item
  const [NewData, setNewData] = useState({});
  //form name
  const [formName, setFormName] = useState()

  // all ids relationship in result to get it all
  const [ids, setIds] = useState(["categoryId", "subcategoryId", "titleId", "brandId"])

  const [freshData, setFreshData] = useState({})

  const [waitedIds, setWaitedIds] = useState({})

  const [selectedItem, setSelectedItem] = useState({});



  const [allIds, setAllIds] = useState({})
  
  const [objectForm, setObjectForm] = useState({})
  const [forms, setForms] = useState([
    {
      formName: "brand",
      form: {
        name: ""
      },
      api: "http://127.0.0.1:5000/brand/create/"
    },
    {
      formName: "product",
      form: {
        name: "",
        details: "", //obj
        stock: 0,
        realPrice: 1,
        finalPrice: 1,
        description: "",
        titleId: "",
        categoryId: "",
        subcategoryId: "",
        brandId: ""
      },
      api: "http://127.0.0.1:5000/product/create"
    },
    {
      formName: "subcategory",
      form: {
        titleId: "",
        categoryId: "",
        name: "",
        details: {
          inchPrice: ""
        }
      },
      api: `http://localhost:5000/subcategory/create/c/${NewData.categoryId}`
    },
    {
      formName: "category",
      form: {
        name: "",
        titleId: ""
      },
      api: `http://localhost:5000/category/create/t/${NewData.titleId}`
    },
    {
      formName: "title",
      form: {
        name: ""
      },
      api: "http://127.0.0.1:5000/title/create/"
    },
    {
      formName: "customer",
      form: {
        name: "",
        phone: [""],
        address: "",
        mony: null,
        description: "",
        status: ["صافي", "ليه فلوس", "عليه فلوس"]
      },
      api: "http://127.0.0.1:5000/customer/create/"
    }])


  const headers = {
    "authorization": `Min@__${localStorage.getItem("token")}`
  }

  useEffect(() => {
    handleIds()
    getIdsData()

  }, []);


  async function getForm(item) {
    /* setWaitedIds({}); */
    const filteredForms = forms.filter((el) => el.formName === item);
    setFormName(item)
    setObjectForm({ name: item, form: filteredForms[0].form })
    await handleIds()

  }

  async function handleIds() {
    if (objectForm.form) {
      for (const key of Object.keys(objectForm.form)) {
        if (ids.includes(key)) {
          setWaitedIds((prevWaitedIds) => ({
            ...prevWaitedIds,
            [key.split("I")[0]]: ""  // Assuming you want to initialize the value to an empty string
          }));
        }
      }
    }
  }




  async function getIdsData() {
    setLoading(true);
    try {
      await Promise.all(ids.map(async (el) => {
        el = el.split("I")[0];
        let api = `http://127.0.0.1:5000/${el}`;
        const response = await axios.get(api);
        const { message, ...data } = response.data;

        // Process data for each request
        if (message === "Done") {
          setFreshData((prevState) => ({
            ...prevState,
            [el]: data[el],
          }));
          await handleDisplay() 
        }
      }));
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }
   
  async function handleDisplay() {
    console.log(allIds);
  
    for (const key of Object.keys(freshData)) {
      if (waitedIds.includes(key)) {
        console.log(freshData[key]);
        setAllIds((prevAllIds) => ({
          ...prevAllIds,
          [key]: freshData[key]
        }));
      }
    }
  }
  
  
  async function create(formName) {
    try {

      const selectedApi = forms.find((form) => form.formName === formName);

      if (!selectedApi) {
        throw new Error('api not found');
      }


      const { api } = selectedApi;
      console.log(api);
      const { data } = await axios.post(api, NewData, { headers });

      if (data.message === 'Done') {
        // Handle success
        console.log("done");
      }
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  }



  return <div className="Create my-5">


    <div className='container '>
      <div className='justify-content-center align-item-center bg-light p-3'>
        <div className='row'>
          <span className='col-5 fs-4'>choose what you want to Create → </span>
          <div className=" dropdown col-5">
            <div className="nav-item dropdown btn btn-outline-success">
              <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Create
              </Link>
              <ul className="dropdown-menu">
                {forms.map((e, Key) => (
                  <button key={Key} onClick={() => getForm(e.formName)}
                    className="dropdown-item w-75 d-block text-start mx-3">
                    {e.formName}
                  </button>
                ))}
              </ul>
            </div>
          </div>




          {loading ?
            <div className='text-danger'>Loading...</div>
            : <>
              {objectForm.name ? <div className='mt-4'>
                <div className=''>
                  <hr className='w-75' />
                  <span className='fs-1 me-3'>form Name :</span><span className='fs-1 fw-bold'>{objectForm.name}</span>
                  <hr className='w-50' />
                </div>

                <div>
                  {Object.keys(objectForm.form)?.map((element, key) =>
                    <div className='m-2 bg-light p-2 rounded mb-4 row justify-content-between align-content-center' key={key}>
                      <>
                        <span className='col-2 fs-4'>
                          {ids.includes(element) ? element.split("I")[0] :
                            (formName === "subcategory" ? (element === "details" ? "inchPrice" : element) : element)}
                        </span>

                        <span className='d-inline col-10 fs-4'>
                          {ids.includes(element) ?
                            <div className=" dropdown col-2">
                              <div className="nav-item dropdown btn btn-outline-primary">
                                <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                  {Object.keys(selectedItem)?.some((k) => k === element.split("I")[0]) ? selectedItem[element.split("I")[0]] : 'Select an item'}
                                </Link>
                                <ul className="dropdown-menu">

                                  {(allIds?[element.split("I")[0]] : [])?.map((item, i) => ( 
                                    <button key={i}

                                      onClick={(e) => {
                                        setNewData((prevData) => ({
                                          ...prevData,
                                          [element]: item._id

                                        }));
                                        setSelectedItem({ [element.split("I")[0]]: item.name });  // Update the selected item
                                      }}

                                      className="dropdown-item w-75 d-block text-start mx-3">
                                      {item.name}
                                    </button>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            :
                            <input className='d-inline fs-4' type="text" onChange={(el) => {
                              let updatedValue = el.target.value;
                              let newKey = element

                              setNewData((prevData) => ({
                                ...prevData,
                                [newKey]: element === "details" ? { inchPrice: updatedValue } : updatedValue
                              }));
                            }} />}

                        </span>
                      </>
                    </div>

                  )}

                </div>


                <button className='btn col-1 btn-primary' onClick={() => create(formName)}> create</button>

                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p>Error: {error}</p>
                ) : null}

              </div> : ""}
            </>}



        </div>
      </div>



    </div>
  </div >

}



Create.propTypes = {};

Create.defaultProps = {};

export default Create;
