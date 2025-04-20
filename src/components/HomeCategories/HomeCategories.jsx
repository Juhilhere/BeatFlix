import { useState, useEffect } from "react";
import axios from "axios";
import SongCard from "../SongCard/SongCard";
import "./HomeCategories.css";

const HomeCategories = ({ onSelectSong }) => {
  const [categories, setCategories] = useState({
    hollywoodTopArtists: [],
    bollywoodTopArtists: [],
    trending: [],
    allTimeBest: [],
    dailyMix: [],
    weeklyTop: [],
    bollywoodHits: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorySongs = async () => {
      try {
        const hollywoodTopArtists = await axios.get(
          "https://saavn.dev/api/search/songs?query=taylor swift ed sheeran justin bieber"
        );
        const bollywoodTopArtists = await axios.get(
          "https://saavn.dev/api/search/songs?query=arijit singh shreya ghoshal"
        );
        const trending = await axios.get(
          "https://saavn.dev/api/search/songs?query=trending"
        );
        const allTimeBest = await axios.get(
          "https://saavn.dev/api/search/songs?query=all time hits"
        );
        const dailyMix = await axios.get(
          "https://saavn.dev/api/search/songs?query=new releases"
        );
        const weeklyTop = await axios.get(
          "https://saavn.dev/api/search/songs?query=weekly top"
        );
        const bollywoodHits = await axios.get(
          "https://saavn.dev/api/search/songs?query=bollywood hits"
        );

        setCategories({
          hollywoodTopArtists: hollywoodTopArtists.data.data.results.slice(
            0,
            10
          ),
          bollywoodTopArtists: bollywoodTopArtists.data.data.results.slice(
            0,
            10
          ),
          trending: trending.data.data.results.slice(0, 10),
          allTimeBest: allTimeBest.data.data.results.slice(0, 10),
          dailyMix: dailyMix.data.data.results.slice(0, 10),
          weeklyTop: weeklyTop.data.data.results.slice(0, 10),
          bollywoodHits: bollywoodHits.data.data.results.slice(0, 10),
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
        title="Top Hollywood Artists"
        songs={categories.hollywoodTopArtists}
      />
      <CategorySection
        title="Top Bollywood Artists"
        songs={categories.bollywoodTopArtists}
      />
      <CategorySection title="Trending Songs" songs={categories.trending} />
      <CategorySection title="All Time Best" songs={categories.allTimeBest} />
      <CategorySection title="Daily Mix" songs={categories.dailyMix} />
      <CategorySection title="Weekly Top" songs={categories.weeklyTop} />
      <CategorySection
        title="Bollywood Top Hits"
        songs={categories.bollywoodHits}
      />
    </div>
  );
};

export default HomeCategories;
