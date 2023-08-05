const express = require('express')
const  router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require('../middlewares/requireLogin');
const Post = mongoose.model("Post")


router.get("/allposts",requireLogin, (req,res) =>{
    Post.find()
    .populate("postedBy","_id name Photo")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(posts => res.json(posts))
    .catch(err => console.log(err))
})

router.post("/createPost",requireLogin,(req,res)=>{
    const {body, pic} = req.body;
    console.log(pic)
    if(!body || !pic){
        return res.status(422).json({error:"please add all the fields"});
    }
    //console.log(req.user)
    const post = new Post({
        body : body,
        photo : pic,
        postedBy : req.user
    })
    post.save().then((result)=>{
        return res.json({post:result})
    }).catch(err=>{console.log(err)})
    
})

router.get("/myposts",requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","name _id")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(myposts =>{
        res.json(myposts)
    })
})

router.put("/like", requireLogin, (req,res) =>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{new : true})
    .populate("postedBy","name _id Photo")
    .then((result,err) =>{
        if(result){
            return res.json(result)
        }
        else{
             res.status(422).json({error:err})
        }
    })
})

router.put("/unlike", requireLogin, (req,res) =>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{new : true})
    .populate("postedBy","name _id Photo")
    .then((result,err) =>{
        if(result){
            return res.json(result)
        }
        else{
             res.status(422).json({error:err})
        }
    })
})

router.put("/comment", requireLogin, (req,res) =>{
    const comment ={
        comment :req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.postedBy","_id name")
    .populate("postedBy", "_id name Photo")
    .then((result,err) =>{
        if(result){
            return res.json(result)
        }
        else{
             res.status(422).json({error:err})
        }
    })
})

router.delete("/deletePost/:postId", requireLogin, (req, res) => {
    const postId = req.params.postId;

    Post.deleteOne({ _id: postId })
        .then((result) => {
            if (result.deletedCount === 0) {
                return res.status(422).json({ error: "Post not found" });
            }
            res.json({ message: "Successfully deleted" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Server error" });
        });
});

//to show following post
router.get("/myfollowingpost", requireLogin,(req,res) =>{
    Post.find({postedBy :{$in: req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts => {
        res.json(posts)
    })
    .catch((err) =>{
        console.log(err)
    })
})



module.exports = router;