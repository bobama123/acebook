import React, { useState } from "react";
import { likePost } from "../../services/like";
import Comment from "../../components/Comment/Comment";
import CreateComment from "../../components/Comment/CreateComment";
import "./Post.css";

const LikeButton = ({ postId, userId, isLiked, updatePost }) => {
  const [liked, setLiked] = useState(isLiked);

  const handleLike = async () => {
    try {
      await likePost(postId, userId);
      setLiked(!liked);
      updatePost(postId, !liked); // Update the post after like/unlike
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <button className="like-post" onClick={handleLike}>
      {liked ? "Unlike" : "Like"}
    </button>
  );
};

const Post = ({ post, userId, updatePostFeed }) => {
  const [liked, setLiked] = useState(post.liked);

  const updatePost = (postId, liked) => {
    // Update the state of the post
    setLiked(liked);
    updatePostFeed();
  };

  const addOrdinalSuffix = (day) => {
    if (day === 1 || day === 21 || day === 31) return day + "st";
    if (day === 2 || day === 22) return day + "nd";
    if (day === 3 || day === 23) return day + "rd";
    return day + "th";
  };

  const date = new Date(post.createdAt);
  const day = addOrdinalSuffix(date.getDate());
  const month = date.toLocaleString("en-GB", { month: "short" });
  const time = date.toLocaleString("en-GB", {
    hour: "numeric",
    minute: "numeric",
  });

  const formattedDate = `${day} ${month} ${date.getFullYear()} at ${time}`;

  return (
    <article className="post" key={post._id}>
      <div className="post-border">
        <div className="post-header-container">
          <img
            className="post-profile_picture"
            src={post.user.profilePicture}
          />
          <div>
            <div className="post-user-fullName">{post.user.fullName}</div>
            <div className="post-date">{formattedDate}</div>
          </div>
        </div>
        {post.image && (
          <img className="post_image" src={post.image} alt="Post" />
        )}
        <div className="post-message">{post.message}</div>
        <div className="post-like-button">
          <LikeButton
            postId={post._id}
            userId={userId}
            isLiked={liked}
            updatePost={updatePost}
          />
        </div>
        <div className="post-like-counter">{post.likedBy.length}</div>
      </div>
      <div className="create-comment">
        <CreateComment postId={post._id} />
      </div>
      <div>
        <Comment postId={post._id} />
      </div>
    </article>
  );
};

export default Post;
