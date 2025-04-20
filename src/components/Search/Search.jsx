import { useState } from "react";
import axios from "axios";
import SongCard from "../SongCard/SongCard";
import "./Search.css";

const Search = ({ onSelectSong, onAddToQueue, fullWidth }) => {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);
  const [validationError, setValidationError] = useState("");

  const validateQuery = (value) => {
    if (!value.trim()) {
      return "Search query cannot be empty";
    }
    if (value.length < 2) {
      return "Search query must be at least 2 characters";
    }
    if (value.length > 50) {
      return "Search query cannot exceed 50 characters";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (touched) {
      setValidationError(validateQuery(value));
    }
  };

  const handleInputBlur = () => {
    setTouched(true);
    setValidationError(validateQuery(query));
  };

  const removeDuplicateSongs = (songList) => {
    const uniqueSongs = new Map();
    songList.forEach((song) => {
      const primaryArtist = song.artists?.primary?.[0]?.name || "Unknown";
      const key = `${song.name.toLowerCase()}-${primaryArtist.toLowerCase()}`;
      if (!uniqueSongs.has(key)) {
        uniqueSongs.set(key, song);
      }
    });
    return Array.from(uniqueSongs.values());
  };

  const searchSongs = async (searchQuery) => {
    try {
      const [songsResponse, artistsResponse] = await Promise.all([
        // Search specifically for songs with the query
        axios.get(
          `https://saavn.dev/api/search/songs?query=${encodeURIComponent(
            searchQuery
          )}&limit=15`
        ),
        // Search for artists to get their songs
        axios.get(
          `https://saavn.dev/api/search/artists?query=${encodeURIComponent(
            searchQuery
          )}&limit=3`
        ),
      ]);

      let allSongs = [];
      let verifiedArtists = new Set(); // Keep track of verified/popular artists

      // First, identify verified/popular artists from the artist search
      if (artistsResponse.data?.data?.results) {
        const artists = artistsResponse.data.data.results;
        for (const artist of artists) {
          // Add artists with profile images as verified (these are typically more popular/official artists)
          if (artist.image && artist.image.length > 0) {
            verifiedArtists.add(artist.name.toLowerCase());
          }

          if (artist.id) {
            try {
              const artistSongs = await axios.get(
                `https://saavn.dev/api/artists/${artist.id}/songs?limit=5`
              );
              if (artistSongs.data?.data?.results) {
                allSongs = [...allSongs, ...artistSongs.data.data.results];
              }
            } catch (error) {
              console.error("Error fetching artist songs:", error);
            }
          }
        }
      }

      // Add direct song search results
      if (songsResponse.data?.data?.results) {
        allSongs = [...allSongs, ...songsResponse.data.data.results];
      }

      // Filter and sort results by relevance
      const uniqueSongs = removeDuplicateSongs(allSongs);
      const searchLower = searchQuery.toLowerCase();
      const searchTerms = searchLower
        .split(" ")
        .filter((term) => term.length > 1);

      const sortedSongs = uniqueSongs.sort((a, b) => {
        const aTitle = a.name.toLowerCase();
        const bTitle = b.name.toLowerCase();
        const aArtist = a.artists?.primary?.[0]?.name?.toLowerCase() || "";
        const bArtist = b.artists?.primary?.[0]?.name?.toLowerCase() || "";

        // Calculate relevance scores
        const scoreA = calculateRelevanceScore(
          aTitle,
          aArtist,
          searchLower,
          searchTerms,
          verifiedArtists
        );
        const scoreB = calculateRelevanceScore(
          bTitle,
          bArtist,
          searchLower,
          searchTerms,
          verifiedArtists
        );

        return scoreB - scoreA; // Higher score first
      });

      return sortedSongs;
    } catch (error) {
      throw error;
    }
  };

  const calculateRelevanceScore = (
    title,
    artist,
    searchQuery,
    searchTerms,
    verifiedArtists
  ) => {
    let score = 0;

    // Exact title match gets highest priority
    if (title === searchQuery) score += 100;

    // Title starts with search query
    if (title.startsWith(searchQuery)) score += 80;

    // Title contains the exact search query
    if (title.includes(searchQuery)) score += 60;

    // Verified artist bonus
    if (verifiedArtists.has(artist)) score += 40;

    // Exact artist name match
    if (artist === searchQuery) score += 30;

    // Artist name contains search query
    if (artist.includes(searchQuery)) score += 20;

    // Partial matches for each search term
    searchTerms.forEach((term) => {
      if (title.includes(term)) score += 10;
      if (artist.includes(term)) score += 5;
    });

    // Bonus for shorter, more precise matches
    if (title.length < searchQuery.length * 2) score += 5;

    // Penalty for very long titles that might be remixes/covers
    if (
      title.includes("remix") ||
      title.includes("cover") ||
      title.includes("version")
    ) {
      score -= 15;
    }

    return score;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const error = validateQuery(query);
    setTouched(true);
    setValidationError(error);

    if (error) return;

    setLoading(true);
    setError(null);

    try {
      const searchResults = await searchSongs(query.trim());
      setSongs(searchResults);
    } catch (err) {
      console.error("Error fetching songs:", err);
      setError("Failed to fetch songs. Please try again.");
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
    <div className={`search-container ${fullWidth ? "full-width" : ""}`}>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Search for songs or artists..."
            className={`search-input ${
              validationError && touched ? "error" : ""
            }`}
            aria-label="Search query"
            aria-invalid={!!validationError}
            aria-describedby={validationError ? "search-error" : undefined}
          />
          <button
            type="submit"
            className="search-button"
            disabled={!!validationError || loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {validationError && touched && (
          <div className="validation-error" id="search-error" role="alert">
            {validationError}
          </div>
        )}
      </form>

      {loading && <p className="search-status">Loading...</p>}
      {error && (
        <p className="search-error" role="alert">
          {error}
        </p>
      )}

      <div className="songs-container">
        {songs.length > 0
          ? songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onSelect={() => handleSongSelect(song)}
                onAddToQueue={onAddToQueue}
              />
            ))
          : !loading && (
              <p className="no-results">
                ✧ No melodies found for your search. Try a different tune... ✧
              </p>
            )}
      </div>
    </div>
  );
};

export default Search;
