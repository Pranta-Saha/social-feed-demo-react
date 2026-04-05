# Quick Start Guide - Social Feed App

## 🚀 Start Developing Immediately

### 1. Start the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### 2. Test the App
Navigate to the running application and:

#### Option A: Create a New Account
- Click "Create New Account" on the login page
- Fill in: First Name, Last Name, Email, Password
- Submit to create account (auto-logs in)

### 3. Features to Test

**Create Posts**
- Write text content in "Write something..." box
- Click "Photo" to add an image (optional)
- Click "Post" to submit

**Like Posts**
- Click "Like" button on any post
- Hover over like count to see who liked

**Comment on Posts**
- Type in comment box at bottom of post
- Click "Post" button

**Reply to Comments**
- Click "Reply." on any comment
- Write reply text
- Click "Reply" button
- View replies by clicking "Show (n) Replies"

**Like Comments/Replies**
- Click "Like." on any comment
- Hover over like count to see who liked

**View Previous Comments**
- Click "View previous comments" to see all comments
- By default shows first 3 comments

**Logout**
- Click "Logout" button in header

---

## 📂 Project Files

Key files to understand the architecture:

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app with routing setup |
| `src/context/AuthContext.jsx` | Authentication state management |
| `src/pages/Registration.jsx` | Registration page |
| `src/pages/Login.jsx` | Login page |
| `src/pages/Feed.jsx` | Main feed page |
| `src/components/CreatePost.jsx` | Post creation form |
| `src/components/PostDetails.jsx` | Individual post display |
| `src/components/CommentSection.jsx` | All comments for a post |
| `src/components/Comment.jsx` | Individual comment with replies |
| `src/components/Reply.jsx` | Individual reply |
| `src/services/mockService.js` | Mock API data and functions |

---

## 🎯 Key Features Implemented

✅ Registration with form validation  
✅ Login with JWT token storage  
✅ Protected routes (Feed only for authenticated users)  
✅ Create posts with text and optional images  
✅ Like/unlike posts, comments, and replies  
✅ View who liked (hover functionality)  
✅ Add comments to posts  
✅ Reply to comments with nesting  
✅ Like comments and replies  
✅ Relative timestamps (e.g., "5 minutes ago")  
✅ Post visibility (public/private support)  
✅ Default image fallback  
✅ Persistent authentication  

---

## 🔧 Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production  
npm run lint     # Run linter
npm run preview  # Preview production build
```

---

## 📱 Testing with Multiple Users

The mock data includes 3 test users. Each user can:
- See their own public posts and posts from others
- Create new posts
- Comment on posts
- Like posts and comments
---

## 🐛 Troubleshooting

**App won't load:**
- Check browser console (F12) for errors
- Restart dev server: Stop and run `npm run dev` again

**Styles look broken:**
- Verify `src/assets` folder exists with all CSS files
- Clear browser cache (Ctrl+Shift+Delete)

**Login not working:**
- Use exact email from test accounts
- Password is `password123`
- Check browser console for specific error

**Posts not showing:**
- Try refreshing the page
- Check that you're logged in
- Look in browser console for fetch errors

---

## 📝 Code Style

- **Components**: Functional components with Hooks
- **CSS**: Use classes from design system (e.g., `_btn1`, `_mar_b16`)
- **No new CSS classes** - all styling from provided design files
- **Naming**: Underscore-prefixed for design system classes

---
