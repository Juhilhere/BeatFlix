import React, { useState } from "react";
import "./SongCard.css";

const SongCard = ({
  song,
  onSelect,
  isCurrentSong,
  isPlaying,
  onToggleLike,
  isLiked,
}) => {
  const [imageError, setImageError] = useState(false);

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(song);
    }
  };

  const handleCardClick = (e) => {
    if (
      !e.target.closest(".play-button") &&
      !e.target.closest(".like-button")
    ) {
      handlePlayPause(e);
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (onToggleLike) {
      onToggleLike(song);
    }
  };

  const getImageUrl = () => {
    if (
      imageError ||
      !song.image ||
      !Array.isArray(song.image) ||
      song.image.length === 0
    ) {
      return "https://via.placeholder.com/150";
    }
    const highQualityImage = song.image.find(
      (img) => img.quality === "500x500" && img.url
    );
    return (
      highQualityImage?.url ||
      song.image[0]?.url ||
      "https://via.placeholder.com/150"
    );
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={`song-card ${isCurrentSong ? "current" : ""}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      <div className="song-image-container">
        <img
          src={getImageUrl()}
          alt={song.name}
          className="song-image"
          onError={handleImageError}
        />
        <div className="song-controls">
          <button
            className={`play-button ${isPlaying ? "playing" : ""}`}
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
        </div>
        <button
          className={`like-button ${isLiked ? "liked" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            handleLikeClick(e);
          }}
          aria-label={
            isLiked ? "Remove from liked songs" : "Add to liked songs"
          }
        >
          {isLiked ? "♥" : "♡"}
        </button>
      </div>

      <div className="song-info">
        <h3 className="song-title">{song.name}</h3>
        <p className="song-artist">
          {song.artists && song.artists.primary
            ? song.artists.primary.map((artist) => artist.name).join(", ")
            : "Unknown Artist"}
        </p>
        <p className="song-album">{song.album ? song.album.name : ""}</p>
        <p className="song-duration">{formatDuration(song.duration)}</p>
      </div>
    </div>
  );
};

export default SongCard;
