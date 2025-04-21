import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SongCard from "../SongCard/SongCard";
import "./Search.css";

const Search = ({
  onSelectSong,
  currentSongId,
  isPlaying,
  fullWidth,
  onToggleLike,
  likedSongs,
}) => {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [abortController, setAbortController] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const validateQuery = useCallback((value) => {
    if (!value.trim()) return "Search query cannot be empty";
    if (value.length < 2) return "Search query must be at least 2 characters";
    if (value.length > 50) return "Search query cannot exceed 50 characters";
    return "";
  }, []);

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const fetchSuggestions = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery || searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setIsLoadingSuggestions(true);
        const response = await axios.get(
          `https://saavn.dev/api/search/songs?query=${encodeURIComponent(
            searchQuery
          )}&limit=5`
        );
        const results = response.data.data.results;
        setSuggestions(results);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    const error = validateQuery(value);
    setValidationError(error);
    setSelectedSuggestionIndex(-1);

    if (!error && value.length >= 2) {
      fetchSuggestions(value);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  const handleSuggestionClick = (song) => {
    setQuery(song.name);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    performSearch(song.name);
  };

  const handleClearInput = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const performSearch = async (searchQuery) => {
    if (abortController) {
      abortController.abort();
    }

    const newController = new AbortController();
    setAbortController(newController);

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://saavn.dev/api/search/songs?query=${encodeURIComponent(
          searchQuery
        )}`,
        { signal: newController.signal }
      );
      setSongs(response.data.data.results);
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Request cancelled");
      } else {
        console.error("Search error:", err);
        setError("Failed to search songs. Please try again.");
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateQuery(query);
    setValidationError(error);
    if (error) return;

    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    performSearch(query);
  };

  const handleBackToHome = () => {
    navigate("/");
    setQuery("");
    setSongs([]);
    setError(null);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-input-container")) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to clear and blur search
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        handleClearInput();
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className={`search-container ${fullWidth ? "full-width" : ""}`}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <div className="search-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => query.length >= 2 && setShowSuggestions(true)}
              placeholder="Search for songs... (Ctrl + K)"
              className={`search-input ${validationError ? "error" : ""}`}
              autoComplete="off"
            />
            {query && !isLoadingSuggestions && (
              <button
                type="button"
                className="search-clear-button"
                onClick={handleClearInput}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
            {isLoadingSuggestions && (
              <div className="search-input-loading" role="status">
                <span className="sr-only">Loading suggestions...</span>
              </div>
            )}
            {validationError && (
              <p className="validation-error" role="alert">
                {validationError}
              </p>
            )}
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((song, index) => (
                <div
                  key={song.id}
                  className={`suggestion-item ${
                    index === selectedSuggestionIndex ? "selected" : ""
                  }`}
                  onClick={() => handleSuggestionClick(song)}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                >
                  <img
                    src={
                      song.image?.[0]?.url || "https://via.placeholder.com/40"
                    }
                    alt={song.name}
                    className="suggestion-image"
                  />
                  <div className="suggestion-info">
                    <span className="suggestion-title">{song.name}</span>
                    <span className="suggestion-artist">
                      {song.artists?.primary?.[0]?.name || "Unknown Artist"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="search-button"
          disabled={loading || !!validationError}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <p className="search-error" role="alert">
          {error}
        </p>
      )}

      {(songs.length > 0 || (!loading && query)) && (
        <div className="search-results-header">
          <button onClick={handleBackToHome} className="back-button">
            ← Back to Home
          </button>
          {songs.length > 0 && (
            <p className="results-count">
              {songs.length} {songs.length === 1 ? "song" : "songs"} found
            </p>
          )}
        </div>
      )}

      <div className="songs-container">
        {songs.length > 0
          ? songs.map((song) => (
              <SongCard
                key={`${song.id}-${song.name}`}
                song={song}
                onSelect={() => onSelectSong(song)}
                isCurrentSong={song.id === currentSongId}
                isPlaying={song.id === currentSongId && isPlaying}
                onToggleLike={onToggleLike}
                isLiked={likedSongs?.some((s) => s.id === song.id)}
              />
            ))
          : !loading &&
            query && (
              <p className="no-results" role="status">
                {error
                  ? "An error occurred while searching."
                  : "No songs found."}
              </p>
            )}
      </div>
    </div>
  );
};

export default Search;
