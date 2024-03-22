import React from 'react';
import PropTypes from 'prop-types';
import './Create.css';

//brand - product  - order - subcategory - category - title - customer

//brand & title
/*
http://127.0.0.1:5000/brand/create/
name:joi.string().min(2).max(50).required(),
{
    "name":"55w"
}
*/

//category
/*
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

 categoryId: generalFields.id,
    name:joi.string().min(2).max(50).required(),
    details: joi.object({
      inchPrice: joi.number().positive()
    })

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


function Create() {

 return <div className="Create">
    Create Component
  </div>

}



Create.propTypes = {};

Create.defaultProps = {};

export default Create;
