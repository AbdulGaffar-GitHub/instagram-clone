import React,{useEffect, useState} from 'react'
import "../css/Home.css"
import { useNavigate } from 'react-router-dom'
import {toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function MyFollowingPosts() {

  const navigate = useNavigate()
  const [data,setdata] = useState([])
  const[comment, setComment] = useState("")
  const[show,setShow] = useState(false)
  const[items,setItems] =useState("")

  const notifyA = (data) =>{
    toast.error(data)
  }
  const notifyB = (data) =>{
    toast.success(data)
  }

  //display all posts
  useEffect(() =>{
    const token = localStorage.getItem("jwt")
    if(!token){
      navigate("/signup")
    }

    //fetching all post
    fetch("/myfollowingpost",{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
      ,
    }).then(res => res.json())
    .then(result => {
      console.log(result)
      setdata(result)
    })
    .catch((err) => console.log(err))

  },[])

  //show and hide comments
  const toggleComments = (posts) =>{
    if(show){
      setShow(false);
    }
    else{
      setItems(posts);
      console.log(items);
      setShow(true);
    }
  }

  const likePost = (id) =>{
    fetch("/like", {
      method:"put",
      headers:{
        'Content-Type':"application/json",
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      },
      body : JSON.stringify({
        postId:id
      })
    }).then(res => res.json())
    .then((result) => {
      const newData = data.map((posts) =>{
        if(posts._id == result._id){
          return result
        }
        else{
          return posts
        }
      })
      setdata(newData)
      // console.log(result)
    })
  }

  const unlikePost = (id) =>{
    fetch("/unlike", {
      method:"put",
      headers:{
        'Content-Type':"application/json",
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      },
      body : JSON.stringify({
        postId:id
      })
    }).then(res => res.json())
    .then((result) => {
      const newData = data.map((posts) =>{
        if(posts._id == result._id){
          return result
        }
        else{
          return posts
        }
      })
      setdata(newData)
      // console.log(result)
    })
  }

  // function make comment 
  const makeComment = (text,id) =>{
    fetch("/comment", {
      method:"put",
      headers:{
        'Content-Type':"application/json",
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
      },
      body : JSON.stringify({
        text : text,
        postId:id
      })
    }).then(res => res.json())
    .then((result) => {
      const newData = data.map((posts) =>{
          if(posts._id == result._id){
            return result
          }
          else{
            return posts
          }
        })
        setdata(newData)
        // console.log(result)
      setComment("")
      notifyB("Comment Posted")
      console.log(result)
    })
    // console.log(comment)
  }

  return (
    <div className='home'>
     
      {data.map((posts) =>{
        return(
          // card
          <div className='card'>
            {/*  card header */}
            <div className="card-header">
              <div className="card-pic">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuq72EgurtMPi3cVomw9S4-icKIPZbpkQYEjhfSQ8whlp7nmraqAF52KpjMx9DK0FoYpk&usqp=CAU" alt="" />
              </div>
              <Link to={`/profile/${posts.postedBy._id}`}>
                <h5 className='username'>{posts.postedBy.name}</h5>  
              </Link>
            </div>
            {/*card img */}
            <div className="card-image">
              <img src={posts.photo} alt="" />
            </div>
            {/* card content */}
            <div className="card-content">
              {
                posts.likes.includes(JSON.parse(localStorage.getItem("user"))._id)? (
                  <span className="material-symbols-outlined material-symbols-outlined-red" onClick={() =>{unlikePost(posts._id)}}>favorite</span>
                ): <span className="material-symbols-outlined" onClick={() =>{likePost(posts._id)}}>favorite</span>
              }
              <p>{posts.likes.length} Likes</p>
              <p>{posts.body}</p>
              <p style={{fontWeight:"bolder", cursor:"pointer"}} onClick={() =>{
                toggleComments(posts)
              }}>view all comments</p>

            </div>
            {/* comment */}
            <div className="add-comment">
              <span className="material-symbols-outlined">mood</span>
                <input type="text" placeholder='Add a comment' value={comment} onChange={(e) =>{
                  setComment(e.target.value)
                }}/>
                <button className="comment" onClick={() =>{makeComment(comment,posts._id)}}>Post</button>
            </div>
          </div>
        )
      })} 

      {/* show comments   */}
      {
        show && (
        <div className="showComment">
          <div className="container">
            <div className="postpic">
              <img src={items.photo} alt="" />
            </div>
            <div className="details">
              {/*  card header */}
              <div className="card-header" style={{borderBottom:"1px solid #00000029"}}>
                <div className="card-pic">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuq72EgurtMPi3cVomw9S4-icKIPZbpkQYEjhfSQ8whlp7nmraqAF52KpjMx9DK0FoYpk&usqp=CAU" alt="" />
                </div>
                <h5>{items.postedBy.name}</h5>
              </div>

              {/* comments section */}
              <div className="comment-section" style={{borderBottom:"1px solid #00000029"}}>
                {
                  items.comments.map((comments) =>{
                    return(
                      <p className="comm">
                        <span className="commenter" style={{fontWeight : "bolder"}}>{comments.postedBy.name}{" "} </span>
                        <span className="commenter">{comments.comment}</span>
                      </p>
                    )
                  })
                }
              </div>

              {/* card content */}
              <div className="card-content">
                <p>{items.likes.length} Likes</p>
                <p>{items.body}</p>
              </div>
              
                {/* comment */}
                <div className="add-comment">
                  <span className="material-symbols-outlined">mood</span>
                  <input type="text" placeholder='Add a comment' value={comment} onChange={(e) =>{
                    setComment(e.target.value)
                  }}/>
                  <button className="comment"
                    onClick={() =>{makeComment(comment,items._id)
                    toggleComments()
                  }}
                    >Post</button>
                </div>

            </div>
          </div>
          <div className="close-comment" onClick={()=>{
            toggleComments()
          }}>
            <span className="material-symbols-outlined material-symbols-outlined-comment">close</span>
          </div>
        </div>)
      }
    </div>
  )
}
