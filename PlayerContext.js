import React, { createContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { fetchSpotifyData } from './utils/spotify'; // Adjust the import path
import { supabase } from './config/supabaseClient'; // Adjust the import path

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [genres, setGenres] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [trendingHits, setTrendingHits] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topCharts, setTopCharts] = useState([]);
  const [madeForYou, setMadeForYou] = useState([]);
  const [moods, setMoods] = useState([]);
  const [songs, setSongs] = useState([]); // State to store songs from Supabase
  const [loading, setLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    fetchInitialData();
    fetchSupabaseSongs();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const albumsData = await fetchSpotifyData('browse/new-releases');
      const playlistsData = await fetchSpotifyData('browse/featured-playlists');
      // const recentlyPlayedData = await fetchSpotifyData('playlists/37i9dQZF1DXcBWIGoYBM5M/tracks');
      // const genresData = await fetchSpotifyData('recommendations/available-genre-seeds');
      // const recommendationsData = await fetchSpotifyData('recommendations?seed_genres=pop');
      // const trendingHitsData = await fetchSpotifyData('playlists/37i9dQZF1DXcBWIGoYBM5M/tracks');
      const newReleasesData = await fetchSpotifyData('browse/new-releases');
      const topChartsData = await fetchSpotifyData('browse/featured-playlists');
      const madeForYouData = await fetchSpotifyData('browse/featured-playlists');
      const moodsData = await fetchSpotifyData('browse/categories');

      setAlbums(albumsData.albums.items || []);
      setPlaylists(playlistsData.playlists.items || []);
      // setRecentlyPlayed(recentlyPlayedData.items.filter(item => item.track.preview_url) || []);
      // setGenres(genresData.genres || []);
      // setTrendingHits(trendingHitsData.items.filter(item => item.track.preview_url) || []);
      setNewReleases(newReleasesData.albums.items || []);
      setTopCharts(topChartsData.playlists.items || []);
      setMadeForYou(madeForYouData.playlists.items || []);
      setMoods(moodsData.categories.items || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupabaseSongs = async () => {
    try {
      const { data: artistFolders, error: artistError } = await supabase.storage.from('Music').list('Artist');

      if (artistError) {
        console.error('Error fetching artists:', artistError);
        return [];
      }

      const songList = await Promise.all(
        artistFolders.map(async (artist) => {
          const artistPath = `Artist/${artist.name}`;
          const { data: songFolders, error: songError } = await supabase.storage.from('Music').list(artistPath);

          if (songError) {
            console.error(`Error fetching songs for artist ${artist.name}:`, songError);
            return [];
          }

          return await Promise.all(
            songFolders.map(async (song) => {
              const songPath = `${artistPath}/${song.name}`;
              const mp3FilePath = `${songPath}/${song.name}.mp3`;
              const coverImagePath = `${songPath}/${song.name}.jpeg`;

              console.log('Attempting to fetch:', mp3FilePath, coverImagePath);

              const { data: mp3Data, error: mp3Error } = await supabase.storage.from('Music').createSignedUrl(mp3FilePath, 3600);
              const { data: coverImageData, error: coverImageError } = await supabase.storage.from('Music').createSignedUrl(coverImagePath, 3600);

              if (mp3Error) {
                console.error(`Error fetching audio URL for song ${song.name}:`, mp3Error.message);
                return null;
              }
              if (coverImageError) {
                console.error(`Error fetching cover image for song ${song.name}:`, coverImageError.message);
                return null;
              }

              return {
                id: `${artist.name}-${song.name}`,
                title: song.name,
                artist: artist.name,
                image: coverImageData ? { uri: coverImageData.signedUrl } : require('./assets/Davido.png'),
                audio_path: mp3Data ? mp3Data.signedUrl : null,
              };
            })
          );
        })
      );

      setSongs(songList.flat().filter(song => song !== null)); // Update the state with the fetched songs
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const onSliderValueChange = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value);
      setPosition(value);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(async () => {
        const status = await sound.getStatusAsync();
        setPosition(status.positionMillis);
      }, 1000);
    } else if (!isPlaying && interval !== null) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, sound]);

  const playSound = async (source) => {
    try {
      const { sound: newSound, status } = await Audio.Sound.createAsync({ uri: source }, { shouldPlay: true });
      setSound(newSound);
      setDuration(status.durationMillis);
      setIsPlaying(true);
      setLoading(false);
    } catch (error) {
      console.error('Error playing sound:', error);
      setLoading(false);
    }
  };

  const playSupabaseSound = async (song) => {
    try {
      if (!song?.audio_path) {
        console.error('No audio path provided for the song');
        return;
      }
  
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: song.audio_path },
        { shouldPlay: true }
      );
  
      setSound(newSound);
      setDuration(status.durationMillis);
      setIsPlaying(true);
      setLoading(false);
    } catch (error) {
      console.error('Error playing sound:', error);
      setLoading(false);
    }
  };
  

  return (
    <PlayerContext.Provider
      value={{
        sound,
        isPlaying,
        duration,
        position,
        togglePlayPause,
        onSliderValueChange,
        playSound,
        playSupabaseSound,
        albums,
        playlists,
        recentlyPlayed,
        genres,
        recommendations,
        trendingHits,
        newReleases,
        topCharts,
        madeForYou,
        moods,
        songs, // Including Supabase songs in the context value
        loading,
        currentSong,
        setCurrentSong,
        fetchInitialData,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
