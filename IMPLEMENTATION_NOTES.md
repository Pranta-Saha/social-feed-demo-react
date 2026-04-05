# Implementation Notes

## Architecture Overview

This React application is built using modern best practices with the following architecture:

```
┌─────────────────────────────────────────────────┐
│         React Router (Client-Side Routing)      │
├─────────────────────────────────────────────────┤
│  Registration  │  Login  │  Feed (Protected)    │
├─────────────────────────────────────────────────┤
│         AuthContext (State Management)          │
├─────────────────────────────────────────────────┤
│  Components (UI Layer)                          │
├─────────────────────────────────────────────────┤
│   API Service (Data Layer)                      │
└─────────────────────────────────────────────────┘
```

## Core Decisions

### 1. State Management: React Context
**Why**: Simple state management for authentication without Redux complexity
- Single cross-cutting concern (authentication)
- All pages need auth state
- Context provides clean provider pattern

**Implementation**: `src/context/AuthContext.jsx`
- Stores user info, token, and loading state
- Provides login, register, logout methods
- Integrates with localStorage for persistence

### 3. Component Structure: Functional Components with Hooks
**Why**: Modern React approach, easier to reason about

**Patterns Used**:
- `useState` for local component state
- `useEffect` for side effects  
- `useContext` for auth/global state
- `useNavigate` for routing

### 4. Styling: CSS Classes from Design System
**Why**: Maintains design consistency without custom CSS

**Files**:
- `src/index.css` - imports all design CSS
- `src/assets/css/bootstrap.min.css` - Bootstrap 5 grid
- `src/assets/css/common.css` - CSS variables and base classes
- `src/assets/css/main.css` - Component-specific styles

**CSS Variables** (defined in common.css):
```css
--color: #2D3748          /* Primary text color */
--color5: #1890FF         /* Primary action color (blue) */
--bg1: #F0F2F5           /* Page background */
--bg2: #FFFFFF           /* Component background */
--b-shadow1-6: ...       /* Shadow utilities */
--bcolor1-2: ...         /* Border colors */
```

### 5. Authentication Flow

```
┌──────────────┐
│  Register    │ ──────────────────┐
└──────────────┘                   │
                                   ▼
                             ┌──────────────┐
┌──────────────┐             │   AuthStore  │
│    Login     │────────────▶│  - user info │
└──────────────┘             │  - JWT token │
                             │  - isAuth    │
                             └──────────────┘
                                   │
                                   ▼
                         ┌──────────────────┐
                         │ Protected Routes │
                         │ - Feed accessible│
                         │ - Other redirects│
                         └──────────────────┘
```

**Key Points**:
- JWT token stored in localStorage
- User info also persisted locally
- Automatic refresh on page reload
- Unauthenticated access redirected to login

### 6. Feed Data Management

```
Posts Array Structure:
┌─────────────────────────────────────┐
│ Post {                              │
│   id, authorId, authorName,         │
│   content, image, visibility,       │
│   createdAt,                        │
│   likes: [userId...],               │
│   likedBy: [{id, name}...],        │
│   comments: [Comment...]            │
│ }                                   │
├─────────────────────────────────────┤
│ Comment {                           │
│   id, authorId, authorName,         │
│   content, createdAt,               │
│   likes: [userId...],               │
│   likedBy: [{id, name}...],        │
│   replies: [Reply...]               │
│ }                                   │
├─────────────────────────────────────┤
│ Reply {                             │
│   id, authorId, authorName,         │
│   content, createdAt,               │
│   likes: [userId...],               │
│   likedBy: [{id, name}...]         │
│ }                                   │
└─────────────────────────────────────┘
```

### 8. Comment & Reply System

**Nesting Structure**:
```
Post
├── Comment 1
│   ├── Reply 1
│   ├── Reply 2
│   └── Reply N
├── Comment 2
│   ├── Reply 1
│   └── Reply N
└── Comment N
    └── (replies array)
```

**View Control**:
- First 1 comment shown by default
- "View previous comments" expands all
- Replies hidden by default
- "Show/Hide Replies" toggles visibility

### 9. Time Display Implementation

```javascript
const getTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
};
```

### 10. Post Visibility/Privacy

**Current Implementation**:
- All user-created posts set to "Public"
- System filters private posts (only author sees)
- Feed shows public posts from all users + user's own posts

**Structure**:
```javascript
getFeed = (userId) => {
  return allPosts.filter(post => {
    if (post.visibility === 'Private') {
      return post.authorId === userId; // Only author sees
    }
    return true; // Public visible to all
  });
};
```

