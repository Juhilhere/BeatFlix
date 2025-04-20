import { useState } from 'react';
import axios from 'axios';
import SongCard from '../SongCard/SongCard';
import './Search.css';

const Search = ({ onSelectSong }) => {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`);
      if (response.data && response.data.data && response.data.data.results) {
        setSongs(response.data.data.results);
      } else {
        setSongs([]);
      }
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError('Failed to fetch songs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSongSelect = (song) => {
    if (onSelectSong) {
      onSelectSong(song);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs, artists, albums..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {loading && <p className="search-status">Loading...</p>}
      {error && <p className="search-error">{error}</p>}

      <div className="songs-container">
        {songs.length > 0 ? (
          songs.map((song) => (
            <SongCard 
              key={song.id} 
              song={song} 
              onSelect={() => handleSongSelect(song)} 
            />
          ))
        ) : (
          !loading && <p className="no-results">No songs found. Try searching for something else.</p>
        )}
      </div>
    </div>
  );
};

export default Search;