# Spotify Integration Project

## Project Overview
This project is a Spotify integration application designed to allow users to search for songs, albums, and artists using the Spotify API. The application features a user authentication system using JWT, a search interface, and links to Spotify's web player for each search result.

### Features
- User authentication with JWT
- Persistent login using JWT stored in the database
- Search functionality for songs, albums, and artists
- Fetch user's playlists
- Fetch user's top tracks
- Fetch user's recently played tracks
- "No results" message if the search yields no results
- Thumbnails linking to Spotify web player

### Functionality
- Login screen appears if no valid JWT is present
- Direct access to the search page if a valid JWT is found
- Decoupled frontend and backend

## Prerequisites
- Node.js (version 14.x or higher)
- npm (version 6.x or higher)
- Git
- Spotify Developer account for API credentials
- MongoDB account for database

## Getting Started

### Clone the Repository
```sh
git clone https://github.com/yourusername/spotify-integration.git
cd spotify-integration
```
## Install Dependencies
```sh
npm install
npm install express dotenv mongoose jsonwebtoken cookie-parser body-parser request
```

## Set Up Environment Variables
Create a .env file in the root directory and add your Spotify API credentials.
```sh
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
JWT_SECRET=your_jwt_secret
REDIRECT_URI=http://localhost:3001/callback or whatever you would like
MONGO_URI=your_mongodb_connection_string
```
- This can also be found in the `.env.dist file`

## Run the Backend Server
```sh
npm run server
```
## Run the Frontend
```sh
npm start
```

## Access the Application
### Links
- FrontEnd: `http://localhost:3000`
- BackEnd: `http://localhost:3001`
- Middleware: `http://localhost:3001/protected` (Protected route, requires JWT)
- Status: `http://localhost:3001` (Backend status check)
- Login: `http://localhost:3001/login` (Initiates Spotify login)
- Callback: `http://localhost:3001/callback` (Spotify redirects here after login)
- Search: `http://localhost:3001/search?q=your_search_query` (Replace your_search_query with the search term)
- Playlists: `http://localhost:3001/playlists` (Fetch user's playlists)
- Top Tracks: `http://localhost:3001/top-tracks` (Fetch user's top tracks)
- Recently Played: `http://localhost:3001/recently-played` (Fetch user's recently played tracks)

