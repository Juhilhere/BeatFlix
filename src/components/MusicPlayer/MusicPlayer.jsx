import { useState, useRef, useEffect } from "react";
import "./MusicPlayer.css";

const MusicPlayer = ({
  song,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  queue,
  currentQueueIndex,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showQueue, setShowQueue] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Reset player when song changes
    if (song) {
      setIsPlaying(false);
      setCurrentTime(0);
      const audio = audioRef.current;
      if (audio) {
        audio.load();
        audio.play().then(() => setIsPlaying(true));
      }
    }
  }, [song]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !song) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (hasNext) {
        onNext();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [song, hasNext, onNext]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    const seekTime = (e.target.value / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
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
                ? song.image[1]?.url
                : "https://via.placeholder.com/50"
            }
            alt={song.name}
            className="player-thumbnail"
          />
          <div className="player-info">
            <h4 className="player-title">{song.name}</h4>
            <p className="player-artist">
              {song.artists && song.artists.primary
                ? song.artists.primary.map((artist) => artist.name).join(", ")
                : "Unknown Artist"}
            </p>
          </div>
        </div>

        <div className="player-center">
          <div className="player-controls">
            <button
              className="control-button skip-prev"
              onClick={onPrevious}
              disabled={!hasPrevious}
            >
              ⏮
            </button>
            <button
              className="control-button play-pause"
              onClick={togglePlayPause}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>
            <button
              className="control-button skip-next"
              onClick={onNext}
              disabled={!hasNext}
            >
              ⏭
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
          <button
            className={`control-button queue-toggle ${
              showQueue ? "active" : ""
            }`}
            onClick={() => setShowQueue(!showQueue)}
            title="Show queue"
          >
            🎵
          </button>
        </div>
      </div>

      {showQueue && (
        <div className="queue-panel">
          <h3>Up Next</h3>
          <div className="queue-list">
            {queue.map((queuedSong, index) => (
              <div
                key={`${queuedSong.id}-${index}`}
                className={`queue-item ${
                  index === currentQueueIndex ? "active" : ""
                }`}
              >
                <img
                  src={
                    queuedSong.image && queuedSong.image.length > 0
                      ? queuedSong.image[0]?.url
                      : "https://via.placeholder.com/32"
                  }
                  alt={queuedSong.name}
                />
                <div className="queue-item-info">
                  <span className="queue-item-title">{queuedSong.name}</span>
                  <span className="queue-item-artist">
                    {queuedSong.artists?.primary?.[0]?.name || "Unknown Artist"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <audio ref={audioRef} src={getAudioUrl()} />
    </div>
  );
};

export default MusicPlayer;
