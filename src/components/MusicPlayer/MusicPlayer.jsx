import { useState, useRef, useEffect } from "react";
import "./MusicPlayer.css";

const MusicPlayer = ({
  song,
  isPlaying,
  setIsPlaying,
  onToggleLike,
  isLiked,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem("beatflix-volume");
    return savedVolume ? parseFloat(savedVolume) : 1;
  });
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    localStorage.setItem("beatflix-volume", volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle audio element setup and cleanup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0;
    };

    const handleError = (e) => {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    // Load new audio source
    if (audio.src !== getAudioUrl()) {
      setIsLoading(true);
      audio.src = getAudioUrl();
      audio.load();
      setIsLoading(false);
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [song]);

  // Handle play state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Playback error:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, song]);

  // Add keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!song) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [song, isPlaying, setIsPlaying]);

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    const seekTime = (e.target.value / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getAudioUrl = () => {
    if (!song || !song.downloadUrl || song.downloadUrl.length === 0) {
      return null;
    }

    const sortedDownloadOptions = [...song.downloadUrl].sort((a, b) => {
      const qualityA = parseInt(a.quality.replace(/[^\d]/g, ""));
      const qualityB = parseInt(b.quality.replace(/[^\d]/g, ""));
      return qualityB - qualityA;
    });

    return sortedDownloadOptions[0].url;
  };

  if (!song) return null;

  return (
    <div className="music-player">
      <div className="player-content">
        <div className="player-left">
          <img
            src={
              song.image && song.image.length > 0
                ? song.image[1]?.url || song.image[0]?.url
                : "https://via.placeholder.com/50"
            }
            alt={song.name}
            className="player-thumbnail"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/50";
            }}
          />
          <div className="player-info">
            <h4 className="player-title">{song.name}</h4>
            <p className="player-artist">
              {song.artists && song.artists.primary
                ? song.artists.primary.map((artist) => artist.name).join(", ")
                : "Unknown Artist"}
            </p>
          </div>
          <button
            className={`player-like-button ${isLiked ? "liked" : ""}`}
            onClick={() => onToggleLike(song)}
            aria-label={
              isLiked ? "Remove from liked songs" : "Add to liked songs"
            }
          >
            {isLiked ? "♥" : "♡"}
          </button>
        </div>

        <div className="player-center">
          <div className="player-controls">
            <button
              className={`control-button play-pause ${
                isLoading ? "loading" : ""
              }`}
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isLoading}
            >
              {isLoading ? "⌛" : isPlaying ? "❚❚" : "▶"}
            </button>
          </div>

          <div className="player-progress">
            <span className="time-current">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="progress-bar"
            />
            <span className="time-total">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-right">
          <div className="volume-control">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        preload="auto"
        onError={(e) => console.error("Audio error:", e)}
      />
    </div>
  );
};

export default MusicPlayer;
