# Social Feed Frontend - React Application

A fully functional React-based social media feed application with authentication, posts, comments, and replies system.

## 📋 Project Overview

This is a production-ready React social feed application built from the design specifications. The app includes:

- **Authentication System**: User registration and login with JWT-based authentication
- **Protected Routes**: Feed page accessible only to authenticated users
- **Social Feed**: Display posts from all users (chronologically sorted)
- **Post Management**: Create posts with text and optional image
- **Post Interactions**: Like/unlike posts, view who liked
- **Comments System**: Add comments to posts
- **Replies System**: Reply to comments with nested reply support
- **Like System**: Like comments and replies with user attribution
- **Time Display**: Shows relative time (e.g., "5 minutes ago")
- **Post Visibility**: Support for public/private posts

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to the project directory**
   ```bash
   cd social-feed-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Development Server
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📁 Project Structure

```
src/
├── assets/                # CSS, fonts, and image assets from design-reference
├── components/            # Reusable React components
│   ├── Comment.jsx       # Individual comment with replies
│   ├── CommentSection.jsx # Comments container for a post
│   ├── CreatePost.jsx    # Post creation form
│   ├── FeedHeader.jsx    # Navigation header
│   ├── PostDetails.jsx   # Individual post display
│   ├── ProtectedRoute.jsx # Route protection wrapper
│   └── Reply.jsx         # Individual reply component
├── context/              # React Context for state management
│   └── AuthContext.jsx   # Authentication context & provider
├── pages/                # Full page components
│   ├── Feed.jsx         # Main feed page
│   ├── Login.jsx        # Login page
│   └── Registration.jsx # Registration page
├── services/             # API and service utilities
│   └── mockService.js   # Mock data service for development
├── App.jsx              # Main app component with routing
├── index.css            # Global styles
└── main.jsx             # React entry point
```

## 🔐 Authentication

### Demo Credentials
For testing without creating a new account:
- **Email**: `user1@example.com`
- **Password**: `password123`

Additional test accounts available:
- `user2@example.com` / `password123`
- `user3@example.com` / `password123`

### How It Works
1. User registers with first name, last name, email, and password
2. JWT token is stored in localStorage
3. Token is used for authenticated requests
4. Protected route redirects unauthenticated users to login

## 🎨 Design & Styling

All styling comes from the approved design specifications:
- **CSS Files**: Bootstrap + custom CSS from design-reference
- **Fonts**: Poppins (from Google Fonts)
- **Icons**: SVG icons from design-reference
- **Variables**: CSS custom properties for colors and spacing
  - Colors: `--color`, `--bg1`, `--bg2`, `--color5` (primary blue)
  - Shadows: `--b-shadow1` through `--b-shadow6`

**Important**: Do not create new CSS classes. All styling uses the predefined classes from the design system.

## 💾 Data Management

### Mock Data Service
The app uses a mock data service for development and testing. This simulates a backend API without requiring a real server.

**Mock Data Includes**:
- 3 pre-configured test users
- 3 sample posts
- Comments and replies for demonstration

### In Production
Replace mock API calls in the following files with real backend endpoints:
- `src/services/mockService.js` → Implement real API calls
- `src/context/AuthContext.jsx` → Update API endpoint configuration

## 🔄 Features Implementation

### Registration
- Form validation (required fields, password match)
- Error handling and user feedback
- Auto-login after successful registration

### Login
- Email and password authentication
- Remember user state with localStorage
- Demo credentials helper button
- Redirect to feed on successful login

### Feed Page
- Protected route - redirects unauthenticated users to login
- Displays posts sorted by newest first
- Shows user greeting in header
- Logout functionality

### Create Post
- Text content required
- Optional single image upload
- Public/Private visibility (currently all public in mock)
- Image preview before posting
- Clear button to remove selected image

### Post Display
- Author name and profile image
- Timestamp (relative time)
- Post visibility (Public/Private)
- Post content and image
- Like count with hover to see who liked

### Likes System
- Like/Unlike posts, comments, and replies
- Hover on like count shows users who liked
- Visual feedback (blue highlight when liked)
- Persistent state across navigation

### Comments
- Add comments to posts
- View up to 3 comments initially
- "View previous comments" button to see all
- Comment author, timestamp, and content
- Like count on comments

### Replies
- Reply to comments (nested structure)
- "Show/Hide Replies" button when comments have replies
- Reply author, timestamp, and content
- Like count on replies
- Write reply textbox appears inline

## 🛠️ Key Components

### AuthContext
Manages authentication state including:
- User information
- Login/Registration logic
- Token management
- Logout functionality

### CreatePost
Allows users to:
- Write post content
- Upload a single image
- Preview image before posting
- Submit posts to the feed

### PostDetails
Displays individual posts with:
- Author information
- Post content and image
- Like/Comment counts
- Interaction buttons
- Full comment section

### CommentSection
Manages all comments on a post:
- Display existing comments
- Add new comments
- Handle comment visibility ("View previous")
- Pass comments to Comment components

### Comment
Individual comment display with:
- Comment content and author
- Like functionality
- Reply functionality
- Nested replies display

### Reply
Individual reply display with:
- Reply content and author
- Like functionality
- Timestamp
- User attribution on hover

## 📱 Responsive Design

The app is responsive across all device sizes:
- Mobile: Single column layout
- Tablet: Adjusted spacing and font sizes
- Desktop: Full three-column layout (sidebars, main feed)

Bootstrap grid classes are used throughout, with custom responsive CSS.

## 🔗 Routing

- `/` → Redirects to `/feed`
- `/register` → Registration page (public)
- `/login` → Login page (public)
- `/feed` → Main feed (protected)
- `*` → Catches all undefined routes and redirects to `/feed`

## 🚨 Error Handling

- Form validation with user-friendly error messages
- API error handling with fallbacks
- Loading states for async operations
- Protected routes to prevent unauthorized access

## 📝 Code Standards

- **Class Naming**: Uses underscore-prefixed classes from design system (e.g., `_btn1`, `_mar_b16`)
- **Components**: Functional components with React Hooks
- **State Management**: React Context for auth, local state for components
- **Styling**: CSS classes from design files, no inline styles except for dynamic values

## 🔗 Integrating with Real Backend

When ready to integrate with a real backend:

1. **Create API endpoint configuration**:
   ```javascript
   // src/services/config.js
   export const API_BASE_URL = 'http://localhost:5000/api';
   ```

2. **Replace mock service with real API calls**:
   ```javascript
   // src/services/apiService.js
   export const register = (firstName, lastName, email, password) => {
     return fetch(`${API_BASE_URL}/auth/register`, { ... });
   };
   ```

3. **Update AuthContext to use real endpoints**

4. **Implement proper error handling**

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## ⚙️ Environment Configuration

Create a `.env` file for environment-specific configuration:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_JWT_TOKEN_KEY=auth_token
```

## 🐛 Troubleshooting

### App won't start
- Clear node_modules: `rm -rf node_modules && npm install`
- Rebuild: `npm run build`
- Check port 5173 isn't in use

### Styles not loading
- Verify assets are in `src/assets/`
- Check CSS import order in `src/index.css`
- Restart dev server

### Components not rendering
- Check console for error messages
- Verify component imports are correct
- Ensure all required props are passed

## 📄 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

When adding features:
1. Use existing CSS classes from the design system
2. Keep components focused and reusable
3. Handle errors gracefully
4. Test with the mock data service first
5. Use React Context for cross-component state

## 📄 License

This project is built for educational purposes based on provided design specifications.

---

**Note**: The `design-reference` folder is for reference only and will be removed before production deployment.
