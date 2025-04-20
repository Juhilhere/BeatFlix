import { useState, useEffect } from "react";
import axios from "axios";
import SongCard from "../SongCard/SongCard";
import "./HomeCategories.css";

const HomeCategories = ({ onSelectSong, onAddToQueue }) => {
  const [categories, setCategories] = useState({
    bollywoodTopArtists: [],
    trending: [],
    bollywoodHits: [],
    hollywoodSongs: [], // Added new category
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchCategorySongs = async () => {
      try {
        const bollywoodTopArtists = await axios.get(
          "https://saavn.dev/api/search/songs?query=arijit singh shreya ghoshal"
        );
        const trending = await axios.get(
          "https://saavn.dev/api/search/songs?query=trending"
        );
        const bollywoodHits = await axios.get(
          "https://saavn.dev/api/search/songs?query=bollywood hits"
        );
        const hollywoodSongs = await axios.get(
          "https://saavn.dev/api/search/songs?query=taylor swift ed sheeran weeknd"
        );

        setCategories({
          bollywoodTopArtists: removeDuplicateSongs(
            bollywoodTopArtists.data.data.results
          ).slice(0, 10),
          trending: removeDuplicateSongs(trending.data.data.results).slice(
            0,
            10
          ),
          bollywoodHits: removeDuplicateSongs(
            bollywoodHits.data.data.results
          ).slice(0, 10),
          hollywoodSongs: removeDuplicateSongs(
            hollywoodSongs.data.data.results
          ).slice(0, 10),
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching category songs:", err);
        setError("Failed to fetch songs. Please try again later.");
        setLoading(false);
      }
    };

    fetchCategorySongs();
  }, []);

  const CategorySection = ({ title, songs }) => (
    <div className="category-section">
      <h2 className="category-title">{title}</h2>
      <div className="category-songs">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onSelect={() => onSelectSong(song)}
            onAddToQueue={onAddToQueue}
          />
        ))}
      </div>
    </div>
  );

  if (loading) return <div className="loading">Loading categories...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-categories">
      <CategorySection
        title="Top Bollywood Artists"
        songs={categories.bollywoodTopArtists}
      />
      <CategorySection title="Trending Songs" songs={categories.trending} />
      <CategorySection
        title="Bollywood Top Hits"
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
