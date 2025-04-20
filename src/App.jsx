import { useState } from "react";
import "./App.css";
import Search from "./components/Search/Search";
import MusicPlayer from "./components/MusicPlayer/MusicPlayer";
import HomeCategories from "./components/HomeCategories/HomeCategories";

function App() {
  const [currentSong, setCurrentSong] = useState(null);

  // Function to handle song selection
  const handleSelectSong = (song) => {
    setCurrentSong(song);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <img src="/vite.svg" alt="BeatFlix" className="app-logo" />
          <h1>BeatFlix</h1>
        </div>
        <div className="search-wrapper">
          <Search onSelectSong={handleSelectSong} />
        </div>
      </header>

      <main className="app-main">
        <HomeCategories onSelectSong={handleSelectSong} />
      </main>

      {currentSong && <MusicPlayer song={currentSong} />}
    </div>
  );
}

export default App;
