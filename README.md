# Spotify Integration Project

## Project Overview
This project is a Spotify integration application designed to allow users to search for songs, albums, and artists using the Spotify API. The application features a user authentication system using JWT, a search interface, and links to Spotify's web player for each search result.

### Features
- User authentication with JWT
- Persistent login using JWT stored in the database
- Search functionality for songs, albums, and artists
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

## Getting Started

### Clone the Repository
```sh
git clone https://github.com/yourusername/spotify-integration.git
cd spotify-integration
```
## Install Dependencies
```sh
npm install
npm install express dotenv
```

## Set Up ENvironment Variables
Create a .env file in the root directory and add your Spotify API credentials.
```sh
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
JWT_SECRET=your_jwt_secret
```

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
- Middleware:
- Status:
- Login:
- Search:
