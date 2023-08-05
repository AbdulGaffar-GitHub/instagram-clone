import React, {useEffect, useState} from 'react'
import '../css/Profile.css'
import PostDetails from './PostDetails'
import ProfilePic from './ProfilePic'

export default function Profile() {

  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
 
  const [pic, setPic] = useState([])
  const [show,setShow] = useState(false)
  const [posts,setPosts] = useState([])
  const [changePic,setchangePic] = useState(false)
  const [user,setUser] = useState("")
  

   const toggleDetails = (posts) =>{
    if(show){
      setShow(false);
    }
    else{
      setShow(true);
      setPosts(posts);
      //console.log(items);
    }
  }

  const changeprofile = () =>{
    if(changePic){
      setchangePic(false)
    }
    else{
      setchangePic(true)
      }
  }

  useEffect(() =>{
    fetch(`/user/${JSON.parse(localStorage.getItem("user"))._id}`,{
      headers :{
        Authorization : "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then((result) => {
        console.log(result)
        setPic(result.posts)
        setUser(result.user)
        // console.log(pic)
      })
  },[])

  return (
    <div className='profile'>
      {/* profile frame */}
      <div className="profile-frame">
        <div className="profile-pic">
           <img src={user.Photo ? user.Photo : picLink}
           alt="" 
           onClick={() =>{
            changeprofile();
           }}/>
        </div>
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
            <div className="profile-info" style={{display:"flex"}}>
              <p>{pic ? pic.length : "0"} Posts</p>
              <p>{user.followers ? user.followers.length : "0"} followers</p>
              <p>{user.following ? user.following.length : "0"} following</p>
            </div>
        </div>
      </div>
      <hr style={{width:"90%",margin:"25px auto",opacity:"0.8"}}/>
      {/* gallery */}
      <div className="gallery">
        {pic.map((pics) =>{
          return <img key={pics._id} src={pics.photo} className='item' onClick={() =>{
            toggleDetails(pics)
          }}></img>
        })}
      </div>
      {
        show && 
        <PostDetails items={posts} toggleDetails={toggleDetails}/>
      }
      {
        changePic && <ProfilePic changeprofile = {changeprofile}/>
      }
    </div>
  )
}
