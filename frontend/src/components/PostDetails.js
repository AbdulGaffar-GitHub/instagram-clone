import React from 'react'
import '../css/PostDetails.css'
import { useNavigate } from 'react-router-dom';
import {toast } from 'react-toastify';

export default function PostDetails({items,toggleDetails}) {

    console.log(items)

    const notifyB = (data) =>{
        toast.success(data)
      }

    const navigate = useNavigate()

    const removePost = (postId) =>{
        //console.log(postId)
        if(window.confirm("Do you really want to delete this post?"))
        {
                fetch(`/deletePost/${postId}`,{
                method:'delete',
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
            }).then((res) => res.json())
              .then(result => {console.log(result)
              navigate("/")
              toggleDetails();
              notifyB(result.message)
            });
        }
    }

  return (
    <div className="showComment">
        <div className="container">
        <div className="postpic">
            <img src={items.photo} alt="" />
        </div>
        <div className="details">
            {/*  card header */}
            <div className="card-header" style={{borderBottom:"1px solid #00000029"}}>
            <div className="card-pic" style={{paddingTop:"7px"}}>
                <img src={items.postedBy.Photo}alt="" />
            </div>
            <h5>{items.postedBy.name}</h5>
            <div className="deletePost" onClick={() =>{removePost(items._id)}}>
                <span className="material-symbols-outlined">delete</span> 
            </div>
            </div>

            {/* comments section */}
            <div className="comment-section" style={{borderBottom:"1px solid #00000029",maxHeight:"380px"}}>
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
            {/* <div className="add-comment">
                <span className="material-symbols-outlined">mood</span>
                <input type="text" placeholder='Add a comment' 
                //value={comment} 
                // onChange={(e) =>{
                // setComment(e.target.value)
                // }}
                />
                <button className="comment"
                // onClick={() =>{makeComment(comment,items._id)
                // toggleComments("")
                // }}
                >Post</button>
            </div> */}

        </div>
        </div>
        <div className="close-comment" 
        onClick={()=>{
        toggleDetails("")
        }}
        >
        <span className="material-symbols-outlined material-symbols-outlined-comment">close</span>
        </div>
    </div>
  )
}
