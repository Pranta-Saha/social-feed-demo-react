import { useState } from 'react';
import apiService from '../services/apiService';

const Reply = ({ reply, postId, commentId, onReplyLiked, currentUserId }) => {
  console.log('Rendering Reply:', reply);
  const [showLikedUsers, setShowLikedUsers] = useState(false);
  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState(reply.likedByCurrentUser || false);
  const [likes, setLikes] = useState(reply.likes || []);

  const handleLike = async () => {
    setLiking(true);
    try {
      if (liked) {
        await apiService.unlikeReply(reply.id);
        setLiked(false);
        setLikes(likes.filter(l => l.userId !== currentUserId));
      } else {
        await apiService.likeReply(reply.id);
        setLiked(true);
        const newLike = { userId: currentUserId, user: { firstName: 'You', lastName: '' } };
        setLikes([...likes, newLike]);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      alert('Failed to like reply');
    } finally {
      setLiking(false);
    }
  };

  const isLiked = liked;
  const timeAgo = getTimeAgo(reply.createdAt);

  return (
    <div className="_reply_container">
      <div className="_reply_content_wrapper">
        <div>
          <img
            src="/assets/images/default-image.png"
            alt={reply.author?.firstName || 'User'}
            className="_reply_avatar"
          />
        </div>
        <div className="_reply_flex_1">
          <div>
            <div>
              <h4 className="_comment_name_title _reply_author_name">
                  {reply.author?.firstName} {reply.author?.lastName}
                </h4>
            </div>
            <div className="_reply_content_text">{reply.content}</div>
            <div className="_reply_actions">
              <button
                onClick={handleLike}
                disabled={liking}
                className={`_reply_like_button ${isLiked ? 'liked' : ''}`}
              >
                Like
              </button>
              <span className="_reply_time_text">{timeAgo}</span>
              <div className="_reply_likes_dropdown_container">
                <button
                  onMouseEnter={() => setShowLikedUsers(true)}
                  onMouseLeave={() => setShowLikedUsers(false)}
                  className="_reply_likes_button"
                >
                  {likes.length} Likes
                </button>
                {showLikedUsers && likes.length > 0 && (
                  <div className="_reply_likes_dropdown">
                    {likes.map((like, idx) => (
                      <div key={idx} className="_reply_like_item">
                        {like.user?.firstName} {like.user?.lastName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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

export default Reply;
