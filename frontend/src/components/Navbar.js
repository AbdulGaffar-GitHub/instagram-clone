import React,{useContext} from 'react'
import logo from "../static/Logo.png"
import "../css/Navbar.css"
import { Link } from 'react-router-dom'
import { loginContext } from '../context/loginContext'
import { useNavigate } from 'react-router-dom'

function Navbar(login) {

  const navigate = useNavigate()
  const{setModalOpen} = useContext(loginContext)

  const loginStatus = () =>{
    const token = localStorage.getItem("jwt")
    //console.log(token)
    if(token ){
      return[
        <>
          <Link to="/createPost">
              <li>Create Post</li>
          </Link>
          <Link to="/profile">
            <li>Profile </li>
          </Link> 
          <Link to="/myfollowingpost">
            <li>My Following</li>
          </Link> 
          <Link to={""}>
            <button className="primaryBtn" onClick={() =>{
              setModalOpen(true)
            }}>Log Out</button>
          </Link> 

        </>
      ]
    }
    else{
      return [
        <>
          <Link to="/signup">
            <li>SignUp</li>
          </Link>
          <Link to="/signin">
              <li>SignIn</li>
          </Link>
        </>
      ]
    }
  }

  return (
    <div className='navbar'>
      <img src={logo} onClick={() =>{navigate("/")}} alt="instagram"/>
      <ul className="nav-menu">
        {loginStatus()}
      </ul>
    </div>
  )
}

export default Navbar
