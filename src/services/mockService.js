// Mock data service for development and testing
// This simulates API responses and can be replaced with real API calls

let mockUsers = {
  'user1@example.com': {
    id: '1',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'user1@example.com',
    password: 'password123',
    profileImage: null,
  },
  'user2@example.com': {
    id: '2',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'user2@example.com',
    password: 'password123',
    profileImage: null,
  },
  'user3@example.com': {
    id: '3',
    firstName: 'Karim',
    lastName: 'Saif',
    email: 'user3@example.com',
    password: 'password123',
    profileImage: null,
  },
};

let mockPosts = [
  {
    id: '1',
    authorId: '2',
    authorName: 'Karim Saif',
    authorImage: null,
    content: 'Healthy Tracking App - A new way to monitor your fitness goals!',
    image: null,
    visibility: 'Public',
    createdAt: new Date(Date.now() - 5 * 60000),
    likes: ['1', '3'],
    likedBy: [
      { id: '1', name: 'Alice Johnson' },
      { id: '3', name: 'Bob Smith' },
    ],
    comments: [
      {
        id: 'c1',
        authorId: '1',
        authorName: 'Radovan SkillArena',
        authorImage: null,
        content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        likes: ['3'],
        likedBy: [{ id: '3', name: 'Bob Smith' }],
        createdAt: new Date(Date.now() - 3 * 60000),
        replies: [],
      },
    ],
  },
  {
    id: '2',
    authorId: '1',
    authorName: 'Alice Johnson',
    authorImage: null,
    content: 'Just finished completing my first React project! Feeling proud.',
    image: null,
    visibility: 'Public',
    createdAt: new Date(Date.now() - 15 * 60000),
    likes: [],
    likedBy: [],
    comments: [],
  },
  {
    id: '3',
    authorId: '3',
    authorName: 'Bob Smith',
    authorImage: null,
    content: 'Private thoughts about today.',
    image: null,
    visibility: 'Private',
    createdAt: new Date(Date.now() - 30 * 60000),
    likes: [],
    likedBy: [],
    comments: [],
  },
];

let nextPostId = 4;
let nextCommentId = 2;
let nextReplyId = 1;

export const mockAuthService = {
  register: async (firstName, lastName, email, password) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (mockUsers[email]) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      firstName,
      lastName,
      email,
      password,
      profileImage: null,
    };

    mockUsers[email] = newUser;

    const token = btoa(email + ':' + password);
    return {
      token,
      user: { id: newUser.id, firstName, lastName, email },
    };
  },

  login: async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers[email];
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

    const token = btoa(email + ':' + password);
    return {
      token,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
    };
  },
};

export const mockPostService = {
  getPosts: async (userId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Filter posts based on visibility and ownership
    return mockPosts
      .filter((post) => {
        if (post.visibility === 'Private') {
          return post.authorId === userId;
        }
        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  createPost: async (userId, content, image, visibility) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const user = Object.values(mockUsers).find((u) => u.id === userId);
    const post = {
      id: nextPostId.toString(),
      authorId: userId,
      authorName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
      authorImage: null,
      content,
      image,
      visibility,
      createdAt: new Date(),
      likes: [],
      likedBy: [],
      comments: [],
    };

    mockPosts.unshift(post);
    nextPostId++;
    return post;
  },

  likePost: async (postId, userId) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const post = mockPosts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes = post.likes.filter((id) => id !== userId);
      post.likedBy = post.likedBy.filter((u) => u.id !== userId);
    } else {
      post.likes.push(userId);
      const user = Object.values(mockUsers).find((u) => u.id === userId);
      post.likedBy.push({ id: userId, name: `${user.firstName} ${user.lastName}` });
    }

    return post;
  },

  addComment: async (postId, userId, content) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const post = mockPosts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    const user = Object.values(mockUsers).find((u) => u.id === userId);
    const comment = {
      id: `c${nextCommentId}`,
      authorId: userId,
      authorName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
      authorImage: null,
      content,
      likes: [],
      likedBy: [],
      createdAt: new Date(),
      replies: [],
    };

    post.comments.push(comment);
    nextCommentId++;
    return comment;
  },

  likeComment: async (postId, commentId, userId) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const post = mockPosts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    const comment = post.comments.find((c) => c.id === commentId);
    if (!comment) throw new Error('Comment not found');

    const isLiked = comment.likes.includes(userId);
    if (isLiked) {
      comment.likes = comment.likes.filter((id) => id !== userId);
      comment.likedBy = comment.likedBy.filter((u) => u.id !== userId);
    } else {
      comment.likes.push(userId);
      const user = Object.values(mockUsers).find((u) => u.id === userId);
      comment.likedBy.push({ id: userId, name: `${user.firstName} ${user.lastName}` });
    }

    return comment;
  },

  addReply: async (postId, commentId, userId, content) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const post = mockPosts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    const comment = post.comments.find((c) => c.id === commentId);
    if (!comment) throw new Error('Comment not found');

    const user = Object.values(mockUsers).find((u) => u.id === userId);
    const reply = {
      id: `r${nextReplyId}`,
      authorId: userId,
      authorName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
      authorImage: null,
      content,
      likes: [],
      likedBy: [],
      createdAt: new Date(),
    };

    comment.replies.push(reply);
    nextReplyId++;
    return reply;
  },

  likeReply: async (postId, commentId, replyId, userId) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const post = mockPosts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');

    const comment = post.comments.find((c) => c.id === commentId);
    if (!comment) throw new Error('Comment not found');

    const reply = comment.replies.find((r) => r.id === replyId);
    if (!reply) throw new Error('Reply not found');

    const isLiked = reply.likes.includes(userId);
    if (isLiked) {
      reply.likes = reply.likes.filter((id) => id !== userId);
      reply.likedBy = reply.likedBy.filter((u) => u.id !== userId);
    } else {
      reply.likes.push(userId);
      const user = Object.values(mockUsers).find((u) => u.id === userId);
      reply.likedBy.push({ id: userId, name: `${user.firstName} ${user.lastName}` });
    }

    return reply;
  },
};

export const mockApiService = {
  // Wrapper that uses mock or real API based on environment
  register: mockAuthService.register,
  login: mockAuthService.login,
  getPosts: mockPostService.getPosts,
  createPost: mockPostService.createPost,
  likePost: mockPostService.likePost,
  addComment: mockPostService.addComment,
  likeComment: mockPostService.likeComment,
  addReply: mockPostService.addReply,
  likeReply: mockPostService.likeReply,
};