### 11. Component Hierarchy

```
App (Router setup)
├── AuthProvider
├── Registration
├── Login
└── Feed (Protected)
    ├── FeedHeader
    │   └── User info + Logout
    ├── CreatePost
    │   └── Image upload + Post button
    └── Posts List
        └── PostDetails (repeats)
            ├── Post header (author, time)
            ├── Post content
            ├── Post image
            ├── Like count (with hover)
            ├── Like/Comment buttons
            └── CommentSection
                ├── Comment input
                └── Comments List
                    └── Comment (repeats)
                        ├── Comment author
                        ├── Comment content
                        ├── Like/Reply buttons
                        ├── Reply input (conditional)
                        └── Replies List
                            └── Reply (repeats)
```

### 12. Data Flow for Post Creation

```
User Input
    │
    ▼
CreatePost Component
    │
    ├── Validate content
    │
    ▼
mockApiService.createPost()
    │
    ├── Create post object
    ├── Add to mockPosts array
    ├── Return new post
    │
    ▼
Feed.handlePostCreated()
    │
    ├── Add to posts state
    │
    ▼
Feed renders new post immediately
```

### 13. Error Handling Strategy

**Approach**: Graceful degradation
- Form validation before submission
- API error messages to user
- Try-catch in async operations
- Loading states prevent double-submission
- Fallback images for missing post images

### 14. Performance Considerations

**Future Optimizations**:
- Virtual scrolling for large post lists
- Memoized components with React.memo()
- Debounced search if added
- Code splitting with React.lazy()

### 15. Security Considerations

**Current (Development)**:
- Mock authentication sufficient
- Tokens stored in localStorage (not secure for production)

**For Production**:
- Use httpOnly cookies instead of localStorage
- Implement CSRF protection
- Validate all inputs server-side
- Use HTTPS only
- Implement rate limiting
- Sanitize user content
- Use Content Security Policy headers

---

## File Responsibilities

| File | Lines | Purpose |
|------|-------|---------|
| App.jsx | 30 | Routing & provider setup |
| AuthContext.jsx | 80 | Auth state management |
| Registration.jsx | 150 | Signup UI & logic |
| Login.jsx | 140 | Login UI & logic |
| Feed.jsx | 80 | Main feed layout |
| CreatePost.jsx | 110 | Post creation form |
| PostDetails.jsx | 120 | Individual post display |
| CommentSection.jsx | 100 | Comments container |
| Comment.jsx | 150 | Comment + replies UI |
| Reply.jsx | 80 | Reply component |
| mockService.js | 200 | Mock API data |

**Total**: ~1,200 lines of React code (excluding CSS)

---

## Testing Scenarios

### Registration Flow
1. ✅ Fill all fields → Register → Auto-login to feed
2. ✅ Leave field empty → Show error
3. ✅ Passwords don't match → Show error
4. ✅ Create account already exists → Show error

### Authentication Flow
1. ✅ Account exists, correct password → Login to feed
2. ✅ Account exists, wrong password → Show error
3. ✅ Account doesn't exist → Show error
4. ✅ Successful login → Token stored, user info saved
5. ✅ Page reload → Still logged in
6. ✅ Logout → Clear token, redirect to login

### Feed Features
1. ✅ Create post with text → Post appears at top
2. ✅ Create post with image → Image shows in post
3. ✅ Like post → Like count increases
4. ✅ Like post again → Like count decreases
5. ✅ Hover on likes → See who liked
6. ✅ Add comment → Comment appears
7. ✅ Like comment → Like count increases
8. ✅ Reply to comment → Reply shows in nested view
9. ✅ Show/Hide replies → Replies toggle visibility
10. ✅ View previous comments → All comments show

### UI/UX
4. ✅ Loading states show
5. ✅ Error messages display
6. ✅ Images load with fallback
7. ✅ Timestamps update (showing time delta)

---

## Future Enhancements

- [ ] Real backend API integration
- [ ] User profiles
- [ ] Direct messaging
- [ ] Notifications
- [ ] Search functionality
- [ ] More post reactions (emoji)
- [ ] Post editing/deletion
- [ ] User following system
- [ ] Hashtags support
- [ ] Media gallery for profiles

---

## Code Quality

**Standards Followed**:
- ESLint rules enforced
- Consistent formatting
- Clear component names
- Comments where needed
- Proper error handling

**Maintainability**:
- Components are isolated
- Easy to swap mock service
- Clear data flow
- Documented patterns
- Test-friendly architecture