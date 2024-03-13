import React from 'react';
import PropTypes from 'prop-types';
import './Footer.css';

const Footer = () => (
  <div className="Footer bg-dark position-fixed bottom-0 end-0 w-100 py-3 ">
    <div className=' container justify-content-center  align-items-center '>
      <div className=''>
        <div className='text-white  fs-6 shadow-lg'>
          <span>Create By Eng . </span>
          <span>Mina Gorge</span>
        </div>
      </div>
    </div>

  </div>
);

Footer.propTypes = {};

Footer.defaultProps = {};

export default Footer;
