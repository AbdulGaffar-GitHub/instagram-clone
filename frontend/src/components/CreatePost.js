import React,{useState, useEffect} from 'react'
import "../css/CreatePost.css"
import {toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {

    const notifyA = (data) =>{
        toast.error(data)
      }
      const notifyB = (data) =>{
        toast.success(data)
      }

    const[body,setbody] = useState("");
    const[image,setimage] = useState("")
    const[url,seturl] = useState("")
    const navigate = useNavigate()

    useEffect(()=>{
        if(url){
            //saving post to mongo
            fetch("/createPost",{
                method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization" : "Bearer "+localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                body,
                pic:url
            })
            }).then(res => res.json())
            .then((data)=>{if(data.error){
                notifyA(data.error);
            }
            else {
                notifyB("successfully posted")
                navigate("/")
            }
            })
            .catch((err) => console.log(err))
        }
    }, [url])

    // posting image to cloudinary
    const postdetails = () =>{
        console.log(body, image)
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","instaclone")
        data.append("cloud_name","abdulgaffar")
        fetch("https://api.cloudinary.com/v1_1/abdulgaffar/image/upload",{
            method:"post",
            body:data
        })
        .then((res)=>{return res.json();})
        .then ((data)=>seturl(data.url))
        .catch(err => console.log(err))  
    }

    const loadfile = (event) =>{
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function(){
            URL.revokeObjectURL(output.src) // free memory
        }
    }
  return (
    <div className='create-post'>
        <div className="post-header">
        <h4 style={{margin:"3px auto 2px"}}>Create new Post</h4>
        <button id='post-btn' onClick={()=>{postdetails()}}>Share</button>
        </div>  
        {/* image-preview */}
        <div className="main-div">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkd_U1uTQ_vUOlaHVGdpPLYZCq_uQgyWrsuA&usqp=CAU" id="output" />
            <input type="file" accept='image/*' onChange = {(event) => {
                loadfile(event);
                setimage(event.target.files[0])
            }}/>
        </div>
        {/* details */}
        <div className="details">
            <div className="card-header">
                <div className="card-pic">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuq72EgurtMPi3cVomw9S4-icKIPZbpkQYEjhfSQ8whlp7nmraqAF52KpjMx9DK0FoYpk&usqp=CAU" alt="no image" />
                </div>
                <h5>Tony stark</h5>
            </div>
            <textarea value={body} onChange={(e)=>{
                setbody(e.target.value);
            }} placeholder='Write a body?'></textarea>
        </div>
    </div>
  )
}
