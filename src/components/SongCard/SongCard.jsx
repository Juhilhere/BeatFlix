import React, { useState } from "react";
import "./SongCard.css";

const SongCard = ({ song, onSelect, onAddToQueue }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to format duration from seconds to MM:SS format
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (onSelect) {
      onSelect(song);
    }
  };

  const handleAddToQueue = (e) => {
    e.stopPropagation();
    if (onAddToQueue) {
      onAddToQueue(song);
    }
  };

  // Find highest quality image
  const getImageUrl = () => {
    if (!song.image || song.image.length === 0) {
      return "https://via.placeholder.com/150"; // Default placeholder if no image
    }

    // Find the highest quality image or use the first one
    const highQualityImage = song.image.find(
      (img) => img.quality === "500x500"
    );
    return highQualityImage ? highQualityImage.url : song.image[0].url;
  };

  // Get best quality audio URL
  const getAudioUrl = () => {
    if (!song.downloadUrl || song.downloadUrl.length === 0) {
      return null;
    }

    // Get the highest quality audio available
    const sortedDownloadOptions = [...song.downloadUrl].sort((a, b) => {
      const qualityA = parseInt(a.quality.replace(/[^\d]/g, ""));
      const qualityB = parseInt(b.quality.replace(/[^\d]/g, ""));
      return qualityB - qualityA; // Sort in descending order of quality
    });

    return sortedDownloadOptions[0].url;
  };

  return (
    <div className="song-card">
      <div className="song-image-container">
        <img src={getImageUrl()} alt={song.name} className="song-image" />
        <div className="song-controls">
          <button
            className={`play-button ${isPlaying ? "playing" : ""}`}
            onClick={handlePlayPause}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <button
            className="queue-button"
            onClick={handleAddToQueue}
            title="Add to queue"
          >
            +
          </button>
        </div>
      </div>

      <div className="song-info">
        <h3 className="song-title">{song.name}</h3>
        <p className="song-artist">
          {song.artists && song.artists.primary
            ? song.artists.primary.map((artist) => artist.name).join(", ")
            : "Unknown Artist"}
        </p>
        <p className="song-album">{song.album ? song.album.name : ""}</p>
        <p className="song-duration">{formatDuration(song.duration || 0)}</p>
      </div>

      {/* Hidden audio element for playing the song */}
      {getAudioUrl() && <audio src={getAudioUrl()} id={`audio-${song.id}`} />}
    </div>
  );
};

export default SongCard;
