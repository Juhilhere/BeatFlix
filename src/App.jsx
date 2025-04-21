import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import Search from "./components/Search/Search";
import MusicPlayer from "./components/MusicPlayer/MusicPlayer";
import HomeCategories from "./components/HomeCategories/HomeCategories";
import SongCard from "./components/SongCard/SongCard";

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem("beatflix-liked-songs");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("beatflix-liked-songs", JSON.stringify(likedSongs));
  }, [likedSongs]);

  const handleSelectSong = (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(false);
    }
  };

  const handleToggleLike = (song) => {
    setLikedSongs((prev) => {
      const isLiked = prev.some((s) => s.id === song.id);
      if (isLiked) {
        return prev.filter((s) => s.id !== song.id);
      } else {
        return [...prev, song];
      }
    });
  };

  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <div className="logo">
            <NavLink to="/">
              <img
                src="/src/assets/Logo.jpg"
                alt="BeatFlix"
                className="app-logo"
              />
              <h1>BeatFlix</h1>
            </NavLink>
          </div>
          <nav className="nav-links">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/liked">Liked Songs</NavLink>
          </nav>
          <div className="search-wrapper">
            <Search
              onSelectSong={handleSelectSong}
              currentSongId={currentSong?.id}
              isPlaying={isPlaying}
            />
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={
                <HomeCategories
                  onSelectSong={handleSelectSong}
                  currentSongId={currentSong?.id}
                  isPlaying={isPlaying}
                  onToggleLike={handleToggleLike}
                  likedSongs={likedSongs}
                />
              }
            />
            <Route
              path="/liked"
              element={
                <div className="library-page">
                  <h1>Liked Songs</h1>
                  {likedSongs.length > 0 ? (
                    <div className="songs-grid">
                      {likedSongs.map((song) => (
                        <SongCard
                          key={song.id}
                          song={song}
                          onSelect={handleSelectSong}
                          isCurrentSong={currentSong?.id === song.id}
                          isPlaying={currentSong?.id === song.id && isPlaying}
                          onToggleLike={handleToggleLike}
                          isLiked={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-library">
                      <div className="empty-illustration">♫</div>
                      <h2>No Liked Songs Yet</h2>
                      <p>Start liking songs and they will appear here.</p>
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
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onToggleLike={handleToggleLike}
            isLiked={likedSongs.some((s) => s.id === currentSong.id)}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
