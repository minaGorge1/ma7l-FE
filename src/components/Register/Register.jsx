import { useFormik } from 'formik';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Register.css';
import * as Yup from "yup"
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';



export default function Register() {

  let navigate = useNavigate()
  const [islouding, setislouding] = useState(false)
  const [messageError, setmessageError] = useState('')


  async function handleRegister(values) {
    setislouding(true)
    let { data } = await axios.post("http://localhost:5000/auth/sign_up", values).catch(errr => {
      setislouding(false)
      setmessageError(`${errr.response.data.errors.param} => ${errr.response.data.errors.msg}`)
    })

    if (data.message === "Done") {
      setislouding(false)
      navigate("/login")
    }
  }


  let validation = Yup.object({
    userName: Yup.string().required("User name is required"),
    password: Yup.string().required("password is required").min(2, "Password must be at least 2"),
    cPassword: Yup.string().required("rePassword is required").oneOf([Yup.ref('password')], 'password and rePassword doesnt match'),
  }).required()
  /*  function validate(values) {
     let errors = {};
 
     if (!values.userName) {
       errors.userName = 'userName is Required'
     }
     else if (values.userName.length < 3) {
       errors.userName = 'userName minlength is 3'
     }
     else if (values.userName.length > 10) {
       errors.userName = 'userName maxlength is 10'
     }
 
     /*  if (values.email) {
        errors.email = 'Email is Required'
      }
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      } 
 
     if (!values.password) {
       errors.password = 'password is Required'
     }
 
     if (!values.cPassword) {
       errors.cPassword = 'cPassword is Required'
     }
     else if (values.cPassword !== values.password) {
       errors.cPassword = 'cPassword and password doesnt match'
     }
 
     return errors;
   } */

  let formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
      cPassword: ""
    },
    validationSchema: validation,  /* validate */
    onSubmit: handleRegister
  })
  return <>
    <div className="w-75 mx-auto py-4">

      <h1> Register now :</h1>

      {messageError.length > 0 ? <div className='alert alert-danger'>{messageError}</div> : null}

      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="userName">User Name :</label>
        <input onBlur={formik.handleBlur} className='form-control mb-2 ' onChange={formik.handleChange} value={formik.values.userName} type="text" name='userName' id='userName' />
        {formik.errors.userName && formik.touched.userName ? <div className="alert alert-danger">{formik.errors.userName}</div> : null}

        <label htmlFor="password">Password :</label>
        <input onBlur={formik.handleBlur} className='form-control mb-2 ' onChange={formik.handleChange} value={formik.values.password} type="password" name='password' id='password' />
        {formik.errors.password && formik.touched.password ? <div className="alert alert-danger">{formik.errors.password}</div> : null}

        <label htmlFor="cPassword">rePassword :</label>
        <input onBlur={formik.handleBlur} className='form-control mb-2 ' onChange={formik.handleChange} value={formik.values.cPassword} type="password" name='cPassword' id='cPassword' />
        {formik.errors.cPassword && formik.touched.cPassword ? <div className="alert alert-danger">{formik.errors.cPassword}</div> : null}

        <br />

        {islouding ? <button type='button' className='btn btn-dark text-white'><FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" /></button>
          : <button disabled={!(formik.isValid && formik.dirty)} type='submit' className='btn btn-dark text-white'>Register</button>}


      </form>
    </div>

  </>

}
Register.propTypes = {};

Register.defaultProps = {};

