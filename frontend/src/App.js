import './App.css';
import React,{createContext, useState} from 'react';
import Navbar from './components/Navbar';
import Home from "./components/Home";
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Profile from './components/Profile';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatePost from './components/CreatePost';
import {loginContext} from './context/loginContext'
import Modal from './components/Modal'
import UserProfile from './components/UserProfile';
import MyFollowingPosts from './components/MyFollowingPosts';

function App() {

  const [userLogin,setuserLogin] = useState(false)
  const[modalOpen,setModalOpen] = useState(false)
  return (
    <BrowserRouter>
      <div className="App">
          <loginContext.Provider value={{setuserLogin,setModalOpen}}>
          <Navbar login={userLogin}/>
          <Routes>
            <Route path='/' element={<Home/>}></Route>
            <Route path='/signup' element={<SignUp/>}></Route>
            <Route path='/signin' element={<SignIn/>}></Route>
            <Route exact path='/profile' element={<Profile/>}></Route>
            <Route path='/createPost' element={<CreatePost/>}></Route>
            <Route path='/profile/:userid' element={<UserProfile/>}></Route>
            <Route path='/myfollowingpost' element={<MyFollowingPosts/>}></Route>
            
          </Routes>
          <ToastContainer theme='dark'/>
          {modalOpen && <Modal setModalOpen={setModalOpen}></Modal>}
        </loginContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
