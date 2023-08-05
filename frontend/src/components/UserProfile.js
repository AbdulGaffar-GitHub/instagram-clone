import React, {useEffect, useState} from 'react'
import '../css/Profile.css'
import PostDetails from './PostDetails'
import {  useParams } from 'react-router-dom'

export default function UserProfile() {

  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"

    const {userid} = useParams()
    //console.log(userid) 

  const [user, setUser] = useState("")
  const [posts,setPosts] = useState([])
  const [isFollow, setIsFollow] = useState(false)

  //follow user
  const followUser = (userId) => {
    fetch("/follow", {
        method: "put",
        headers: {
            "Content-Type": "application/json", // Fix the content type header value
            Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
            followId: userId,
        }),
    })
    .then((res) => res.json()) // Return the response object
    .then((data) => {
        console.log(data.updatedFollowingId);
        setIsFollow(true)
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}


 //unfollow user
 const unfollowUser = (userId) =>{
    fetch("/unfollow",{
      method:"put",
      headers :{
        "Content-Type" : "application/json",
        Authorization : "Bearer " + localStorage.getItem("jwt")
      },body:JSON.stringify({
        followId:userId
      })
    }).then((res)=>res.json())
    .then((data)=>{
      console.log(data.updatedUnfollowingId)
      setIsFollow(false)
    }).catch((error) => {
      console.error("Error:", error);
  });
}

  useEffect(() =>{
    fetch(`/user/${userid}`,{
      headers :{
        Authorization : "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then((result) => {
        //console.log(result)
        setUser(result.user)
        setPosts(result.posts)
        const user = JSON.parse(localStorage.getItem("user"));

          if (user && result.user.followers.includes(user._id)) {
            setIsFollow(true);
          }

        // console.log(pic)
      })
  },[isFollow])

  return (
    <div className='profile'>
      {/* profile frame */}
      <div className="profile-frame">
        <div className="profile-pic">
           <img src={user.Photo ? user.Photo : picLink} alt="" />
        </div>
        <div className="profile-data">
          <div style={{display:"flex",alignItems:"center", justifyContent:"space-between"}}>
            <h1>{user.name}</h1>
            <button className='followBtn' 
            onClick={() =>{
              if(isFollow){
                unfollowUser(user._id)
              }else
              {
                followUser(user._id)
              }
            }}
            >{isFollow ? "Unfollow" : "follow"}</button>
          </div>
            <div className="profile-info" style={{display:"flex"}}>
              <p>{posts.length} Posts</p>
              <p>{user.followers? user.followers.length : "0"} followers</p>
              <p>{user.following? user.following.length : "0"} following</p>
            </div>
        </div>
      </div>
      <hr style={{width:"90%",margin:"25px auto",opacity:"0.8"}}/>
      {/* gallery */}
      <div className="gallery">
        {posts.map((pics) =>{
          return <img key={pics._id} src={pics.photo} className='item'
        //    onClick={() =>{
        //     toggleDetails(pics)
        //   }}
          ></img>
        })}
      </div>
      {/* {
        show && 
        <PostDetails items={posts} toggleDetails={toggleDetails}/>
      } */}
    </div>
  )
}
