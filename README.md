# BeatFlix - Music Streaming Application

A modern music streaming application built with React and Vite.

## Features

- Browse trending songs and curated playlists
- Search for songs with real-time suggestions
- Like and manage your favorite songs
- Responsive design for mobile and desktop
- Modern, intuitive user interface

## Tech Stack

- React.js (Functional Components + Hooks)
- React Router for navigation
- Custom CSS with modern features
- Axios for API integration
- Vite for build tooling

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```
   VITE_API_BASE_URL=https://saavn.dev/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
  ├── components/         # Reusable components
  ├── config/            # Configuration files
  ├── assets/            # Static assets
  └── App.jsx            # Main application component
```

## Environment Variables

Create a `.env` file with the following variables:

- `VITE_API_BASE_URL`: Base URL for the Saavn API

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Best Practices

- Modular component structure
- Custom CSS with modern features
- Proper error handling
- Form validation
- Responsive design
- Environment variable usage
