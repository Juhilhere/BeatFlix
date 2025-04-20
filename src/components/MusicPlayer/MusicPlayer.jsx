import { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';

const MusicPlayer = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    // Reset player when song changes
    if (song) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [song]);

  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio || !song) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [song]);

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

  // Format time in MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Get audio URL from song object
  const getAudioUrl = () => {
    if (!song || !song.downloadUrl || song.downloadUrl.length === 0) {
      return null;
    }
    
    // Get the highest quality audio available
    const sortedDownloadOptions = [...song.downloadUrl].sort((a, b) => {
      const qualityA = parseInt(a.quality.replace(/[^\d]/g, ''));
      const qualityB = parseInt(b.quality.replace(/[^\d]/g, ''));
      return qualityB - qualityA; // Sort in descending order of quality
    });
    
    return sortedDownloadOptions[0].url;
  };

  if (!song) return null;

  return (
    <div className="music-player">
      <div className="player-content">
        <div className="player-left">
          <img 
            src={song.image && song.image.length > 0 ? song.image[1]?.url : 'https://via.placeholder.com/50'} 
            alt={song.name} 
            className="player-thumbnail" 
          />
          <div className="player-info">
            <h4 className="player-title">{song.name}</h4>
            <p className="player-artist">
              {song.artists && song.artists.primary 
                ? song.artists.primary.map(artist => artist.name).join(', ') 
                : 'Unknown Artist'}
            </p>
          </div>
        </div>
        
        <div className="player-center">
          <div className="player-controls">
            <button className="control-button skip-prev">⏮</button>
            <button className="control-button play-pause" onClick={togglePlayPause}>
              {isPlaying ? '❚❚' : '▶'}
            </button>
            <button className="control-button skip-next">⏭</button>
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
          <button className="control-button volume">🔊</button>
        </div>
      </div>
      
      <audio 
        ref={audioRef}
        src={getAudioUrl()}
      />
    </div>
  );
};

export default MusicPlayer;