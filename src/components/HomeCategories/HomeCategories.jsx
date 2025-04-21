import { useState, useEffect } from "react";
import axios from "axios";
import SongCard from "../SongCard/SongCard";
import "./HomeCategories.css";

const HomeCategories = ({
  onSelectSong,
  currentSongId,
  isPlaying,
  onToggleLike,
  likedSongs,
}) => {
  const [categories, setCategories] = useState({
    trending: [],
    bollywoodHits: [],
    hollywoodSongs: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const removeDuplicateSongs = (songList) => {
    const uniqueSongs = new Map();
    songList.forEach((song) => {
      const key = `${song.name}-${
        song.artists?.primary?.[0]?.name || "Unknown"
      }`;
      if (!uniqueSongs.has(key)) uniqueSongs.set(key, song);
    });
    return Array.from(uniqueSongs.values());
  };

  const fetchCategorySongs = async () => {
    try {
      setLoading(true);
      setError(null);

      const [trending, bollywoodHits, hollywoodSongs] = await Promise.all([
        axios.get("https://saavn.dev/api/search/songs?query=trending"),
        axios.get("https://saavn.dev/api/search/songs?query=bollywood hits"),
        axios.get(
          "https://saavn.dev/api/search/songs?query=taylor swift ed sheeran weeknd"
        ),
      ]);

      setCategories({
        trending: removeDuplicateSongs(trending.data.data.results).slice(0, 10),
        bollywoodHits: removeDuplicateSongs(
          bollywoodHits.data.data.results
        ).slice(0, 10),
        hollywoodSongs: removeDuplicateSongs(
          hollywoodSongs.data.data.results
        ).slice(0, 10),
      });
    } catch (err) {
      console.error("Error fetching category songs:", err);
      setError("Failed to fetch songs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorySongs();
  }, [retryCount]);

  const handleRetry = () => setRetryCount((prev) => prev + 1);

  const CategorySection = ({ title, songs }) => (
    <div className="category-section">
      <h2 className="category-title">{title}</h2>
      <div className="category-songs">
        {songs.length > 0 ? (
          songs.map((song) => (
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
        ) : (
          <p className="no-songs">No songs available in this category</p>
        )}
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <>
      {[1, 2, 3].map((categoryIndex) => (
        <div key={categoryIndex} className="loading-category">
          <div className="loading-title"></div>
          <div className="loading-cards">
            {[1, 2, 3, 4, 5].map((cardIndex) => (
              <div key={cardIndex} className="loading-card">
                <div className="loading-image"></div>
                <div className="loading-content">
                  <div className="loading-text"></div>
                  <div className="loading-text"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );

  if (loading) {
    return (
      <div className="home-categories">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-categories error-state" role="alert">
        <p className="error-message">{error}</p>
        <button
          onClick={handleRetry}
          className="retry-button"
          aria-label="Retry loading categories"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="home-categories">
      <CategorySection title="Trending Songs" songs={categories.trending} />
      <CategorySection
        title="Bollywood Hits"
        songs={categories.bollywoodHits}
      />
      <CategorySection
        title="Top Hollywood Songs"
        songs={categories.hollywoodSongs}
      />
    </div>
  );
};

export default HomeCategories;
