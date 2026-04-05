import { useState } from "react";
import Reply from "./Reply";
import apiService from "../services/apiService";

const Comment = ({
  comment,
  postId,
  onCommentLiked,
  onReplyAdded,
  currentUserId,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [liking, setLiking] = useState(false);
  const [replying, setReplying] = useState(false);
  const [showLikedUsers, setShowLikedUsers] = useState(false);
  const [liked, setLiked] = useState(comment.likedByCurrentUser || false);
  const [likes, setLikes] = useState(comment.likes || []);
  const [replies, setReplies] = useState(comment.replies || []);

  const handleLikeComment = async () => {
    setLiking(true);
    try {
      if (liked) {
        await apiService.unlikeComment(comment.id);
        setLiked(false);
        setLikes(likes.filter((l) => l.userId !== currentUserId));
      } else {
        await apiService.likeComment(comment.id);
        setLiked(true);
        const newLike = {
          userId: currentUserId,
          user: { firstName: "You", lastName: "" },
        };
        setLikes([...likes, newLike]);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      alert("Failed to like comment");
    } finally {
      setLiking(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setReplying(true);
    try {
      const reply = await apiService.createReply(comment.id, replyContent);
      setReplyContent("");
      setShowReplyInput(false);
      setShowReplies(true);
      setReplies([...replies, reply]);
      onReplyAdded(comment.id, reply);
    } catch (error) {
      console.error("Failed to add reply:", error);
      alert("Failed to add reply");
    } finally {
      setReplying(false);
    }
  };

  const isLiked = liked;
  const timeAgo = getTimeAgo(comment.createdAt);

  return (
    <div>
      <div className="_comment_content_wrapper">
        <img
          src="/assets/images/default-image.png"
          alt={comment.author?.firstName || "User"}
          className="_comment_avatar"
        />
        <div className="_comment_flex_container">
          <div className="_comment_area">
            <div className="_comment_details _comment_details_wrapper">
              <div className="_comment_details_top">
                <div className="_comment_name">
                  <a href="#0">
                    <h4 className="_comment_name_title _comment_title_spacing">
                      {comment.author?.firstName} {comment.author?.lastName}
                    </h4>
                  </a>
                </div>
              </div>
              <div className="_comment_status">
                <p className="_comment_status_text">
                  <span>{comment.content}</span>
                </p>
              </div>
              <div className="_comment_reactions _total_reactions">
                <div className="_comment_likes_container">
                  <button
                    onMouseEnter={() => setShowLikedUsers(true)}
                    onMouseLeave={() => setShowLikedUsers(false)}
                    className="_comment_likes_button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    {likes.length}
                  </button>
                  {showLikedUsers && likes.length > 0 && (
                    <div className="_comment_likes_dropdown">
                      {likes.map((like, idx) => (
                        <div key={idx} className="_comment_like_item">
                          {like.user?.firstName} {like.user?.lastName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="_comment_reply">
                <div className="_comment_reply_num">
                  <ul className="_comment_reply_list _comment_action_list">
                    <li>
                      <button
                        onClick={handleLikeComment}
                        disabled={liking}
                        className={`_comment_like_btn ${isLiked ? "liked" : ""}`}
                      >
                        Like.
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setShowReplyInput(!showReplyInput)}
                        className="_comment_reply_btn"
                      >
                        Reply.
                      </button>
                    </li>
                    <li>
                      <span className="_time_link _comment_time">
                        {timeAgo}
                      </span>
                    </li>
                    {replies.length > 0 && (
                      <li>
                        <button
                          onClick={() => setShowReplies(!showReplies)}
                          className="_comment_replies_button"
                        >
                          {showReplies ? "Hide" : "Show"} ({replies.length})
                          Replies
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {showReplyInput && (
            <form onSubmit={handleReplySubmit} className="_reply_form_wrapper">
              <div className="_feed_inner_comment_box">
                <div className="_feed_inner_comment_box_content _comment_input_wrapper">
                  <div className="_feed_inner_comment_box_content_image">
                    <img
                      src="/assets/images/default-image.png"
                      alt="You"
                      className="_comment_avatar"
                    />
                  </div>
                  <div className="_feed_inner_comment_box_content_txt _comment_input_content">
                    <textarea
                      className="form-control _comment_textarea _reply_textarea"
                      placeholder="Write a reply"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={replying}
                    className="_reply_submit_button"
                  >
                    {replying ? "Replying..." : "Reply"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {showReplies && replies.length > 0 && (
            <div className="_replies_wrapper">
              {replies.map((reply) => (
                <Reply
                  key={reply.id}
                  reply={reply}
                  postId={postId}
                  commentId={comment.id}
                  onReplyLiked={() => {}}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
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

export default Comment;
