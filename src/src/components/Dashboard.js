import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [playlists, setPlaylists] = React.useState([]);
    const [topTracks, setTopTracks] = React.useState([]);
    const [recentlyPlayed, setRecentlyPlayed] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const playlistsRes = await axios.get('http://localhost:3001/playlists', { headers });
            setPlaylists(playlistsRes.data.items);

            const topTracksRes = await axios.get('http://localhost:3001/top-tracks', { headers });
            setTopTracks(topTracksRes.data.items);

            const recentlyPlayedRes = await axios.get('http://localhost:3001/recently-played', { headers });
            setRecentlyPlayed(recentlyPlayedRes.data.items);
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <h1>Spotify Dashboard</h1>
            <Link to="/search">Search for artist, album, or song</Link>
            <div className="playlists">
                <h2>Your Playlists</h2>
                {playlists.map(playlist => (
                    <div key={playlist.id}>{playlist.name}</div>
                ))}
            </div>
            <div className="top-tracks">
                <h2>Your Top Tracks</h2>
                {topTracks.map(track => (
                    <div key={track.id}>{track.name}</div>
                ))}
            </div>
            <div className="recently-played">
                <h2>Recently Played Tracks</h2>
                {recentlyPlayed.map(track => (
                    <div key={track.track.id}>{track.track.name}</div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
