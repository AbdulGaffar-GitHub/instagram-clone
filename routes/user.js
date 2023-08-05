const express = require('express')
const  router = express.Router();
const mongoose = require("mongoose");
const User =mongoose.model("user")
const Post = mongoose.model("Post")
const requireLogin = require('../middlewares/requireLogin');

//to get user profile
router.get("/user/:id", (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name Photo")
                .populate("comments.postedBy","_id name" )
                .sort("-createdAt")
                .then((posts, err) => {
                    if (err) {
                        return res.status(422).json({ error: err });
                    }
                    
                    res.status(200).json({ user, posts }); // Send the response once

                }).catch(err => {
                    return res.status(404).json({ error: "User not found" });
                });
        })
        .catch(err => {
            return res.status(404).json({ error: "User not found" });
        });
});
// follow and following
router.put("/follow", requireLogin, async (req, res) => {
    try {
        const updatedFollowId = await User.findByIdAndUpdate(
            req.body.followId,
            { $push: { followers: req.user._id } },
            { new: true }
        );

        const updatedFollowingId = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followId } },
            { new: true }
        );

        res.json({updatedFollowId, updatedFollowingId });
    } catch (err) {
        res.status(422).json({ error: err });
    }
});

// unfollow and unfollowing
router.put("/unfollow", requireLogin, async (req, res) => {
    try {
        const updatedUnfollowId = await User.findByIdAndUpdate(
            req.body.followId,
            { $pull: { followers: req.user._id } },
            { new: true }
        );

        const updatedUnfollowingId = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.followId } },
            { new: true }
        );

        res.json({updatedUnfollowId, updatedUnfollowingId });
    } catch (err) {
        res.status(422).json({ error: err });
    }
});

// to upload profile photo
router.put("/uploadprofilepic", requireLogin, (req,res) =>{
    User.findByIdAndUpdate(req.user._id, {
        $set:{Photo:req.body.pic}
    },{
        new:true
    }).then((result,err) =>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})


module.exports = router