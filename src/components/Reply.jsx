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
    <div style={{ marginLeft: '32px', marginBottom: '12px', paddingLeft: '12px', borderLeft: '2px solid #E8E8E8' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div>
          <img
            src="/assets/images/default-image.png"
            alt={reply.author?.firstName || 'User'}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div>
            <div>
              <h4 className="_comment_name_title" style={{ marginBottom: '4px' }}>
                  {reply.author?.firstName} {reply.author?.lastName}
                </h4>
            </div>
            <div style={{ fontSize: '14px', color: '#333' }}>{reply.content}</div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', marginTop: '8px', alignItems: 'center' }}>
              <button
                onClick={handleLike}
                disabled={liking}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isLiked ? '#1890FF' : '#999',
                  fontWeight: isLiked ? '600' : '400',
                }}
              >
                Like
              </button>
              <span style={{ color: '#999' }}>{timeAgo}</span>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  onMouseEnter={() => setShowLikedUsers(true)}
                  onMouseLeave={() => setShowLikedUsers(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#1890FF',
                    fontWeight: '600',
                    padding: '0',
                  }}
                >
                  {likes.length} Likes
                </button>
                {showLikedUsers && likes.length > 0 && (
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
                    {likes.map((like, idx) => (
                      <div key={idx} style={{ fontSize: '12px', padding: '4px 0' }}>
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
