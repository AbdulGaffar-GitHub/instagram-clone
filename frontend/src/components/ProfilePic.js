import React,{useState, useRef, useEffect} from 'react'
import '../css/Modal.css'


export default function ProfilePic({changeprofile}) {

    const hiddenFileInput = useRef(null)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    
    const postPic = () =>{
        //saving post to mongo
        fetch("/uploadprofilepic",{
            method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization" : "Bearer "+localStorage.getItem("jwt")
        },
        body : JSON.stringify({
            pic:url
        })
        }).then(res => res.json())
        .then((data)=>{
        if(data.error){
            console.log(data.error)
        }
        else {
            changeprofile()
            window.location.reload()
        }
        console.log(data)
        })
        .catch((err) => console.log(err))
    }

    const handleClick = () =>{
        hiddenFileInput.current.click()
    }

    const postdetails = () =>{
       // console.log(body, image)
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","instaclone")
        data.append("cloud_name","abdulgaffar")
        fetch("https://api.cloudinary.com/v1_1/abdulgaffar/image/upload",{
            method:"post",
            body:data
        })
        .then((res)=>{return res.json();})
        .then ((data)=>setUrl(data.url))
        .catch(err => console.log(err))  
    }

    useEffect(() =>{
        if(image){
            postdetails()
        }
    },[image])

    useEffect(() =>{
        if(url){
            postPic()
        }
    },[url])

  return (
    <div className='ProfilePic darkBg'>
      <div className="changePic centered">
        <div>
            <h3>Change Profile Photo</h3>
        </div>
        <div style={{borderTop: "1px solid #9e8989"}}>
            <button className="upload-btn" style={{color:"#0095f6"}} onClick={handleClick}>Upload Photo</button>
            <input type="file" accept='image/*' style={{display:"none"}} ref={hiddenFileInput} onChange={(e)=>{setImage(e.target.files[0])}}/>
        </div>
        <div style={{borderTop: "1px solid #9e8989"}}>
            <button className="upload-btn" style={{color:"#ed4956"}}
            onClick={()=>{
                setUrl(null)
                postPic();
            }}
            >Remove Current photo</button>
        </div>
        <div style={{borderTop: "1px solid #9e8989"}}>
            <button style={{background:"none", border:"none" ,cursor:"pointer", fontSize:"15px"}} onClick={changeprofile}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
