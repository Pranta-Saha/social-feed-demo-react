import { useState } from "react";
import Comment from "./Comment";
import apiService from "../services/apiService";

const CommentSection = ({
  postId,
  comments: initialComments,
  currentUserId,
  onCommentAdded,
}) => {
  const [comments, setComments] = useState(initialComments);
  const [showPreviousComments, setShowPreviousComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setLoading(true);
    try {
      const newComment = await apiService.createComment(postId, commentContent);
      setComments([newComment.comment, ...comments]);
      setCommentContent("");
      if (onCommentAdded) onCommentAdded(newComment);
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentLiked = (commentId) => { };

  const handleReplyAdded = (commentId, reply) => {
    setComments(
      comments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [...(c.replies || []), reply],
            }
          : c,
      ),
    );
  };

  const displayComments = showPreviousComments
    ? comments
    : comments.slice(0, 1);

  return (
    <div className="_feed_inner_timeline_cooment_area">
      <div className="_feed_inner_comment_box">
        <form
          className="_feed_inner_comment_box_form"
          onSubmit={handleAddComment}
        >
          <div className="_feed_inner_comment_box_content _comment_input_wrapper">
            <div className="_feed_inner_comment_box_content_image">
              <img
                src="/assets/images/default-image.png"
                alt="Your profile"
                className="_comment_input_avatar"
              />
            </div>
            <div className="_feed_inner_comment_box_content_txt _comment_input_content">
              <textarea
                className="form-control _comment_textarea _comment_input_textarea"
                placeholder="Write a comment"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="_comment_submit_button"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>

      <div className="_timline_comment_main">
        {comments.length > 1 && !showPreviousComments && (
          <div>
            <button
              type="button"
              className="_previous_comment_txt _previous_comments_button"
              onClick={() => setShowPreviousComments(true)}
            >
              View previous comments ({comments.length - 1} more)
            </button>
          </div>
        )}

        {displayComments.length > 0 && (
          <div className="_comments_wrapper">
            {displayComments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                postId={postId}
                onCommentLiked={handleCommentLiked}
                onReplyAdded={handleReplyAdded}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}

        {comments.length === 0 && (
          <div className="_no_comments_message">No comments yet.</div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
