import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import Search from "./components/Search/Search";
import MusicPlayer from "./components/MusicPlayer/MusicPlayer";
import HomeCategories from "./components/HomeCategories/HomeCategories";

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);

  const handleSelectSong = (song) => {
    setCurrentSong(song);
    setQueue([song]);
    setQueueIndex(0);
  };

  const addToQueue = (song) => {
    setQueue((prevQueue) => [...prevQueue, song]);
  };

  const playNext = () => {
    if (queueIndex < queue.length - 1) {
      setQueueIndex((prev) => prev + 1);
      setCurrentSong(queue[queueIndex + 1]);
      return true;
    }
    return false;
  };

  const playPrevious = () => {
    if (queueIndex > 0) {
      setQueueIndex((prev) => prev - 1);
      setCurrentSong(queue[queueIndex - 1]);
      return true;
    }
    return false;
  };

  const handleQueueItemClick = (index) => {
    setQueueIndex(index);
    setCurrentSong(queue[index]);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <div className="logo">
            <NavLink to="/">
              <img src="/vite.svg" alt="BeatFlix" className="app-logo" />
              <h1>BeatFlix</h1>
            </NavLink>
          </div>
          <nav className="nav-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/explore">Explore</NavLink>
            <NavLink to="/library">Library</NavLink>
          </nav>
          <div className="search-wrapper">
            <Search onSelectSong={handleSelectSong} onAddToQueue={addToQueue} />
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={
                <HomeCategories
                  onSelectSong={handleSelectSong}
                  onAddToQueue={addToQueue}
                />
              }
            />
            <Route
              path="/explore"
              element={
                <div className="explore-page">
                  <h1>Explore Music</h1>
                  <Search onSelectSong={handleSelectSong} onAddToQueue={addToQueue} fullWidth />
                </div>
              }
            />
            <Route
              path="/library"
              element={
                <div className="library-page">
                  <h1>Your Library</h1>
                  {queue.length > 0 ? (
                    <div className="queue-list">
                      {queue.map((song, index) => (
                        <div
                          key={`${song.id}-${index}`}
                          className={`queue-item ${index === queueIndex ? 'active' : ''}`}
                          onClick={() => handleQueueItemClick(index)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleQueueItemClick(index);
                            }
                          }}
                        >
                          <img
                            src={song.image?.[0]?.url || "https://via.placeholder.com/50"}
                            alt={song.name}
                          />
                          <div className="song-info">
                            <h3>{song.name}</h3>
                            <p>
                              {song.artists?.primary?.[0]?.name || "Unknown Artist"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-library">
                      <div className="empty-illustration">🎵</div>
                      <h2>Your Library is Empty</h2>
                      <p>Start adding songs to your library by clicking the + button on any song</p>
                      <NavLink to="/explore" className="explore-button">
                        Explore Music
                      </NavLink>
                    </div>
                  )}
                </div>
              }
            />
          </Routes>
        </main>

        {currentSong && (
          <MusicPlayer
            song={currentSong}
            onNext={playNext}
            onPrevious={playPrevious}
            hasNext={queueIndex < queue.length - 1}
            hasPrevious={queueIndex > 0}
            queue={queue}
            currentQueueIndex={queueIndex}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
