# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A1 Learner is a full-stack engineering education platform built with Node.js/Express backend and React frontend (using CDN). The application serves static frontend files and provides REST API endpoints for course management.

## Architecture

```
├── server.js              # Main Express server entry point
├── frontend/              # Static frontend assets
│   ├── index.html         # Main HTML with React CDN
│   ├── app.js            # React components using JSX via Babel
│   └── style.css         # Custom styles with Bootstrap
├── backend/              # Empty backend directory
├── package.json          # Node.js dependencies and scripts
└── .env                  # Environment configuration
```

The application uses:
- **Backend**: Express.js server serving static files and API routes
- **Frontend**: React via CDN with Babel for JSX transformation in browser
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Bootstrap 5 + custom CSS

## Common Development Commands

### Start the application
```bash
npm start          # Start the server (production)
npm run dev        # Start the server (development, same as start)
```

### Install dependencies
```bash
npm install        # Install all dependencies
```

### Access the application
- Frontend: http://localhost:3000
- API endpoints: http://localhost:3000/api/*

## API Endpoints

- `GET /api/courses` - Fetch all courses
- `POST /api/courses` - Create a new course

## Environment Variables

Configure in `.env` file:
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment mode

## Database Requirements

The application expects MongoDB to be running locally on default port 27017. If MongoDB is not available, the application will still run but database features will be disabled.

To set up MongoDB:
```bash
# Install MongoDB locally or use MongoDB Atlas
# Default connection: mongodb://localhost:27017/a1_learner
```

## Frontend Development

The frontend uses React via CDN with in-browser JSX compilation using Babel. Components are defined in `frontend/app.js`:
- `Navbar` - Navigation component
- `HeroSection` - Landing section
- `CourseCard` - Individual course display
- `CoursesSection` - Course listing with state management
- `Footer` - Page footer
- `App` - Main application component

## Key Technical Decisions

- **No build process**: Frontend uses CDN React + in-browser Babel compilation for simplicity
- **Static file serving**: Express serves frontend directory directly
- **Graceful degradation**: App runs without database connection
- **Environment-first**: All configuration through environment variables
