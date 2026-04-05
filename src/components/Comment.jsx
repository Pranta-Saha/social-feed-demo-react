import { useState } from 'react';
import Reply from './Reply';
import apiService from '../services/apiService';

const Comment = ({ comment, postId, onCommentLiked, onReplyAdded, currentUserId }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [liking, setLiking] = useState(false);
  const [replying, setReplying] = useState(false);
  const [showLikedUsers, setShowLikedUsers] = useState(false);
  const [liked, setLiked] = useState(comment.likedByCurrentUser || false);
  const [likeCount, setLikeCount] = useState(comment.likesCount || 0);
  const [likedUsers, setLikedUsers] = useState([]);
  const [replies, setReplies] = useState(comment.replies || []);

  const handleLikeComment = async () => {
    setLiking(true);
    try {
      if (liked) {
        await apiService.unlikeComment(comment.id);
        setLiked(false);
        setLikeCount(Math.max(0, likeCount - 1));
      } else {
        await apiService.likeComment(comment.id);
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
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
      setReplyContent('');
      setShowReplyInput(false);
      setShowReplies(true);
      setReplies([...replies, reply]);
      onReplyAdded(comment.id, reply);
    } catch (error) {
      console.error('Failed to add reply:', error);
      alert('Failed to add reply');
    } finally {
      setReplying(false);
    }
  };

  const isLiked = liked;
  const timeAgo = getTimeAgo(comment.createdAt);

  return (
    <div className="_comment_main" style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #F0F2F5' }}>
      <div className="_comment_image">
        <div style={{ display: 'flex', gap: '8px' }}>
          <img
            src="/assets/images/default-image.png"
            alt={comment.author?.firstName || 'User'}
            className="_comment_img1"
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ flex: 1 }}>
            <div className="_comment_area">
              <div className="_comment_details">
                <div className="_comment_details_top">
                  <div className="_comment_name">
                    <a href="#0">
                      <h4 className="_comment_name_title" style={{ marginBottom: '4px' }}>
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
                <div className="_total_reactions" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                      onMouseEnter={() => {
                        if (likeCount > 0 && likedUsers.length === 0) {
                          // Load liked users when hovering
                          setShowLikedUsers(true);
                        } else {
                          setShowLikedUsers(true);
                        }
                      }}
                      onMouseLeave={() => setShowLikedUsers(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#1890FF',
                        fontWeight: '600',
                        fontSize: '14px',
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                      {likeCount}
                    </button>
                    {showLikedUsers && likedUsers.length > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '24px',
                          left: '0',
                          background: 'white',
                          border: '1px solid #DDD',
                          borderRadius: '4px',
                          padding: '8px',
                          minWidth: '150px',
                          zIndex: 10,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      >
                        {likedUsers.map((user, idx) => (
                          <div key={idx} style={{ fontSize: '12px', padding: '4px 0' }}>
                            {typeof user === 'string' ? user : user.name || user.id}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="_comment_reply">
                  <div className="_comment_reply_num">
                    <ul className="_comment_reply_list" style={{ display: 'flex', gap: '12px' }}>
                      <li>
                        <button
                          onClick={handleLikeComment}
                          disabled={liking}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: isLiked ? '#1890FF' : '#666',
                            fontWeight: isLiked ? '600' : '400',
                            fontSize: '13px',
                          }}
                        >
                          Like.
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => setShowReplyInput(!showReplyInput)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#666',
                            fontSize: '13px',
                          }}
                        >
                          Reply.
                        </button>
                      </li>
                      <li>
                        <span className="_time_link" style={{ fontSize: '13px', color: '#999' }}>
                          {timeAgo}
                        </span>
                      </li>
                      {replies.length > 0 && (
                        <li>
                          <button
                            onClick={() => setShowReplies(!showReplies)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#1890FF',
                              fontSize: '13px',
                              fontWeight: '500',
                            }}
                          >
                            {showReplies ? 'Hide' : 'Show'} ({replies.length}) Replies
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {showReplyInput && (
              <form onSubmit={handleReplySubmit} style={{ marginTop: '12px' }}>
                <div className="_feed_inner_comment_box">
                  <div className="_feed_inner_comment_box_content" style={{ display: 'flex', gap: '8px' }}>
                    <div className="_feed_inner_comment_box_content_image">
                      <img
                        src="/assets/images/default-image.png"
                        alt="You"
                        className="_comment_img"
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="_feed_inner_comment_box_content_txt" style={{ flex: 1 }}>
                      <textarea
                        className="form-control _comment_textarea"
                        placeholder="Write a reply"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        style={{ minHeight: '40px', padding: '8px' }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={replying}
                      style={{
                        background: '#1890FF',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      {replying ? 'Replying...' : 'Reply'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {showReplies && replies.length > 0 && (
              <div style={{ marginTop: '12px' }}>
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
    </div>
  );
};

const getTimeAgo = (date) => {
  if (!date) return 'unknown time';
  const dateObj = new Date(date);
  const now = new Date();
  const diffMs = now - dateObj;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return dateObj.toLocaleDateString();
};

export default Comment;
