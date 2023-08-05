import React, {useEffect,useState} from 'react'
import logo from '../static/Logo.png'
import '../css/SignUp.css'
import { Link ,useNavigate} from 'react-router-dom'
import {toast } from 'react-toastify';

export default function SignUp() {
  const [name,setName] =useState("")
  const [email,setEmail] =useState("")
  const [userName,setUserName] =useState("")
  const [password,setPassword] =useState("")

  const navigate = useNavigate()

  const notifyA = (data) =>{
    toast.error(data)
  }
  const notifyB = (data) =>{
    toast.success(data)
  }

  const emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passregex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

  const postData = () =>{
    // console.log({
    //   name,
    //   userName,
    //   email,
    //   password
    // })
    //sending data to server

    if(!emailregex.test(email)){
      notifyA("invalid email")
      return
    }else if(!passregex.test(password)){
      notifyA("Password must be at least eight characters long and include a number, letter, special character")
      return
    }

    fetch('/signup',{
      method:"post",
      headers:{
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        name:name,
        userName:userName,
        email:email,
        password:password
      })
    }).then(res => res.json())
      .then(data => {
        if(data.error){
          notifyA(data.error)
        }
        else{
          notifyB(data.message)
          navigate("/signin")
        }
        console.log(data)
      })
  }

  return (
    <div className='signup'>
      <div className="form-container">
        <div className="form">
          <img src={logo} alt="logo" className="signUpLogo" />
          <p className='loginPara'>
            SignUp to see photos and videos <br/> from your friends
          </p>
          <div>
            <input type="email" name='email' id='email' value={email} 
            onChange={(e)=>{
              setEmail(e.target.value)
            }} placeholder='Enter your Email'/>
          </div>
          <div>
            <input type="text" name='name' id='name' value={name} 
            onChange={(e)=>{
              setName(e.target.value)
            }} placeholder='Enter your Full Name'/>
          </div>
          <div>
            <input type="text" name='username' id='username' value={userName} 
            onChange={(e)=>{
              setUserName(e.target.value)
            }} placeholder='Enter your Username'/>
          </div>
          <div>
            <input type="password" name='password' id='password' value={password} 
            onChange={(e)=>{
              setPassword(e.target.value)
            }} placeholder='Enter your Password'/>
          </div>
          <p className="loginPara" style={{fontSize:"12px",margin:"3px 0px",}}>
            By signing up you agree to our terms <br/> privacy policy and cookies.
          </p>
          <input type="submit" id='submitbtn' value="Sign Up" onClick={() =>{postData()}}/>
        </div>
        <div className="form2">
          Already have an account?
          <Link to="/signin">
            <span style={{color:"blue",cursor:"pointer"}}> Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
