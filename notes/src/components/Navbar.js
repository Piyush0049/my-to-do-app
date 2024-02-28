import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { context } from '..'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import { bserver } from '../App'
import axios from 'axios'
import { useEffect } from 'react'
const Navbar = () => {
  const navigate = useNavigate();
  let log = "Login";
  const { isauthenticated, isloading, setisauthenticated, setisloading } = useContext(context);
  if (isauthenticated) {
    log = "Switch account"
  }
  else {
    log = "Login"
  }
  const handlelogout = async (e) => {
    e.preventDefault();
    try {
      setisloading(true);
      const confirm = window.confirm("Are you sure want to logout");
    if (confirm) {
        setisloading(true);
        const { data } = await axios.get(`${bserver}/user/logout`, {
          withCredentials: true,
        });
      toast.success(data.message);
      setisloading(false);
      setisauthenticated(false)
      navigate("/login")
      console.log(data)
      log = "Login";
    }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message)
      setisloading(false);
      setisauthenticated(true)
    }
  };

  const deleteuser = async (e) => {
    e.preventDefault();
    try{
      setisloading(true);
      const confirm = window.confirm("Are you sure you want to permanently delete your account?");
      if (confirm) {
        const { data } = await axios.delete(`${bserver}/user/delete`, {
          withCredentials: true,
        });
        toast.success(data.message);
        setisloading(false);
        setisauthenticated(false);
        navigate("/login");
        console.log(data);
      } }
      catch (error) {
        console.error(error);
        toast.error(error.response.data.message)
        setisloading(false);
        setisauthenticated(true)
      }
  }
  const getprofile = async (e)=>{
    try {
      setisloading(true);
      const { data } = await axios.get(`${bserver}/user/getprofile`, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
      setisloading(false);
      setisauthenticated(true)
      
      console.log(data)

    } catch (error) {
      console.error(error);
      setisloading(false);
      setisauthenticated(false)
    }
  }
  useEffect(() => {
    getprofile();
  }, []);
  
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">To-Do Work</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" aria-disabled="true" to="/addtask">Create Task</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-disabled="true" to="/about">About</Link>
              </li>
            </ul>
            <ul className="navbar-nav" style={{ position: "absolute", right: "18px" }}>
              <li className="nav-item my-4">
                <Link className="nav-link active" aria-current="page" to="/login">{log}</Link>
              </li>
              <li className="nav-item my-4">
                <Link className="nav-link active" aria-current="page" to="/signup">Sign up</Link>
              </li>
              {isauthenticated ? (
                <li className="nav-item my-4">
                  <Link className="nav-link active" aria-current="page" onClick={handlelogout} to="/login">Logout</Link>
                </li>
              ) : null}
              {isauthenticated ? (
                <li className="nav-item my-4 mx-3">
                <i class="fa-solid fa-user-minus" onClick={deleteuser} style={{color: "white", marginTop : "13px",cursor: "pointer" }}></i>
  
                  </li>
              ) : null}
              

            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
