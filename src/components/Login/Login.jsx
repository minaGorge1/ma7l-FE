
import { useFormik } from 'formik';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from "yup"
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './Login.css';

function Login({ saveUserData }) {
  let navigate = useNavigate()
  const [islouding, setislouding] = useState(false)
  const [messageError, setmessageError] = useState('')


  async function handleLogin(values) {
    setislouding(true)
    let { data } = await axios.post("http://localhost:5000/auth/sign_in", values).catch(errr => {
      setislouding(false)
      setmessageError(`${errr.response.data.errors.param} => ${errr.response.data.errors.msg}`)
    })

    if (data.message === "Done") {

      localStorage.setItem('token', data.access_token);
      saveUserData()
      setislouding(false)
      navigate("/")
    }
  }


  let validation = Yup.object({
    userName: Yup.string().required("User name is required"),
    password: Yup.string().required("password is required").min(2, "Password must be at least 2"),
  }).required()

  let formik = useFormik({
    initialValues: {
      userName: "",
      password: ""
    },
    validationSchema: validation,  /* validate */
    onSubmit: handleLogin
  })
  return <div className='background-login'>
    <div className="w-100 py-4 ">

      <h1 className='text-dark ms-5'> Login now :</h1>

      {messageError.length > 0 ? <div className='alert alert-danger'>{messageError}</div> : null}
      
      <div className=''>
        <form className='text-light bg-black opacity-75 p-3 rounded-4 col-5 ms-5' onSubmit={formik.handleSubmit}>
          <label htmlFor="userName ">User Name :</label>
          <input onBlur={formik.handleBlur} className='form-control mb-2 w-75 text-dark' onChange={formik.handleChange} value={formik.values.userName} type="text" name='userName' id='userName' />
          {formik.errors.userName && formik.touched.userName ? <div className="alert alert-danger w-75">{formik.errors.userName}</div> : null}

          <label htmlFor="password text-white">Password :</label>
          <input onBlur={formik.handleBlur} className='form-control mb-2 w-75' onChange={formik.handleChange} value={formik.values.password} type="password" name='password' id='password' />
          {formik.errors.password && formik.touched.password ? <div className="alert alert-danger w-75">{formik.errors.password}</div> : null}

          <br />

          {islouding ? <button type='button' className='btn btn-black text-white'><FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" /></button>
            : <button disabled={!(formik.isValid && formik.dirty)} type='submit' className='btn btn-dark text-white'>Login</button>}


        </form>
      </div>
    </div>

  </div>

};

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
