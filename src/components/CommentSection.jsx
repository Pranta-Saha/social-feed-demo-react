import { useState } from 'react';
import Comment from './Comment';
import apiService from '../services/apiService';

const CommentSection = ({ postId, comments: initialComments, currentUserId, onCommentAdded }) => {
  const [comments, setComments] = useState(initialComments);
  const [showPreviousComments, setShowPreviousComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setLoading(true);
    try {
      const newComment = await apiService.createComment(postId, commentContent);
      setComments([newComment, ...comments]);
      setCommentContent('');
      if (onCommentAdded) onCommentAdded(newComment);
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentLiked = (commentId) => {
    // This is handled by the Comment component with apiService
    // Just refresh the comment if needed
  };

  const handleReplyAdded = (commentId, reply) => {
    setComments(
      comments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [...(c.replies || []), reply],
            }
          : c
      )
    );
  };

  const displayComments = showPreviousComments ? comments : comments.slice(0, 1);

  return (
    <div className="_feed_inner_timeline_cooment_area">
      <div className="_feed_inner_comment_box">
        <form className="_feed_inner_comment_box_form" onSubmit={handleAddComment}>
          <div className="_feed_inner_comment_box_content" style={{ display: 'flex', gap: '8px' }}>
            <div className="_feed_inner_comment_box_content_image">
              <img
                src="/assets/images/default-image.png"
                alt="Your profile"
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <div className="_feed_inner_comment_box_content_txt" style={{ flex: 1 }}>
              <textarea
                className="form-control _comment_textarea"
                placeholder="Write a comment"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                style={{ minHeight: '40px' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#1890FF',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                whiteSpace: 'nowrap',
              }}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      <div className="_timline_comment_main">
        {comments.length > 1 && !showPreviousComments && (
          <div className="_previous_comment">
            <button
              type="button"
              className="_previous_comment_txt"
              onClick={() => setShowPreviousComments(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#1890FF',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '12px',
                fontWeight: '500',
                marginBottom: '12px',
              }}
            >
              View previous comments ({comments.length - 1} more)
            </button>
          </div>
        )}

        {displayComments.length > 0 && (
          <div style={{ padding: '12px 0' }}>
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
          <div style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '14px' }}>
            No comments yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
