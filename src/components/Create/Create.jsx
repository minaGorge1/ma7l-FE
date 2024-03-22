import React, { useState } from 'react';
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [allIds, setAllIds] = useState({})
/*   // all ids relationship in result
  const [idsData, setIdsData] = useState({}) */
  // all ids relationship in result to get it all
 /*  const [ids, setIds] = useState(["categoryId", "subcategoryId", "titleId", "brandId"])
 */
  const [itemCreate, setItemCreate] = useState(["brand", "product", "subcategory", "category", "title", "customer"])
  const [objectForm, setObjectForm] = useState({})
  const [forms, setForms] = useState([
    {
      formName: "brand",
      form: {
        name: ""
      }
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
      }
    },
    {
      formName: "subcategory",
      form: {
        name: "",
        details: {
          inchPrice: ""
        }
      }
    },
    {
      formName: "category",
      form: {
        name: ""
      }
    },
    {
      formName: "title",
      form: {
        name: ""
      }
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
      }
    }])


  function getForm(item) {
    const filteredForms = forms.filter((el) => el.formName === item);

    console.log(filteredForms[0].form)
    setObjectForm(filteredForms[0].form)
    /* handleIds() */

  }


/*   function handleIds() {
    let x = Object.keys(objectForm).reduce((acc, key) => {

      if (ids.includes(key)) {
       console.log(key.split("I")[0]);
        console.log(`${key} = ${objectForm[key]}`); 
        acc[key.split("I")[0]] = objectForm[key];
        getIdsData(key.split("I")[0])
      }
      setIdsData(acc)
      return acc;
    }, {});

  } */


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

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
 /*  console.log(objectForm); */





  return <div className="Create">

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
                {itemCreate.map((item) => (
                  <button key={item} onClick={() => getForm(item)}
                    className="dropdown-item w-75 d-block text-start mx-3">
                    {item}
                  </button>
                ))}
              </ul>
            </div>
          </div>

          {/*       {values ? Object.keys(values)?.map(key => (

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


)) : "Loading..."}*/}



        </div>



      </div>



    </div>
  </div >

}



Create.propTypes = {};

Create.defaultProps = {};

export default Create;
