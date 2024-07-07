import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
    const [playlists, setPlaylists] = React.useState([]);
    const [topTracks, setTopTracks] = React.useState([]);
    const [recentlyPlayed, setRecentlyPlayed] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const headers = { Authorization: `Bearer ${token}` };

                const playlistsRes = await axios.get('http://localhost:3001/playlists', { headers });
                setPlaylists(playlistsRes.data.items);

                const topTracksRes = await axios.get('http://localhost:3001/top-tracks', { headers });
                setTopTracks(topTracksRes.data.items);

                const recentlyPlayedRes = await axios.get('http://localhost:3001/recently-played', { headers });
                setRecentlyPlayed(recentlyPlayedRes.data.items);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSearch = async (e) => {
        if (e.key !== 'Enter') return;

        if (!searchQuery) {
            setSearchResults(null);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const searchRes = await axios.get(`http://localhost:3001/search?q=${searchQuery}`, { headers });
            setSearchResults(searchRes.data);
        } catch (error) {
            console.error('Error searching:', error);
        }
    };

    return (
        <div className="dashboard">
            <div className="header">
                <img src="/spotify-512.png" alt="Spotify Logo" className="spotify-logo" />
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for artist, album, or song"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
            </div>
            {searchResults ? (
                <div className="search-results">
                    <div className="results-section">
                        <h3>Artists</h3>
                        <div className="cards">
                            {searchResults.artists.items.map(artist => (
                                <div key={artist.id} className="card">
                                    <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                        <img src={artist.images[0]?.url} alt={artist.name} />
                                        <div>{artist.name}</div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="results-section">
                        <h3>Albums</h3>
                        <div className="cards">
                            {searchResults.albums.items.map(album => (
                                <div key={album.id} className="card">
                                    <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                        <img src={album.images[0]?.url} alt={album.name} />
                                        <div>{album.name}</div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="results-section">
                        <h3>Songs</h3>
                        <div className="cards">
                            {searchResults.tracks.items.map(track => (
                                <div key={track.id} className="card">
                                    <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                        <img src={track.album.images[0]?.url} alt={track.name} />
                                        <div>{track.name}</div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="no-results">
                    <p>No Results</p>
                    <p>Please type in a search query to get started...</p>
                </div>
            )}
            <div className="playlists">
                <h2>Your Playlists</h2>
                <div className="cards">
                    {playlists.map(playlist => (
                        <div key={playlist.id} className="card">
                            <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                <img src={playlist.images[0]?.url} alt={playlist.name} />
                                <div>{playlist.name}</div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
            <div className="top-tracks">
                <h2>Your Top Tracks</h2>
                <div className="cards">
                    {topTracks.map(track => (
                        <div key={track.id} className="card">
                            <div>{track.name}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="recently-played">
                <h2>Recently Played Tracks</h2>
                <div className="cards">
                    {recentlyPlayed.map(track => (
                        <div key={track.track.id} className="card">
                            <div>{track.track.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
