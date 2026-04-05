import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FeedHeader from '../components/FeedHeader';
import CreatePost from '../components/CreatePost';
import PostDetails from '../components/PostDetails';
import apiService from '../services/apiService';

const Feed = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadPosts();
    }
  }, [isAuthenticated, user]);

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const feedPosts = await apiService.getPosts();
      setPosts(Array.isArray(feedPosts) ? feedPosts : []);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    loadPosts();
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="_layout _layout_main_wrapper">
      <div className="_main_layout">
        <FeedHeader />

        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              {/* Left Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12" />

              {/* Layout Middle - Main Feed */}
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    {error && (
                      <div
                        style={{
                          background: '#ffe8e8',
                          color: '#c41c1c',
                          padding: '12px 16px',
                          borderRadius: '6px',
                          marginBottom: '16px',
                          fontSize: '14px',
                        }}
                      >
                        {error}
                      </div>
                    )}

                    {/* Create Post Section */}
                    <CreatePost onPostCreated={handlePostCreated} />

                    {/* Posts Timeline */}
                    {posts.length > 0 ? (
                      <div>
                        {posts.map((post) => (
                          <PostDetails
                            key={post.id}
                            post={post}
                            currentUserId={user.id}
                            onPostUpdated={handlePostUpdated}
                            onPostDeleted={handlePostDeleted}
                          />
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '40px',
                          color: '#999',
                          fontSize: '18px',
                          marginTop: '20px',
                        }}
                      >
                        <p>No posts yet. Be the first to create one!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
