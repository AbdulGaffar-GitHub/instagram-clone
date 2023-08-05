import React, {useState, useContext}from 'react'
import '../css/SignIn.css'
import logo from '../static/Logo.png'
import { Link ,useNavigate} from 'react-router-dom'
import {toast } from 'react-toastify';
import { loginContext } from '../context/loginContext';

export default function SignIn() {

  const{setuserLogin} = useContext(loginContext)

  const navigate = useNavigate()

  const[email,setEmail]=useState("")
  const[password,setPassword] = useState("")

  const notifyA = (data) =>{
    toast.error(data)
  }
  const notifyB = (data) =>{
    toast.success(data)
  }

  const emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const postData = () =>{
    // console.log({
    //   email,
    //   password
    // })
    //sending data to server

    if(!emailregex.test(email)){
      notifyA("invalid email")
      return
    }

    fetch('/signin',{
      method:"post",
      headers:{
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        email:email,
        password:password
      })
    }).then(res => res.json())
      .then(data => {
        if(data.error){
          notifyA(data.error)
        }
        else{
          notifyB("Signed in successfully")
          console.log(data)
          localStorage.setItem("jwt",data.token)
          localStorage.setItem("user",JSON.stringify(data.user))
          setuserLogin(true)
          navigate("/")
        }
        // console.log(data)
      })
  }

  return (
    <div className='signIn'>
      <div>
        <div className="loginForm">
          <img src={logo} alt="logo" className="signUpLogo" />
          <div>
            <input type="email" name='email' id='email' value={email} 
              onChange={(e)=>{
                setEmail(e.target.value)
              }} placeholder='Enter your Email'/>
          </div>
          <div>
            <input type="password" name='password' id='password' value={password} 
              onChange={(e)=>{
                setPassword(e.target.value)
              }} placeholder='Enter your Password'/>
          </div>
          <input type="submit" value="Sign In" id="loginbtn" onClick={() =>{postData()}} />
        </div>
        <div className="loginForm2">
          Don't have an account?
          <Link to="/signup">
            <span style={{color:"blue",cursor:"pointer"}}> Sign Up</span>
          </Link>
        </div>
      </div>
      
    </div>
  )
}
