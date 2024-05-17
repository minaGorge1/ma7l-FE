import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTitle();
  }, []);

  async function getTitle() {
    try {
      const { data } = await axios.get("http://127.0.0.1:5000/title?isDeleted=false");
      setTitles(data.title);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="Home ">

      <div className='container d-flex col-10 align-items-center justify-content-center'>

        <div className='w-100'>
          <p className='fs-2 py-1 ps-2'>Youseef Henin products</p>
          <hr />
          <div className='container align-content-center'>
            <div className='row justify-content-around'>
            {titles?.map((title, index) => (

              <div className="list-unstyled nav-item dropdown  col-5" key={index}>
                <Link className=" btn btn-outline-dark p-2 my-2 mx-3 w-100 fs-4 dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {title.name}
                </Link>
                
                <div className='position-relative '>
                <ul className="dropdown-menu w-75 ">
                  {title.category?.map((category) => (
                    
                    <Link
                      className="dropdown-item w-75 d-block text-start mx-3"
                      to={'/categorydetils/' + category._id  }
                      key={category._id}
                    >
                      {category.name}
                    </Link> 
                  ))}
                  
                </ul>
                </div>
                </div>

            ))}
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : null}

      </div>
      </div>
    </div>
  );
}

export default Home;
