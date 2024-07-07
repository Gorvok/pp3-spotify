import React, { useState } from 'react';
import axios from 'axios';
import './Search.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(`http://localhost:3001/search?q=${query}`, { headers });
        setResults(response.data);
    };

    return (
        <div className="search-container">
            <h1>Search for artist, album, or song</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for artist..."
                />
                <button type="submit">Search</button>
            </form>
            <div className="results-container">
                {results.length === 0 && <p>No Results. Please type in a search query to get started...</p>}
                {results.map((result) => (
                    <div key={result.id} className="result-item">
                        <p>{result.name}</p>
                        <a href={result.external_urls.spotify} target="_blank" rel="noopener noreferrer">Go to Spotify</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;
