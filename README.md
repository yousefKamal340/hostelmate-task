# NoteMate - A Modern Note Taking Application

A full-stack note-taking application built with React, Node.js, and Express, featuring customizable note card themes.

## Features

- 🔐 User Authentication with JWT
- 📝 CRUD operations for notes
- 🎨 Customizable note card themes with color picker
- 📱 Responsive design for mobile and desktop
- 🔄 State management using React Context
- ⚡ Real-time updates and animations

## UI Twist: Customizable Card Themes

I chose to implement customizable card themes because it offers:
- Enhanced user personalization
- Visual organization capabilities (e.g., color-coding by priority or category)
- Opportunity to demonstrate clean state management and persistence
- Smooth animations and color transitions

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- Express Validator for input validation
- CORS for secure cross-origin requests

### Frontend
- React with TypeScript
- React Context for state management
- Material-UI for styling
- React Color for color picker
- Framer Motion for animations

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed locally or a MongoDB Atlas account
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/notemate.git
cd notemate
```

2. Set up environment variables:

Backend (.env):
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Install frontend dependencies
```bash
cd ../frontend
npm install
```

5. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

## Project Structure

```
notemate/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   └── services/
    └── package.json
```

## Challenges & Trade-offs

1. **Color Theme Persistence**: 
   - Challenge: Efficiently storing and retrieving theme data
   - Solution: Used a combination of backend storage and local caching

2. **Performance Optimization**:
   - Challenge: Smooth color transitions with many notes
   - Solution: Implemented debouncing and optimized re-renders

3. **Mobile Responsiveness**:
   - Challenge: Maintaining color picker usability on mobile
   - Solution: Custom mobile-friendly color selection interface

## Next Steps

With more time, I would implement:

1. **Accessibility Improvements**
   - Add ARIA labels and roles
   - Implement keyboard navigation
   - Enhance color contrast options

2. **CI/CD Pipeline**
   - Set up GitHub Actions
   - Implement automated testing
   - Add deployment automation

3. **Performance Optimizations**
   - Implement server-side pagination
   - Add client-side caching
   - Optimize bundle size

4. **Additional Features**
   - Note categories/tags
   - Search functionality
   - Collaborative note sharing
   - Export/import capabilities
