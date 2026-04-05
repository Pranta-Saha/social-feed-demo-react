import { useState } from "react";
import CommentSection from "./CommentSection";
import apiService from "../services/apiService";

const PostDetails = ({ post, currentUserId, onPostDeleted }) => {
  const [liked, setLiked] = useState(post.likedByCurrentUser || false);
  const [likes, setLikes] = useState(post.likes || []);
  const [showLikedUsers, setShowLikedUsers] = useState(false);
  const [liking, setLiking] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments?.length || 0);
  const [deleting, setDeleting] = useState(false);

  const handleLike = async () => {
    setLiking(true);
    try {
      if (liked) {
        await apiService.unlikePost(post.id);
        setLiked(false);
        setLikes(likes.filter((l) => l.userId !== currentUserId));
      } else {
        await apiService.likePost(post.id);
        setLiked(true);
        // Add a temporary like object
        const newLike = {
          userId: currentUserId,
          user: { firstName: "You", lastName: "" },
        };
        setLikes([...likes, newLike]);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      alert("Failed to like post");
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setDeleting(true);
    try {
      await apiService.deletePost(post.id);
      if (onPostDeleted) onPostDeleted(post.id);
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const handleCommentAdded = () => {
    setCommentCount(commentCount + 1);
  };

  const timeAgo = getTimeAgo(post.createdAt);

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        {/* Post Header */}
        <div className="_post_header">
          <div className="_feed_inner_timeline_post_top">
            <div className="_feed_inner_timeline_post_box">
              <div className="_feed_inner_timeline_post_box_image">
                <img
                  src="/assets/images/default-image.png"
                  alt={post.author?.firstName || "User"}
                  className="_post_img"
                />
              </div>
              <div className="_feed_inner_timeline_post_box_txt">
                <h4 className="_feed_inner_timeline_post_box_title">
                  {post.author?.firstName} {post.author?.lastName}
                </h4>
                <p className="_feed_inner_timeline_post_box_para">
                  {timeAgo} ·{" "}
                  <a href="#0" className="_post_visibility_link">
                    {post.isPrivate ? "Private" : "Public"}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Delete button - show only if current user is author */}
          {currentUserId === post.authorId && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="_post_delete_button"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        {/* Post Content */}
        <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>

        {/* Post Image */}
        {post.image && (
          <div className="_feed_inner_timeline_image">
            <img src={post.image} alt="Post" className="_time_img" />
          </div>
        )}

        {!post.image && (
          <div className="_feed_inner_timeline_image">
            <img
              src="/assets/images/default-image.png"
              alt="Default"
              className="_time_img"
            />
          </div>
        )}
      </div>

      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <div className="_post_likes_container">
              <button
                onMouseEnter={() => setShowLikedUsers(true)}
                onMouseLeave={() => setShowLikedUsers(false)}
                className="_post_likes_button"
              >
                <span>{likes.length}</span> Like
              </button>
              {showLikedUsers && likes.length > 0 && (
                <div className="_post_likes_dropdown">
                  {likes.map((like, idx) => (
                    <div key={idx} className="_post_like_item">
                      {like.user?.firstName} {like.user?.lastName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2">
            <span>{commentCount}</span> Comment
          </p>
        </div>
      </div>

      {/* Like and Comment Buttons */}
      <div className="_feed_inner_timeline_reaction">
        <button
          className={`_feed_inner_timeline_reaction_emoji _feed_reaction _post_like_button ${liked ? "liked" : ""}`}
          onClick={handleLike}
          disabled={liking}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span className="_reaction_like _icon_spacing">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-thumbs-up"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            </span>
            Like
          </span>
        </button>
        <button className="_feed_inner_timeline_reaction_comment _feed_reaction _comment_button">
          <span className="_feed_inner_timeline_reaction_link">
            <span className="_icon_spacing">
              <svg
                className="_reaction_svg"
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                fill="none"
                viewBox="0 0 21 21"
              >
                <path
                  stroke="currentColor"
                  d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.938 9.313h7.125M10.5 14.063h3.563"
                />
              </svg>
            </span>
            Comment
          </span>
        </button>
      </div>

      {/* Comment Section */}
      <CommentSection
        postId={post.id}
        comments={post.comments || []}
        currentUserId={currentUserId}
        onCommentAdded={handleCommentAdded}
        onCommentDeleted={() => setCommentCount(Math.max(0, commentCount - 1))}
      />
    </div>
  );
};

const getTimeAgo = (date) => {
  if (!date) return "unknown time";
  const dateObj = new Date(date);
  const now = new Date();
  const diffMs = now - dateObj;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return dateObj.toLocaleDateString();
};

export default PostDetails;
