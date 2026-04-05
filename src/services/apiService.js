const API_BASE_URL = "http://localhost:3000/api";

const getAuthToken = () => localStorage.getItem("token");

const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  return response.json();
};

export const apiService = {
  register: async (firstName, lastName, email, password) => {
    const data = await apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    return {
      token: data.token,
      user: data.user,
    };
  },

  login: async (email, password) => {
    const data = await apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return {
      token: data.token,
      user: data.user,
    };
  },

  getPosts: async (page = 1, limit = 10) => {
    const data = await apiCall(`/posts?page=${page}&limit=${limit}`);
    return data.posts || data;
  },

  getSinglePost: async (postId) => {
    return apiCall(`/posts/${postId}`);
  },

  createPost: async (content, image, isPrivate = false) => {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("isPrivate", isPrivate);
    if (image) {
      formData.append("image", image);
    }

    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create post");
    }

    return response.json();
  },

  deletePost: async (postId) => {
    return apiCall(`/posts/${postId}`, { method: "DELETE" });
  },

  likePost: async (postId) => {
    return apiCall(`/posts/${postId}/like`, { method: "POST" });
  },

  unlikePost: async (postId) => {
    return apiCall(`/posts/${postId}/unlike`, { method: "POST" });
  },

  getPostLikes: async (postId) => {
    return apiCall(`/posts/${postId}/likes`);
  },

  getComments: async (postId) => {
    return apiCall(`/posts/${postId}/comments`);
  },

  createComment: async (postId, content) => {
    return apiCall(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  },

  deleteComment: async (commentId) => {
    return apiCall(`/posts/comments/${commentId}`, { method: "DELETE" });
  },

  likeComment: async (commentId) => {
    return apiCall(`/posts/comments/${commentId}/like`, { method: "POST" });
  },

  unlikeComment: async (commentId) => {
    return apiCall(`/posts/comments/${commentId}/unlike`, { method: "POST" });
  },

  getCommentLikes: async (commentId) => {
    return apiCall(`/posts/comments/${commentId}/likes`);
  },

  getReplies: async (commentId) => {
    return apiCall(`/posts/comments/${commentId}/replies`);
  },

  createReply: async (commentId, content) => {
    return apiCall(`/posts/comments/${commentId}/replies`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  },

  deleteReply: async (replyId) => {
    return apiCall(`/posts/replies/${replyId}`, { method: "DELETE" });
  },

  likeReply: async (replyId) => {
    return apiCall(`/posts/replies/${replyId}/like`, { method: "POST" });
  },

  unlikeReply: async (replyId) => {
    return apiCall(`/posts/replies/${replyId}/unlike`, { method: "POST" });
  },

  getReplyLikes: async (replyId) => {
    return apiCall(`/posts/replies/${replyId}/likes`);
  },
};

export default apiService;
